import React from "react";
import LiveRestTimer from "./LiveRestTimer";
import styles from "../../css/Live/LiveExStart.module.css";
import LiveTimer from "./LiveTimer";
import ActionVideo from "./ActionVideo";

const LiveExStart = (props) => {
  const currentcount = props.currentEx.ex.routinneDetailResult.count;
  const currenttime = props.currentEx.ex.routinneDetailResult.time;
  const currentrest = props.currentEx.ex.routinneDetailResult.rest;
  const currenttype = props.currentEx.ex.routinneDetailResult.type;
  const currentname = props.currentEx.ex.routinneDetailResult.ex.name;
  const currentdesc = props.currentEx.ex.routinneDetailResult.ex.desc;
  const currentexerciseset = props.currentEx.ex.routinneDetailResult.set;
  const currentExOrder = props.currentEx.ex.routinneDetailResult.order;
  const currentExAcriontCnt = props.currentEx.ex.actionCnt;

  const getTimer = () => {
    props.setFinish(!props.finish);
    props.setPlusset((plusset) => plusset + 1);
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
      props.onRest();
    }
  };

  const getrestfinish = () => {
    props.setFinish(!props.finish);
    if (props.plusset === currentexerciseset + 1) {
      if (currentExOrder === currentExAcriontCnt) {
        props.socketRoutineFinish();
      } else {
        props.getTimer();
        props.setPlusset(1);
      }
    }
  };

  console.log("currentEx from LiveExStart: ", props.currentEx);

  return (
    <div className={styles.currentActionBox}>
      {currenttype ? (
        props.finish ? (
          <div className={styles.ReadyTimer}>
            <div className={styles.actionInfo}>
              <div className={styles.set}>
                set {props.plusset}/{currentexerciseset}
              </div>
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
            {/* <div className={styles.stopBox}> */}
            {/* {!props.stopbutton && <div className={styles.stopText}>stop</div>} */}
            {/* </div> */}
          </div>
        ) : (
          <div className={styles.ReadyTimer}>
            Rest Time
            <LiveRestTimer time={currentrest} getTimer={getrestfinish} />
          </div>
        )
      ) : props.finish ? (
        <div className={styles.ReadyTimer}>
          <div className={styles.actionInfo}>
            <div className={styles.set}>
              set {props.plusset}/{currentexerciseset}
            </div>
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
          <div className={styles.ReadyTimer}>
            Rest Time
            <LiveRestTimer time={currentrest} getTimer={getrestfinish} />
          </div>
        )
      )}
    </div>
  );
};

export default LiveExStart;
