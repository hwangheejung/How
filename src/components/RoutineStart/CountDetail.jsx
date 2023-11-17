import { React, useState, useEffect } from 'react';
import styles from '../../css/Timer/readyTimer.module.css';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';

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
    navigate(`/startex/${props.routid}`);
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
          <div>{props.name}</div>
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
        <Timer
          time={props.restTime}
          getfinish={getrestfinish}
          finish={finish}
        />
      )}
      <button onClick={onClickreset} className={styles.button}>
        reset
      </button>
    </div>
  );
};
export default CountDetail;
