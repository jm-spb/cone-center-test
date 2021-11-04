import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [ input, setInput ] = useState('');
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

  const ref = useRef();

  useEffect(
    () => {
      ref.current.setSelectionRange(selectionStart, selectionEnd);
    },
    [ input, selectionStart, selectionEnd ]
  );

  let [ day, month, year, hours, minutes, seconds ] = input.split(/\W/);
  let inputDate = new Date(input);

  let hoursStartPosition = false;
  let minutesStartPosition = false;
  let secondsStartPosition = false;

  const handleOnChange = (e) => {
    setInput(e.target.value);
    setSelectionStart(e.target.value.length);
    setSelectionEnd(e.target.value.length);
  };

  const convertToString = (value) => {
    let valueAsString = value.toString();
    valueAsString = valueAsString.length < 2 ? `0${valueAsString}` : valueAsString;
    return valueAsString;
  };

  const handleIncDec = (selected, incDecOption, toggleCtrlArrowPress) => {
    let setDateValue;

    switch (selected) {
      case 'day':
        setDateValue =
          incDecOption === 'increment'
            ? inputDate.getDate(inputDate.setDate(inputDate.getDate() + 1))
            : inputDate.getDate(inputDate.setDate(inputDate.getDate() - 1));
        break;

      case 'month':
        setDateValue = incDecOption === 'increment' ? months.indexOf(month) + 1 : months.indexOf(month) - 1;

        if (setDateValue === 12) setDateValue = 0;
        if (setDateValue === -1) setDateValue = 11;

        if (toggleCtrlArrowPress) {
          setDateValue =
            incDecOption === 'increment'
              ? inputDate.getMonth(inputDate.setMonth(inputDate.getMonth() + 1))
              : inputDate.getMonth(inputDate.setMonth(inputDate.getMonth() - 1));
        }
        break;

      case 'year':
        setDateValue =
          incDecOption === 'increment'
            ? inputDate.getFullYear(inputDate.setFullYear(inputDate.getFullYear() + 1))
            : inputDate.getFullYear(inputDate.setFullYear(inputDate.getFullYear() - 1));
        break;

      case 'hours':
        setDateValue =
          incDecOption === 'increment'
            ? inputDate.getHours(inputDate.setHours(inputDate.getHours() + 1))
            : inputDate.getHours(inputDate.setHours(inputDate.getHours() - 1));
        break;

      case 'minutes':
        setDateValue =
          incDecOption === 'increment'
            ? inputDate.getMinutes(inputDate.setMinutes(inputDate.getMinutes() + 1))
            : inputDate.getMinutes(inputDate.setMinutes(inputDate.getMinutes() - 1));
        break;

      case 'seconds':
        setDateValue =
          incDecOption === 'increment'
            ? inputDate.getSeconds(inputDate.setSeconds(inputDate.getSeconds() + 1))
            : inputDate.getSeconds(inputDate.setSeconds(inputDate.getSeconds() - 1));
        break;

      default:
        break;
    }

    return setDateValue;
  };

  const captureSelectedInput = (posStart, posEnd, toggleIncDec, incDecOption, toggleCtrlArrowPress) => {
    let setInputValue;

    if (posStart === -1) {
      day = toggleIncDec('day', incDecOption);
      setInputValue = day;

      if (toggleCtrlArrowPress) {
        inputDate.setDate(day);
      }
    }
    if (posStart === 2) {
      const monthNumber = toggleIncDec('month', incDecOption, toggleCtrlArrowPress);
      month = months[monthNumber];
      setInputValue = month;

      if (toggleCtrlArrowPress) {
        inputDate.setMonth(monthNumber);
      }
    }
    if (posEnd === input.length - 9) {
      year = toggleIncDec('year', incDecOption);
      setInputValue = year;

      if (toggleCtrlArrowPress) {
        inputDate.setFullYear(year);
      }
    }
    if (posEnd === input.length - 6) {
      hours = toggleIncDec('hours', incDecOption);
      setInputValue = hours;

      if (toggleCtrlArrowPress) {
        inputDate.setHours(hours);
        hoursStartPosition = true;
      }
    }
    if (posEnd === input.length - 3) {
      minutes = toggleIncDec('minutes', incDecOption);
      setInputValue = minutes;

      if (toggleCtrlArrowPress) {
        inputDate.setMinutes(minutes);
        minutesStartPosition = true;
      }
    }
    if (posEnd === input.length) {
      seconds = toggleIncDec('seconds', incDecOption);
      setInputValue = seconds;

      if (toggleCtrlArrowPress) {
        inputDate.setSeconds(seconds);
        secondsStartPosition = true;
      }
    }

    return convertToString(setInputValue);
  };

  const handleDateChange = (startSelection, endSelection, incDecOption, toggleCtrlArrowPress) => {
    let newValue = captureSelectedInput(startSelection, endSelection, handleIncDec, incDecOption, toggleCtrlArrowPress);

    if (toggleCtrlArrowPress) {
      day = inputDate.getDate();
      month = months[inputDate.getMonth()];
      year = inputDate.getFullYear();
      hours = inputDate.getHours();
      minutes = inputDate.getMinutes();
      seconds = inputDate.getSeconds();
    }

    day = convertToString(day);
    year = convertToString(year);
    hours = convertToString(hours);
    minutes = convertToString(minutes);
    seconds = convertToString(seconds);

    let newInput = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    if (hoursStartPosition) {
      startSelection = newInput.length - 9;
    }

    if (minutesStartPosition) {
      startSelection = newInput.length - 6;
    }

    if (secondsStartPosition) {
      startSelection = newInput.length - 3;
    }

    setInput(newInput);
    setSelectionStart(startSelection + 1);
    setSelectionEnd(startSelection + 1 + newValue.length);
  };

  let change = false;

  const handleType = (e) => {
    if (change) {
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
      if (e.keyCode === 38 && !e.ctrlKey) {
        e.preventDefault();
        handleDateChange(start, end, 'increment', false);
      }

      // Arrow Down
      if (e.keyCode === 40 && !e.ctrlKey) {
        e.preventDefault();
        handleDateChange(start, end, 'decrement', false);
      }

      // Ctrl + Arrow Up
      if (e.keyCode === 38 && e.ctrlKey) {
        e.preventDefault();
        handleDateChange(start, end, 'increment', true);
      }

      // Ctrl + Arrow Down
      if (e.keyCode === 40 && e.ctrlKey) {
        e.preventDefault();
        handleDateChange(start, end, 'decrement', true);
      }
    }
  };

  return (
    <div>
      <input ref={ref} type="text" value={input} name="date" onChange={handleOnChange} onKeyDown={handleType} />
    </div>
  );
};

export default App;
