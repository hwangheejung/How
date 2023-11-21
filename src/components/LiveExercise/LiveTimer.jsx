import { React, useState, useRef, useEffect } from 'react';
import styles from '../../css/Timer/readyTimer.module.css';

const LiveTimer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const time = useRef(props.time);
  const timerId = useRef(null);

  useEffect(() => {
    time.current = props.time;
  }, [props.time]);

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

  // const onClickstop = () => {
  //   setStopbutton(!stopbutton);
  //   clearInterval(timerId.current);
  // };

  // const onClickrestart = () => {
  //   setStopbutton(!stopbutton);
  //   timerId.current = setInterval(() => {
  //     setSeconds(time.current);
  //     time.current -= 1;
  //   }, 1000);
  // };
  return (
    <div className={styles.ReadyTimer}>
      <div className={styles.timer}>
        {parseInt(time.current / 60)}:{time.current % 60}
      </div>
      {/* {stopbutton ? (
        <button onClick={onClickstop} className={styles.button}>
          STOP
        </button>
      ) : (
        <button onClick={onClickrestart} className={styles.button}>
          RESTART
        </button>
      )} */}
    </div>
  );
};
export default LiveTimer;
