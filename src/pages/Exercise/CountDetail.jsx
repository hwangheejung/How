import { React, useState, useEffect } from "react";
import styles from "../../css/readyTimer.module.css";
import RestTimer from "./RestTimer";

const CountDetail = (props) => {
  const [finish, setfinish] = useState(true); //쉬는시간이 끝남을 저장하는 상태

  const onClick = () => {
    //complete버튼을 누르면 수행
    //부모 컴포넌트에 index 1 증가를 위해
    setfinish(!finish);
  };

  const getrestfinish = () => {
    setfinish(!finish); //쉬는 시간이 끝나 상태 변화
    props.getIndex(1);
  };
  return (
    <div>
      {finish ? ( //countfinish가 1일 경우 운동 개수 실행
        <div>
          <div className={styles.ReadyTimer}>{props.name}</div>
          <div className={styles.ReadyTimer}>{props.count}</div>
          <button className={styles.button} onClick={onClick}>
            complete
          </button>
        </div>
      ) : (
        //complete를 누르면 restTimer 수행
        <RestTimer
          restTime={props.restTime}
          getrestfinish={getrestfinish}
          finish={finish}
        />
      )}
    </div>
  );
};
export default CountDetail;
