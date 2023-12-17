import { React, useState } from 'react';
import styles from '../../css/Timer/readyTimer.module.css';
import { useNavigate } from 'react-router-dom';
import { GrPowerReset } from 'react-icons/gr';
import RestTimer from './RestTimer';
import OwnActionVideo from './OwnActionVideo';

const CountDetail = (props) => {
  const [finish, setfinish] = useState(true);
  const [plusset, setPlusset] = useState(1);

  const navigate = useNavigate();

  const onClick = () => {
    setfinish(false);
    setPlusset((plusset) => plusset + 1);
    if (props.index === props.detailRoutine.length - 1) {
      props.getIndex();
    }
  };

  const onClickreset = () => {
    setPlusset(1);
    props.getIndex(100);
    navigate(`/startex/${props.routid}/${props.id}`);
    props.getReadyTimer();
  };

  const getrestfinish = () => {
    setfinish(true);
    if (plusset === props.set + 1) {
      props.getIndex(1);
      setPlusset(1);
    }
  };

  return (
    <div>
      {finish ? (
        <div className={styles.ReadyTimer}>
          <div className={styles.set}>
            set {plusset}/{props.set}
          </div>

          <div className={styles.count}>{props.count}개</div>
          <div className={styles.ButtonBox}>
            <button className={styles.button} onClick={onClick}>
              Next
            </button>
          </div>
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
export default CountDetail;
