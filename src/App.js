import React, { useState, useRef } from "react";
import { Button } from "reactstrap";
import styles from "./App.css";
import ExceptionWrapper from "./ExceptionsWrapper";
import CircularComponent from "./components/CircularComponent";

function App() {
  const [circularValue, setCircularValue] = useState(0);
  const [circularPower, setCircularPower] = useState(1);
  const [oldCircularValue, setOldCircularValue] = useState(0);
  const [timeValue, setTimeValue] = useState("00:00");
  const [loops, setLoops] = useState(0);
  const [screen, setScreen] = useState("home");
  const [isWorking, setIsWorking] = useState(false);

  const references = useRef({ isTimerOn: false });

  const green = "#27b376";
  const red = "#bf212f";

  const normalize = (time) => {
    return (time < 10 ? "0" : "") + time;
  };

  const baseTimes = [...Array(180).keys()].map((auxValue) => {
    const seconds = auxValue % 60;
    const minutes = Math.floor(auxValue / 60);
    return normalize(minutes) + ":" + normalize(seconds);
  });

  const calculateActualTime = (time) => {
    const minutes = parseInt(time.split(":")[0]) + 3 * loops;
    const seconds = time.split(":")[1];
    return normalize(minutes) + ":" + seconds;
  };

  const calculateActualCircularValue = (timeString) => {
    const minutes = parseInt(timeString.split(":")[0]);
    const seconds = parseInt(timeString.split(":")[1]);

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
    const timeString = normalize(minutes) + ":" + normalize(seconds);
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
      const minutes = parseInt(timeValue.split(":")[0]);
      const seconds = parseInt(timeValue.split(":")[1]);
      countDown(minutes, seconds);
    }, 1000);
    setIsWorking(!isWorking);
  };

  const homeScreen = () => {
    return (
      <div class="microwave--panel">
        <CircularComponent
          circularValue={circularValue}
          onValueChange={onValueChange}
          innerValue={calculateActualTime(timeValue || "00:00")}
          innerFunction={() => startTimer()}
          innerColor={isWorking ? red : green}
        />
        <div class="microwave--panel-buttons">
          <div class="microwave--panel-button">
            <Button
              color="primary"
              className="btn-block mircowave--panel-button_100"
            >
              Programs
            </Button>
          </div>
          <div class="microwave--panel-button">
            <Button
              color="primary"
              onClick={() => {
                setScreen("power");
              }}
              className="btn-block mircowave--panel-button_100"
            >
              {visualPower(circularPower)}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const powerSteps = (v) => Math.round(v * 5) / 5;

  const visualPower = (v) => Math.round(powerSteps(circularPower) * 5) + "⚡";

  const powerScreen = () => {
    return (
      <div class="microwave--panel">
        <CircularComponent
          circularValue={powerSteps(circularPower)}
          onValueChange={(value) => setCircularPower(value)}
          innerValue={visualPower(circularPower)}
          innerColor={green}
          innerFunction={() => {
            setScreen("home");
          }}
        />
        <div class="microwave--panel-buttons">
          <div class="microwave--panel-button">
            <Button
              color="primary"
              onClick={() => {
                setScreen("home");
              }}
              className="btn-block mircowave--panel-button_100"
            >
              {calculateActualTime(timeValue || "00:00")}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const microwave = (screen) => {
    return (
      <ExceptionWrapper>
        <div class="flex--center">
          <div class="microwave--container">
            <div class="microwave--window">
              <div class="microwave--window-lever"></div>
            </div>
            {screen()}
          </div>
        </div>
      </ExceptionWrapper>
    );
  };

  if (screen === "home") {
    return microwave(homeScreen);
  } else if (screen === "power") {
    return microwave(powerScreen);
  }
}

export default App;
