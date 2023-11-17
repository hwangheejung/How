import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import styles from '../../css/Timer/readyTimer.module.css';

const TimerDetail = (props) => {
  const [finish, setFinish] = useState(true); //타이머  끝남을 저장하는 상태
  const [plusset, setPlusset] = useState(1); //현재 set 관리

  const navigate = useNavigate();
  const getfinish = () => {
    setFinish(!finish); //타이머 동작이 끝나 상태 변화
    setPlusset(plusset + 1);
  };
  const getrestfinish = () => {
    setFinish(!finish); //쉬는 시간이 끝나 상태 변화
    if (plusset === props.set + 1) {
      props.getIndex(1);
      setPlusset(1);
    }
  };

  const onClickreset = () => {
    //운동 reset
    setPlusset(1); //set를 1로 초기화
    props.getIndex(100); //없는 index를 넘겨 index 초기화
    navigate(`/startex/${props.routid}`);
    props.getReadyTimer();
  };
  const onClickStop = () => {};
  return (
    <div>
      {finish ? ( //countfinish가 1일 경우 운동 개수 실행
        <div className={styles.ReadyTimer}>
          <div>{props.name}</div>
          <div>
            {plusset}/{props.set}
          </div>
          <div>Timer</div>
          <Timer time={props.time} getfinish={getfinish} />
        </div>
      ) : (
        //complete를 누르면 restTimer 수행
        <div className={styles.ReadyTimer}>
          Rest Timer
          <Timer
            time={props.restTime} //각 동작에 맞는 resttime을 보내줌
            getfinish={getrestfinish} //resttime이 끝났는지 확인
          />
        </div>
      )}
      <button onClick={onClickreset} className={styles.button}>
        reset
      </button>
    </div>
  );
};
export default TimerDetail;
