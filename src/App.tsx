import React, { useState, useEffect, useRef } from 'react';

import './App.css';

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

  const ref = useRef<HTMLInputElement>(null!);

  useEffect(
    () => {
      ref.current.setSelectionRange(selectionStart, selectionEnd);
    },
    [ input, selectionStart, selectionEnd ]
  );

  const inputDate = new Date(input);

  let [
    dayStringValue,
    monthStringValue,
    yearStringValue,
    hoursStringValue,
    minutesStringValue,
    secondsStringValue
  ]: string[] = input.split(/\W/);

  let dayIntValue = inputDate.getDate();
  let monthIntValue = inputDate.getMonth();
  let yearIntValue = inputDate.getFullYear();
  let hoursIntValue = inputDate.getHours();
  let minutesIntValue = inputDate.getMinutes();
  let secondsIntValue = inputDate.getSeconds();

  let hoursStartPosition = false;
  let minutesStartPosition = false;
  let secondsStartPosition = false;

  let changeInput = false;

  const changeInputRegExp = /[0-9]{2}\/[a-zA-Z]{3,}\/[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}/g;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setSelectionStart(e.target.value.length);
    setSelectionEnd(e.target.value.length);
  };

  const dateFormat = (value: string) => (value.length < 2 ? `0${value}` : value);

  const handleIncDec = (selected: string, incDecOption: string, toggleCtrlArrowPress?: boolean): number => {
    let setDateValue = 0;

    switch (selected) {
      case 'day':
        if (incDecOption === 'increment') {
          inputDate.setDate(dayIntValue + 1);
        }
        if (incDecOption === 'decrement') {
          inputDate.setDate(dayIntValue - 1);
        }

        setDateValue = inputDate.getDate();
        break;

      case 'month':
        setDateValue =
          incDecOption === 'increment' ? months.indexOf(monthStringValue) + 1 : months.indexOf(monthStringValue) - 1;

        if (setDateValue === 12) setDateValue = 0;
        if (setDateValue === -1) setDateValue = 11;

        if (toggleCtrlArrowPress) {
          if (incDecOption === 'increment') {
            inputDate.setMonth(monthIntValue + 1);
          }
          if (incDecOption === 'decrement') {
            inputDate.setMonth(monthIntValue - 1);
          }

          setDateValue = inputDate.getMonth();
        }
        break;

      case 'year':
        if (incDecOption === 'increment') {
          inputDate.setFullYear(yearIntValue + 1);
        }
        if (incDecOption === 'decrement') {
          inputDate.setFullYear(yearIntValue - 1);
        }

        setDateValue = inputDate.getFullYear();
        break;

      case 'hours':
        if (incDecOption === 'increment') {
          inputDate.setHours(hoursIntValue + 1);
        }
        if (incDecOption === 'decrement') {
          inputDate.setHours(hoursIntValue - 1);
        }

        setDateValue = inputDate.getHours();
        break;

      case 'minutes':
        if (incDecOption === 'increment') {
          inputDate.setMinutes(minutesIntValue + 1);
        }
        if (incDecOption === 'decrement') {
          inputDate.setMinutes(minutesIntValue - 1);
        }

        setDateValue = inputDate.getMinutes();
        break;

      case 'seconds':
        if (incDecOption === 'increment') {
          inputDate.setSeconds(secondsIntValue + 1);
        }
        if (incDecOption === 'decrement') {
          inputDate.setSeconds(secondsIntValue - 1);
        }

        setDateValue = inputDate.getSeconds();
        break;

      default:
        throw new Error('enter valid date value');
    }

    return setDateValue;
  };

  const captureSelectedInput = (
    posStart: number,
    posEnd: number,
    toggleIncDec: (a: string, b: string, c?: boolean) => number,
    incDecOption: string,
    toggleCtrlArrowPress?: boolean
  ) => {
    let setInputValue = '';

    if (posStart === -1) {
      dayIntValue = toggleIncDec('day', incDecOption);
      setInputValue = dayIntValue.toString();

      if (toggleCtrlArrowPress) {
        inputDate.setDate(dayIntValue);
      }
    }
    if (posStart === 2) {
      monthIntValue = toggleIncDec('month', incDecOption, toggleCtrlArrowPress);

      setInputValue = months[monthIntValue];

      if (toggleCtrlArrowPress) {
        inputDate.setMonth(monthIntValue);
      }
    }
    if (posEnd === input.length - 9) {
      yearIntValue = toggleIncDec('year', incDecOption);
      setInputValue = yearIntValue.toString();

      if (toggleCtrlArrowPress) {
        inputDate.setFullYear(yearIntValue);
      }
    }
    if (posEnd === input.length - 6) {
      hoursIntValue = toggleIncDec('hours', incDecOption);
      setInputValue = hoursIntValue.toString();

      if (toggleCtrlArrowPress) {
        inputDate.setHours(hoursIntValue);
        hoursStartPosition = true;
      }
    }
    if (posEnd === input.length - 3) {
      minutesIntValue = toggleIncDec('minutes', incDecOption);
      setInputValue = minutesIntValue.toString();

      if (toggleCtrlArrowPress) {
        inputDate.setMinutes(minutesIntValue);
        minutesStartPosition = true;
      }
    }
    if (posEnd === input.length) {
      secondsIntValue = toggleIncDec('seconds', incDecOption);
      setInputValue = secondsIntValue.toString();

      if (toggleCtrlArrowPress) {
        inputDate.setSeconds(secondsIntValue);
        secondsStartPosition = true;
      }
    }

    return dateFormat(setInputValue);
  };

  const handleDateChange = (
    startSelection: number,
    endSelection: number,
    incDecOption: string,
    toggleCtrlArrowPress: boolean
  ) => {
    const newValue = captureSelectedInput(
      startSelection,
      endSelection,
      handleIncDec,
      incDecOption,
      toggleCtrlArrowPress
    );

    if (toggleCtrlArrowPress) {
      dayIntValue = inputDate.getDate();
      monthIntValue = inputDate.getMonth();
      yearIntValue = inputDate.getFullYear();
      hoursIntValue = inputDate.getHours();
      minutesIntValue = inputDate.getMinutes();
      secondsIntValue = inputDate.getSeconds();
    }

    dayStringValue = dateFormat(dayIntValue.toString());
    monthStringValue = months[monthIntValue];
    yearStringValue = dateFormat(yearIntValue.toString());
    hoursStringValue = dateFormat(hoursIntValue.toString());
    minutesStringValue = dateFormat(minutesIntValue.toString());
    secondsStringValue = dateFormat(secondsIntValue.toString());

    const newInput = `${dayStringValue}/${monthStringValue}/${yearStringValue} ${hoursStringValue}:${minutesStringValue}:${secondsStringValue}`;

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

  if (input.match(changeInputRegExp)) changeInput = true;

  const handleType = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Parse input to valid date format on Enter key
    if (e.key === 'Enter') {
      let [ inputDay, inputMonth, inputYear, inputHours, inputMinutes, inputSeconds ] = input.split(' ');

      let inputMonthInt = 0;

      if (inputMonth && inputMonth.length < 3) {
        inputMonthInt = parseInt(inputMonth) - 1;
      }

      if (inputMonth && inputMonth.length > 2) {
        let found = months.filter((el) => el.toLowerCase().includes(inputMonth)).join('');
        inputMonthInt = months.indexOf(found);
      }

      let newInputDate = new Date(
        parseInt(inputYear) || 2021,
        inputMonthInt || 0,
        parseInt(inputDay) || 1,
        parseInt(inputHours) || 0,
        parseInt(inputMinutes) || 0,
        parseInt(inputSeconds) || 0
      );

      dayStringValue = dateFormat(newInputDate.getDate().toString());
      monthStringValue = months[newInputDate.getMonth()];
      yearStringValue = dateFormat(newInputDate.getFullYear().toString());
      hoursStringValue = dateFormat(newInputDate.getHours().toString());
      minutesStringValue = dateFormat(newInputDate.getMinutes().toString());
      secondsStringValue = dateFormat(newInputDate.getSeconds().toString());

      const newParseInput = `${dayStringValue}/${monthStringValue}/${yearStringValue} ${hoursStringValue}:${minutesStringValue}:${secondsStringValue}`;

      setInput(newParseInput);
    }

    // change date only on valid input
    if (changeInput) {
      let start = (e.target as HTMLInputElement).selectionStart!;
      let end = (e.target as HTMLInputElement).selectionStart!;

      const inputArrayOfChars = (e.target as HTMLInputElement).value.split('');
      const matсhes = (e.target as HTMLInputElement).value.match(/[a-zA-Z]|\d/g)!;

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

      if (e.code === 'ArrowUp' && !e.ctrlKey) {
        e.preventDefault();
        handleDateChange(start, end, 'increment', false);
      }

      if (e.code === 'ArrowDown' && !e.ctrlKey) {
        e.preventDefault();
        handleDateChange(start, end, 'decrement', false);
      }

      if (e.code === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        handleDateChange(start, end, 'increment', true);
      }

      if (e.code === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        handleDateChange(start, end, 'decrement', true);
      }
    }
  };

  return (
    <div className="wrapper">
      <input
        className="input"
        ref={ref}
        type="text"
        value={input}
        name="date"
        onChange={handleOnChange}
        onKeyDown={handleType}
      />
    </div>
  );
};

export default App;
