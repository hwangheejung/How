import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import styles from '../../css/Timer/readyTimer.module.css';
import OwnActionVideo from './OwnActionVideo';
import { GrPowerReset } from 'react-icons/gr';
import RestTimer from './RestTimer';

const TimerDetail = (props) => {
  const [finish, setFinish] = useState(true); //타이머  끝남을 저장하는 상태
  const [plusset, setPlusset] = useState(1); //현재 set 관리

  const navigate = useNavigate();
  const getfinish = () => {
    setFinish(false); //타이머 동작이 끝나 상태 변화
    setPlusset((plusset) => plusset + 1);
    if (props.index === props.detailRoutine.length - 1) {
      props.getIndex();
    }
  };
  const getrestfinish = () => {
    setFinish(true); //쉬는 시간이 끝나 상태 변화
    if (plusset === props.set + 1) {
      props.getIndex(1);
      setPlusset(1);
    }
  };

  const onClickreset = () => {
    //운동 reset
    setPlusset(1); //set를 1로 초기화
    props.getIndex(100); //없는 index를 넘겨 index 초기화
    navigate(`/startex/${props.routid}/${props.id}`);
    props.getReadyTimer();
  };
  const onClickStop = () => {};
  return (
    <div>
      {finish ? ( //countfinish가 1일 경우 운동 개수 실행
        <div className={styles.ReadyTimer}>
          <div className={styles.set}>
            set {plusset}/{props.set}
          </div>

          {/* <div>Timer</div> */}
          <Timer time={props.time} getfinish={getfinish} />
          <div className={styles.actionVideo}>
            <OwnActionVideo currentexvideo={props.currentexvideo} />
          </div>
          <div className={styles.ButtonBox}>
            <button onClick={onClickreset} className={styles.resetbutton}>
              <GrPowerReset />
            </button>
          </div>
        </div>
      ) : (
        //complete를 누르면 restTimer 수행
        <RestTimer
          time={props.restTime}
          getfinish={getrestfinish}
          finish={finish}
          currentexvideo={
            plusset === props.set + 1
              ? props.detailRoutine[props.index + 1].img[0].img
              : props.currentexvideo
          }
        />
        // <div className={styles.ReadyTimer}>
        //   rest time
        //   <Timer
        //     time={props.restTime} //각 동작에 맞는 resttime을 보내줌
        //     getfinish={getrestfinish} //resttime이 끝났는지 확인
        //   />
        // </div>
      )}
      {/* <div className={styles.ButtonBox}>
        <button onClick={onClickreset} className={styles.resetbutton}>
          reset
        </button>
      </div> */}
    </div>
  );
};
export default TimerDetail;
