import React, { useState, useRef } from 'react';
import { CircularInput, CircularTrack, CircularThumb } from 'react-circular-input';

function CircularComponent() {
  const [ circularValue, setCircularValue ] = useState(0);
  const [ oldCircularValue, setOldCircularValue ] = useState(0);
  const [ timeValue, setTimeValue ] = useState('00:00');
  const [ loops, setLoops ] = useState(0);

  const references = useRef({ isTimerOn: false });

  const normalize = (time) => {
    return (time < 10 ? '0' : '') + time;
  };

  const baseTimes = [ ...Array(180).keys() ].map((auxValue) => {
    const seconds = auxValue % 60;
    const minutes = Math.floor(auxValue / 60);
    return normalize(minutes) + ':' + normalize(seconds);
  });

  const calculateActualTime = (time) => {
    const minutes = parseInt(time.split(':')[0]) + 3 * loops;
    const seconds = time.split(':')[1];
    return minutes + ':' + seconds;
  };

  const calculateActualCircularValue = (timeString) => {
    const minutes = parseInt(timeString.split(':')[0]);
    const seconds = parseInt(timeString.split(':')[1]);

    return ((minutes % 3) * 60 + seconds) / 180;
  };

  const onValueChange = (value) => {
    if (loops === 0 && value - oldCircularValue >= 0.8) {
      setCircularValue(0);
      setOldCircularValue(0);
      setTimeValue(baseTimes[0]);
    } else if (loops !== 0 && value - oldCircularValue >= 0.9) {
      setLoops(loops - 1);
      setTimeValue(baseTimes[Math.floor(value / (1 / 180))]);
      setOldCircularValue(value);
      setCircularValue(value);
    } else if (oldCircularValue - value >= 0.9) {
      setLoops(loops + 1);
      setTimeValue(baseTimes[Math.floor(value / (1 / 180))]);
      setOldCircularValue(value);
      setCircularValue(value);
    } else {
      setTimeValue(baseTimes[Math.floor(value / (1 / 180))]);
      setOldCircularValue(value);
      setCircularValue(value);
    }
  };

  const countDown = (minutes, seconds) => {
    if (!references.current.isTimerOn) {
      return;
    }
    if (seconds === 0 && minutes === 0) {
      console.log('clear');
      return;
    } else if (seconds === 0 && minutes !== 0) {
      console.log('minute');
      minutes -= 1;
      seconds = 59;
    } else {
      console.log('second');
      seconds = seconds - 1;
    }
    const timeString = normalize(minutes) + ':' + normalize(seconds);
    const circularValue = calculateActualCircularValue(timeString);
    setTimeValue(timeString);
    setCircularValue(circularValue);
    setTimeout(() => {
      countDown(minutes, seconds);
    }, 1000);
  };

  const startTimer = () => {
    references.current.isTimerOn = !references.current.isTimerOn;
    console.log(references.current.isTimerOn);
    setTimeout(() => {
      const minutes = parseInt(timeValue.split(':')[0]);
      const seconds = parseInt(timeValue.split(':')[1]);
      countDown(minutes, seconds);
    }, 1000);
  };

  return (
    <div>
      <CircularInput value={circularValue} onChange={onValueChange}>
        <CircularTrack />
        <CircularThumb />
        <text x={100} y={100} textAnchor="middle" dy="0.3em" fontWeight="bold">
          {calculateActualTime(timeValue)}
        </text>
      </CircularInput>
      <button onClick={() => startTimer()}>aaa</button>
    </div>
  );
}

export default CircularComponent;
