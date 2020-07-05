import React, { useState, useRef } from 'react';
import { Button } from 'reactstrap';
import styles from './App.css';
import ExceptionWrapper from './ExceptionsWrapper';
import CircularComponent from './components/CircularComponent';

function App() {
  const [ circularValue, setCircularValue ] = useState(0);
  const [ circularPower, setCircularPower ] = useState(1);
  const [ oldCircularValue, setOldCircularValue ] = useState(0);
  const [ timeValue, setTimeValue ] = useState('00:00');
  const [ loops, setLoops ] = useState(0);
  const [ screen, setScreen ] = useState('home');
  const [ isWorking, setIsWorking ] = useState(false);
  const [ programSelected, setProgramSelected ] = useState(false);

  const references = useRef({ isTimerOn: false });

  const green = '#499c96';
  const secondaryGreen = '#bbdfdc';
  const red = '#d66c51';

  const powerColors = [ '#9bccc8', '#8bc2be', '#7bb9b4', '#6aafaa', '#5aa6a0', '#499c96' ];

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
    return normalize(minutes) + ':' + seconds;
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
      setIsWorking(!isWorking);
      return;
    } else if (seconds === 0 && minutes !== 0) {
      minutes -= 1;
      seconds = 59;
    } else {
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
    setTimeout(() => {
      const minutes = parseInt(timeValue.split(':')[0]);
      const seconds = parseInt(timeValue.split(':')[1]);
      countDown(minutes, seconds);
    }, 1000);
    setIsWorking(!isWorking);
  };

  const workingText = () => {
    if (timeValue === '00:00') {
      return 'Your meal is done!';
    } else {
      return 'Your meal is cooking';
    }
  };

  const homeScreen = () => {
    return (
      <div class="microwave--panel">
        <CircularComponent
          circularValue={circularValue}
          onValueChange={onValueChange}
          innerValue={calculateActualTime(timeValue || '00:00')}
          innerFunction={() => startTimer()}
          innerColor={isWorking ? red : green}
        />
        {!isWorking ? (
          <div class="microwave--panel-buttons">
            <div class="microwave--panel-button">
              <Button
                color="primary"
                className="btn-block mircowave--panel-button_100"
                onClick={() => {
                  clearProgram();
                  setScreen('programs');
                }}
              >
                Programs
              </Button>
            </div>
            <div class="microwave--panel-button">
              <Button
                onClick={() => {
                  setScreen('power');
                }}
                className="btn-block mircowave--panel-button_100"
              >
                Pwr: {visualPower(circularPower)}/5
              </Button>
            </div>
          </div>
        ) : (
          <div class="microwave--panel-buttons">{workingText()}</div>
        )}
      </div>
    );
  };

  const powerSteps = (v) => {
    const value = Math.round(v * 5) / 5;
    if (value === 0) {
      setCircularPower(1);
      return 5;
    } else {
      return value;
    }
  };

  const visualPower = (v) => Math.round(powerSteps(circularPower) * 5);

  const powerScreen = () => {
    return (
      <div class="microwave--panel">
        <CircularComponent
          circularValue={powerSteps(circularPower)}
          onValueChange={(value) => setCircularPower(value)}
          innerValue={visualPower(circularPower)}
          innerColor={powerColors[visualPower(circularPower)]}
          innerFunction={() => {
            setScreen('home');
          }}
        />
        <div class="microwave--panel-buttons">
          <div class="microwave--panel-button">
            <Button
              color="primary"
              onClick={() => {
                setScreen('home');
              }}
              className="btn-block mircowave--panel-button_100"
            >
              {calculateActualTime(timeValue || '00:00')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const programData = [
    { time: '02:30', power: 1, name: 'Meat' },
    { time: '05:00', power: 0.8, name: 'Fish' },
    { time: '01:00', power: 0.6, name: 'Pop' },
    { time: '00:45', power: 0.8, name: 'Potatoes' }
  ];

  const clearProgram = () => {
    setCircularPower(1);
    setTimeValue('00:00');
    setCircularValue(calculateActualCircularValue('00:00'));
    setProgramSelected(false);
    setLoops(0);
  };

  const setActiveProgram = ({ time, power, _name }) => {
    setCircularPower(power);
    setTimeValue(time);
    setCircularValue(calculateActualCircularValue(time));
    setProgramSelected(true);
    setLoops(0);
  };

  const programButons = () => {
    let buttons = [ ...Array(4).keys() ].map((index) => {
      return (
        <div class="microwave--panel-button__program">
          <Button
            className="btn-block mircowave--panel-button_100"
            onClick={() => {
              setActiveProgram(programData[index]);
            }}
          >
            {programData[index].name}
          </Button>
        </div>
      );
    });
    return buttons;
  };

  const programScreen = () => {
    return (
      <div class="microwave--panel">
        <CircularComponent
          circularValue={powerSteps(circularPower)}
          onValueChange={(value) => setCircularPower(value)}
          innerValue={programSelected ? calculateActualTime(timeValue) : 'Home'}
          innerColor={programSelected ? powerColors[visualPower(circularPower)] : red}
          innerFunction={() => {
            setScreen('home');
          }}
        />
        <div class="microwave--panel-buttons__program">{programButons()}</div>
      </div>
    );
  };

  const microwave = (screen) => {
    return (
      <ExceptionWrapper>
        <div class="flex--center">
          <div class="microwave--container">
            <div class="microwave--window">
              <div class="microwave--window-lever" />
            </div>
            {screen()}
          </div>
        </div>
      </ExceptionWrapper>
    );
  };

  if (screen === 'home') {
    return microwave(homeScreen);
  } else if (screen === 'power') {
    return microwave(powerScreen);
  } else if (screen === 'programs') {
    return microwave(programScreen);
  }
}

export default App;
