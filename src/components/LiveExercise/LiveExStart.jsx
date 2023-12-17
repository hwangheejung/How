import React from 'react';
import LiveRestTimer from './LiveRestTimer';
import styles from '../../css/Live/LiveExStart.module.css';
import LiveTimer from './LiveTimer';
import ActionVideo from './ActionVideo';

const LiveExStart = (props) => {
  const currentcount = props.currentEx.ex.routinneDetailResult.count;
  const currenttime = props.currentEx.ex.routinneDetailResult.time;
  const currentrest = props.currentEx.ex.routinneDetailResult.rest;
  const currenttype = props.currentEx.ex.routinneDetailResult.type;
  const currentexerciseset = props.currentEx.ex.routinneDetailResult.set;
  const currentExOrder = props.currentEx.ex.routinneDetailResult.order;
  const currentExAcriontCnt = props.currentEx.ex.actionCnt;

  const getTimer = () => {
    if (props.plusset + 1 === currentexerciseset + 1) {
      if (currentExOrder === currentExAcriontCnt) {
        props.socketRoutineFinish();
      } else {
        props.getTimer();
        props.setPlusset(1);
      }
    } else {
      props.setFinish(false);
      props.setPlusset((plusset) => plusset + 1);
    }
  };

  const onClick = () => {
    if (currentrest === 0) {
      if (props.plusset + 1 === currentexerciseset + 1) {
        if (currentExOrder === currentExAcriontCnt) {
          props.socketRoutineFinish();
        } else {
          props.onNoRestSetDone();
        }
      } else {
        props.onNoRest();
      }
    } else if (currentrest > 0) {
      if (props.plusset + 1 === currentexerciseset + 1) {
        if (currentExOrder === currentExAcriontCnt) {
          props.socketRoutineFinish();
        } else {
          props.onNoRestSetDone();
        }
      } else {
        props.onRest();
      }
    }
  };

  const getrestfinish = () => {
    props.setStopbutton(false);
    props.setFinish(true);
  };

  return (
    <div className={styles.currentActionBox}>
      {currenttype ? (
        props.finish ? (
          <div className={styles.ReadyTimer}>
            <div className={styles.actionInfo}>
              <LiveTimer
                time={currenttime}
                getTimer={getTimer}
                showBtn={props.showBtn}
                stopbutton={props.stopbutton}
                socketTimerStop={props.socketTimerStop}
                socketTimerReset={props.socketTimerReset}
              />
            </div>
            <div className={styles.actionVideo}>
              <ActionVideo currentEx={props.currentEx} />
            </div>
          </div>
        ) : (
          <LiveRestTimer
            time={currentrest}
            getTimer={getrestfinish}
            currentEx={props.currentEx}
          />
        )
      ) : props.finish ? (
        <div className={styles.ReadyTimer}>
          <div className={styles.actionInfo}>
            <div className={styles.count}>{currentcount}개 </div>
            {props.showBtn ? (
              <button className={styles.button} onClick={onClick}>
                Next
              </button>
            ) : null}
          </div>
          <div className={styles.actionVideo}>
            <ActionVideo currentEx={props.currentEx} />
          </div>
        </div>
      ) : (
        currentrest !== 0 && (
          <LiveRestTimer
            time={currentrest}
            getTimer={getrestfinish}
            currentEx={props.currentEx}
          />
        )
      )}
    </div>
  );
};

export default LiveExStart;
