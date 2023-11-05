import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "../../css/readyTimer.module.css";

const Timer = (props) => {
  //const [minutes,setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const time = useRef(props.time);
  const countdown = useRef(null);

  useEffect(() => {
    countdown.current = setInterval(() => {
      setSeconds(time.current);
      time.current -= 1;
    }, 1000);
    return () => clearInterval(countdown.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      clearInterval(countdown.current);
      props.getfinish();
    }
  }, [seconds]);

  return (
    <div className={styles.ReadyTimer}>
      <div>TIMER</div>
      <div>{seconds} 초</div>
    </div>
  );
};

export default Timer;
