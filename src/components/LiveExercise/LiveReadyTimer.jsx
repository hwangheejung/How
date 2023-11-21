import { React, useState, useRef, useEffect } from 'react';
import styles from '../../css/Live/LiveReadyTimer.module.css';

const LiveReadyTimer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const time = useRef(5);
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
      props.getReadyTimer();
    }
  }, [seconds]);

  return (
    <div className={styles.ReadyTimer}>
      <div className={styles.readytimerText}> ready timer</div>
      <div className={styles.timer}> 00:0{time.current} </div>
    </div>
  );
};
export default LiveReadyTimer;
