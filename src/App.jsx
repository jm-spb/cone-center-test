import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [ input, setInput ] = useState('01/January/2021 20:00:05');
  const [ selectionStart, setSelectionStart ] = useState(0);
  const [ selectionEnd, setSelectionEnd ] = useState(0);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  let [ day, month, year, hour, min, sec ] = input.split(/\W/);

  let inputDate = new Date(input);

  // console.log(selectionStart);
  // console.log(selectionEnd);
  // console.log(input.length);

  const ref = useRef();

  useEffect(
    () => {
      ref.current.setSelectionRange(selectionStart, selectionEnd);
    },
    [ input, selectionStart, selectionEnd ]
  );

  const handleOnChange = (e) => {
    setInput(e.target.value);
  };

  const increment = (value) => {
    if (Number.isFinite(Number(value))) {
      value = (Number(value) + 1).toString();
      value = value.length < 2 ? `0${value}` : value;
    } else {
      let idx = months.indexOf(value);
      if (idx === 11) idx = -1;
      value = months[idx + 1];
    }
    return value;
  };

  const decrement = (value) => {
    if (Number.isFinite(Number(value))) {
      value = (Number(value) - 1).toString();
      value = value.length < 2 ? `0${value}` : value;
    } else {
      let idx = months.indexOf(value);
      if (idx === 0) idx = 12;
      value = months[idx - 1];
    }
    return value;
  };

  const handleIncDecOnCtrlArrow = (selected, incDecOption) => {
    let value;
    switch (selected) {
      case 'day':
        value = incDecOption === 'increment' ? inputDate.getDate() + 1 : inputDate.getDate() - 1;
        break;

      default:
        break;
    }

    return value;
  };

  const handleIncDec = (posStart, posEnd, toggleIncDec, onCtrlArrowPress, toggleIncDecOnCtrlArrow, incDecOption) => {
    let value;
    if (posStart === -1) {
      value = day;
      day = onCtrlArrowPress ? toggleIncDecOnCtrlArrow('day', incDecOption) : toggleIncDec(value);
    }
    if (posStart === 2) {
      value = month;
      month = toggleIncDec(value);
      value = month;
    }
    if (posEnd === input.length - 9) {
      value = year;
      year = toggleIncDec(value);
    }
    if (posEnd === input.length - 6) {
      value = hour;
      hour = toggleIncDec(value);
    }
    if (posEnd === input.length - 3) {
      value = min;
      min = toggleIncDec(value);
    }
    if (posEnd === input.length) {
      value = sec;
      sec = toggleIncDec(value);
    }

    return value;
  };

  // const handleDateFormat = () => {
  //   if (hour === '24') hour = '00';
  //   if (hour === '-1') hour = '23';
  //   if (min === '60') min = '00';
  //   if (min === '-1') min = '59';
  //   if (sec === '60') sec = '00';
  //   if (sec === '-1') sec = '59';
  // };

  // const onCtrlArrowPress = (toggleIncDec) => {
  //   if (min === '60') {
  //     hour = toggleIncDec(hour);
  //   }
  //   if (min === '-1') {
  //     hour = toggleIncDec(hour);
  //   }
  //   if (sec === '60') {
  //     min = toggleIncDec(min);
  //   }
  //   if (sec === '-1') {
  //     min = toggleIncDec(min);
  //   }
  // };

  const handleType = (e) => {
    const caretPosition = e.target.selectionStart;

    let start = caretPosition;
    let end = caretPosition;

    const inputArrayOfChars = e.target.value.split('');
    const matсhes = e.target.value.match(/[a-zA-Z]|\d/g);

    // Selection from current caret position to right
    do {
      if (!matсhes.includes(inputArrayOfChars[end])) {
        end -= 1;
      }
      end += 1;
    } while (matсhes.includes(inputArrayOfChars[end]));

    // Selection from current caret position to left
    do {
      start -= 1;
    } while (matсhes.includes(inputArrayOfChars[start]));

    // Arrow Up
    if (e.keyCode === 38) {
      e.preventDefault();

      // let newValue = handleIncDec(start, end, increment);

      if (e.ctrlKey) {
        // onCtrlArrowPress(increment);
      }

      // handleDateFormat();

      setInput(`${day}/${month}/${year} ${hour}:${min}:${sec}`);
      setSelectionStart(start + 1);
      setSelectionEnd(start + 1 + newValue.length);
    }

    // Arrow Down
    if (e.keyCode === 40) {
      e.preventDefault();

      let newValue = handleIncDec(start, end, decrement);

      // if (e.ctrlKey) {
      //   onCtrlArrowPress(decrement);
      // }

      // handleDateFormat();

      setInput(`${day}/${month}/${year} ${hour}:${min}:${sec}`);
      setSelectionStart(start + 1);
      setSelectionEnd(start + 1 + newValue.length);
    }
  };

  return (
    <div>
      <input ref={ref} type="text" value={input} name="date" onChange={handleOnChange} onKeyDown={handleType} />
    </div>
  );
};

export default App;
