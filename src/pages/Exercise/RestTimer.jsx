import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "../../css/readyTimer.module.css";

const RestTimer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const time = useRef(props.restTime);
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
      props.getrestfinish();
    }
  }, [seconds]);

  return (
    <div className={styles.ReadyTimer}>
      <div>Rest TIMER</div>
      <div>{seconds} 초</div>
    </div>
  );
};

export default RestTimer;
