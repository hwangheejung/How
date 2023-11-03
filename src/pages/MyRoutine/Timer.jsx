import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";

const Timer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const time = useRef(300);
  const timerId = useRef(null);

  const onChange = (e) => {
    setMinutes(e.target.value);
  };

  useEffect(() => {
    timerId.current = setInterval(() => {
      setMinutes(parseInt(time.current / 60));
      setSeconds(time.current % 60);
      time.current -= 1;
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      //alert("timeout");
      clearInterval(timerId.current);
    }
  }, [seconds]);

  const startTimer = () => {
    time.current = minutes * 60 + seconds;
    timerId.current = setInterval(() => {
      setMinutes(parseInt(time.current / 60));
      setSeconds(time.current % 60);
      time.current -= 1;
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerId.current);
  };
  return (
    <div>
      <input type="number" placeholder="타이머" onChange={onChange} />
      <button onClick={startTimer}>START</button>
      <button onClick={stopTimer}>STOP</button>

      <div>
        {minutes}분 {seconds} 초
      </div>
    </div>
  );
};

export default Timer;
