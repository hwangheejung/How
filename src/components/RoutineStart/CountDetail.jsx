import { React, useState, useEffect } from "react";
import styles from "../../css/Timer/readyTimer.module.css";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";
import { GrPowerReset } from "react-icons/gr";

const CountDetail = (props) => {
  const [finish, setfinish] = useState(true); //쉬는시간이 끝남을 저장하는 상태
  const [plusset, setPlusset] = useState(1); //현재 set 관리

  const navigate = useNavigate();
  const onClick = () => {
    //complete버튼을 누르면 수행
    //부모 컴포넌트에 index 1 증가를 위해
    setfinish(!finish);
    setPlusset(plusset + 1);
  };

  const onClickreset = () => {
    //운동 reset
    setPlusset(1); //set를 1로 초기화
    props.getIndex(100); //없는 index를 넘겨 index 초기화
    navigate(`/startex/${props.routid}/${props.id}`);
    props.getReadyTimer();
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
          <div className={styles.set}>
            set {plusset}/{props.set}
          </div>

          <div className={styles.count}>{props.count}</div>
          <div className={styles.ButtonBox}>
            <button className={styles.button} onClick={onClick}>
              Next
            </button>
          </div>
        </div>
      ) : (
        //complete를 누르면 restTimer 수행
        <div className={styles.ReadyTimer}>
          rest time
          <Timer
            time={props.restTime}
            getfinish={getrestfinish}
            finish={finish}
          />
        </div>
      )}
      <div className={styles.ButtonBox}>
        <button onClick={onClickreset} className={styles.resetbutton}>
          <GrPowerReset />
        </button>
      </div>
    </div>
  );
};
export default CountDetail;
