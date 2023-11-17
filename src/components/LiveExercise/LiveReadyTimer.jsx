import { React, useState, useRef, useEffect } from 'react';
import styles from '../../css/Timer/readyTimer.module.css';

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
      <div> ReadyTIMER</div>
      <div> {time.current}초 </div>
    </div>
  );
};
export default LiveReadyTimer;
