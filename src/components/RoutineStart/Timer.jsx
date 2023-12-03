import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '../../css/Timer/readyTimer.module.css';

const Timer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [stopbutton, setStopbutton] = useState(true);
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

  const onClickstop = () => {
    setStopbutton(!stopbutton);
    clearInterval(countdown.current);
  };
  const onClickrestart = () => {
    setStopbutton(!stopbutton);
    countdown.current = setInterval(() => {
      setSeconds(time.current);
      time.current -= 1;
    }, 1000);
  };
  return (
    <div className={styles.ReadyTimer}>
      <div className={styles.timer}>
        {parseInt(time.current / 60)}:{time.current % 60}
      </div>
      <div className={styles.ButtonBox}>
        {stopbutton ? (
          <button onClick={onClickstop} className={styles.button}>
            STOP
          </button>
        ) : (
          <button onClick={onClickrestart} className={styles.button}>
            RESTART
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
