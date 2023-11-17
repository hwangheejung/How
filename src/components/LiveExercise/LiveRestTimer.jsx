import { React, useState, useRef, useEffect } from 'react';
import styles from '../../css/Timer/readyTimer.module.css';

const LiveRestTimer = (props) => {
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
        {parseInt(time.current / 60)}:{time.current % 60}
      </div>
    </div>
  );
};
export default LiveRestTimer;
