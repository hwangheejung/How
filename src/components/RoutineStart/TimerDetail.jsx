import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import styles from '../../css/Timer/readyTimer.module.css';
import OwnActionVideo from './OwnActionVideo';
import { GrPowerReset } from 'react-icons/gr';
import RestTimer from './RestTimer';

const TimerDetail = (props) => {
  const [finish, setFinish] = useState(true);
  const [plusset, setPlusset] = useState(1);

  const navigate = useNavigate();
  const getfinish = () => {
    setFinish(false);
    setPlusset((plusset) => plusset + 1);
    if (props.index === props.detailRoutine.length - 1) {
      props.getIndex();
    }
  };
  const getrestfinish = () => {
    setFinish(true);
    if (plusset === props.set + 1) {
      props.getIndex(1);
      setPlusset(1);
    }
  };

  const onClickreset = () => {
    props.getIndex(100);
    navigate(`/startex/${props.routid}/${props.id}`);
    props.getReadyTimer();
  };
  return (
    <div>
      {finish ? (
        <div className={styles.ReadyTimer}>
          <div className={styles.set}>
            set {plusset}/{props.set}
          </div>

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
      )}
    </div>
  );
};
export default TimerDetail;
