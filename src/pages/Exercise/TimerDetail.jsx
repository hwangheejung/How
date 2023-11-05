import { React, useState } from "react";
import RestTimer from "./RestTimer";
import Timer from "./Timer";
import styles from "../../css/readyTimer.module.css";

const TimerDetail = (props) => {
  // const [restfinish, setResfinish] = useState(true); //쉬는시간이 끝남을 저장하는 상태
  const [finish, setFinish] = useState(true); //타이머  끝남을 저장하는 상태

  const getfinish = () => {
    setFinish(!finish); //타이머 동작이 끝나 상태 변화
    props.getIndex(1);
  };
  const getrestfinish = () => {
    setFinish(!finish); //쉬는 시간이 끝나 상태 변화
  };
  return (
    <div>
      {finish ? ( //countfinish가 1일 경우 운동 개수 실행
        <div>
          <div className={styles.ReadyTimer}>{props.name}</div>
          <Timer time={props.time} getfinish={getfinish} finish={finish} />
        </div>
      ) : (
        //complete를 누르면 restTimer 수행
        <RestTimer
          restTime={props.restTime} //각 동작에 맞는 resttime을 보내줌
          getrestfinish={getrestfinish} //resttime이 끝났는지 확인
          finish={finish}
        />
      )}
    </div>
  );
};
export default TimerDetail;
