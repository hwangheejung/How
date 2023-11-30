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
  const currentname = props.currentEx.ex.routinneDetailResult.ex.name;
  const currentdesc = props.currentEx.ex.routinneDetailResult.ex.desc;
  const currentexerciseset = props.currentEx.ex.routinneDetailResult.set;
  const currentExOrder = props.currentEx.ex.routinneDetailResult.order;
  const currentExAcriontCnt = props.currentEx.ex.actionCnt;

  // 소켓 통신 상관없이 모든 유저가 타이머가 0이 되면 호출함
  const getTimer = () => {
    if (props.plusset + 1 === currentexerciseset + 1) {
      // 모든 세트가 끝나면
      if (currentExOrder === currentExAcriontCnt) {
        // 마지막 동작이면
        props.socketRoutineFinish();
      } else {
        // 마지막 동작이 아니면
        props.getTimer(); // 다음 동작 호출
        props.setPlusset(1); // 세트 수 1로 초기화
      }
    } else {
      // 세트가 아직 진행중이면
      // props.setFinish(!props.finish);
      props.setFinish(false);
      props.setPlusset((plusset) => plusset + 1);
    }
  };

  // 버튼 클릭에 의해 소켓 통신 필요
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
      // 휴식 시간이 0이 아니면
      if (props.plusset + 1 === currentexerciseset + 1) {
        // 세트가 모두 끝나면
        // props.setFinish(false);
        if (currentExOrder === currentExAcriontCnt) {
          // 마지막 동작이면
          props.socketRoutineFinish();
        } else {
          // 마지막 동작이 아니면
          // props.getTimer();
          // props.setPlusset(1);
          props.onNoRestSetDone();
        }
      } else {
        // 세트가 진행중이면
        props.onRest();
      }
    }
  };

  const getrestfinish = () => {
    // props.setFinish(!props.finish);
    props.setFinish(true);
    // if (props.plusset === currentexerciseset + 1) {
    //   if (currentExOrder === currentExAcriontCnt) {
    //     props.socketRoutineFinish();
    //   } else {
    //     props.getTimer();
    //     props.setPlusset(1);
    //   }
    // }
  };

  console.log('currentEx from LiveExStart: ', props.currentEx);

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
          <LiveRestTimer
            time={currentrest}
            getTimer={getrestfinish}
            currentEx={props.currentEx}
          />
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
