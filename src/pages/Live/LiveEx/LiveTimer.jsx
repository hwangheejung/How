import { React, useState, useRef, useEffect } from "react";
import styles from "../../../css/readyTimer.module.css";

const LiveTimer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const time = useRef(props.time);
  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setSeconds(time.current);
      time.current -= 1;
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      clearInterval(timerId.current);
      props.getTimer();
    }
  }, [seconds]);
  return (
    <div className={styles.ReadyTimer}>
      <div>
        {parseInt(seconds / 60)}:{seconds % 60}
      </div>
    </div>
  );
};
export default LiveTimer;
