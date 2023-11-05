import { React, useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../css/readyTimer.module.css";
import countDetail from "./CountDetail";

const ReadyTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const time = useRef(3);
  const timerId = useRef(null);

  const { id } = useParams();
  //window.location.href = `/startex/${id}`;

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
    }
  }, [seconds]);

  return (
    <div className={styles.ReadyTimer}>
      <div>READY TIMER</div>
      <div>{seconds} 초</div>
    </div>
  );
};
export default ReadyTimer;
