import { React, useState, useEffect } from "react";
import styles from "../../../css/readyTimer.module.css";
import { useNavigate } from "react-router-dom";
import LiveTimer from "./LiveTimer";

const LiveCountDetail = (props) => {
  const [finish, setfinish] = useState(true); //쉬는시간이 끝남을 저장하는 상태
  const [plusset, setPlusset] = useState(1); //현재 set 관리

  const navigate = useNavigate();
  const onClick = () => {
    //props.getExComplete();
    //complete버튼을 누르면 수행
    //부모 컴포넌트에 index 1 증가를 위해
    setfinish(!finish);
    setPlusset(plusset + 1);
  };

  const getrestfinish = () => {
    setfinish(!finish); //쉬는 시간이 끝나 상태 변화
    if (plusset === props.set + 1) {
      props.getIndex(1);
      setPlusset(1);
    }
  };

  return (
    <div>
      {finish ? ( //countfinish가 1일 경우 운동 개수 실행
        <div className={styles.ReadyTimer}>
          <div>
            {plusset}/{props.set}
          </div>

          <div>{props.count}</div>
          <button className={styles.button} onClick={onClick}>
            complete
          </button>
        </div>
      ) : (
        //complete를 누르면 restTimer 수행
        <LiveTimer
          time={props.restTime}
          getfinish={getrestfinish}
          finish={finish}
        />
      )}
    </div>
  );
};
export default LiveCountDetail;
