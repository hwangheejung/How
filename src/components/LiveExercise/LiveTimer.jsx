import { React, useState, useRef, useEffect } from "react";
import styles from "../../css/Timer/readyTimer.module.css";

const LiveTimer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const time = useRef(props.time);
  const timerId = useRef(null);

  useEffect(() => {
    time.current = props.time;
  }, [props.time]);

  // useEffect(() => {
  //   timerId.current = setInterval(() => {
  //     setSeconds(time.current);
  //     time.current -= 1;
  //   }, 1000);

  //   return () => clearInterval(timerId.current);
  // }, []);

  useEffect(() => {
    if (props.stopbutton) {
      timerId.current = setInterval(() => {
        setSeconds(time.current);
        time.current -= 1;
      }, 1000);
    }

    return () => clearInterval(timerId.current);
  }, [props.stopbutton]);

  useEffect(() => {
    if (time.current <= 0) {
      clearInterval(timerId.current);
      props.getTimer();
    }
  }, [seconds]);

  useEffect(() => {
    console.log("timer test");
    if (!props.stopbutton) {
      clearInterval(timerId.current);
    }
    // else {
    //   timerId.current = setInterval(() => {
    //     setSeconds(time.current);
    //     time.current -= 1;
    //   }, 1000);
    // }
  }, [props.stopbutton]);

  const onClickstop = () => {
    props.socketTimerStop();
  };

  const onClickrestart = () => {
    props.socketTimerReset();
  };

  return (
    <div className={styles.ReadyTimer}>
      <div className={styles.timer}>
        {parseInt(time.current / 60)}:{time.current % 60}
      </div>
      {props.showBtn &&
        (props.stopbutton ? (
          <button onClick={onClickstop} className={styles.button}>
            STOP
          </button>
        ) : (
          <button onClick={onClickrestart} className={styles.button}>
            RESTART
          </button>
        ))}
      {!props.stopbutton && <div>stop</div>}
    </div>
  );
};
export default LiveTimer;
