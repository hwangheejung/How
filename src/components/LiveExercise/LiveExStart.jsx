import React from "react";
import { useState } from "react";
import LiveRestTimer from "./LiveRestTimer";
import LiveReadyTimer from "./LiveReadyTimer";
import styles from "../../css/Timer/readyTimer.module.css";
import LiveTimer from "./LiveTimer";
const LiveExStart = (props) => {
  //const [exorder, setExorder] = useState(1);

  // const [finish, setFinish] = useState(true); //쉬는시간이 끝남을 저장하는 상태
  // const [plusset, setPlusset] = useState(1); //현재 set 관리

  //const currentid = props.currentEx.ex.order;
  const currentcount = props.currentEx.ex.routinneDetailResult.count;
  const currenttime = props.currentEx.ex.routinneDetailResult.time;
  const currentrest = props.currentEx.ex.routinneDetailResult.rest;
  const currenttype = props.currentEx.ex.routinneDetailResult.type;
  const currentname = props.currentEx.ex.routinneDetailResult.ex.name;
  const currentdesc = props.currentEx.ex.routinneDetailResult.ex.desc;
  const currentexerciseset = props.currentEx.ex.routinneDetailResult.set;
  const currentexorder = props.currentEx.ex.routinneDetailResult.order;

  const exactioncnt = props.currentEx.ex.actionCnt;

  const [exfinish, setExfinish] = useState(true);

  const getTimer = () => {
    props.setFinish(!props.finish);
    props.setPlusset((plusset) => plusset + 1);
    if (
      currentexorder === exactioncnt &&
      props.plusset === currentexerciseset
    ) {
      setExfinish(!exfinish);
    }
  };

  const onClick = () => {
    if (currentrest === 0) {
      if (props.plusset + 1 === currentexerciseset + 1) {
        props.onNoRestSetDone();
      } else {
        props.onNoRest();
      }
      console.log("LiveExStart onClick onNoRest");
    } else if (currentrest > 0) {
      props.onRest();
      console.log("LiveExStart onClick onRest");
    }
    if (
      currentexorder === exactioncnt &&
      props.plusset === currentexerciseset
    ) {
      setExfinish(!exfinish);
    }
    // console.log(currentexorder);
    // console.log(exactioncnt);
    // console.log(exfinish);
    // console.log(props.plusset);
    // console.log(currentexerciseset);

    // if (currentrest === 0) {
    //   getrestfinish();
    //   //console.log("성공");
    // }
    //complete버튼을 누르면 수행
    //부모 컴포넌트에 index 1 증가를 위해

    // setFinish(!finish);
    // setPlusset((plusset) => plusset + 1);
  };

  const getrestfinish = () => {
    props.setFinish(!props.finish);
    if (props.plusset === currentexerciseset + 1) {
      props.getTimer();
      //setExorder(exorder + 1);
      //console.log("성공");
      props.setPlusset(1);
    }
    // if (plusset === currentexerciseset + 1) {
    //   console.log('성공');
    //   setPlusset(1);
    // } else {
    //   setPlusset((plusset) => plusset + 1);
    // }
  };

  return (
    <div>
      {exfinish ? (
        <div>
          <div>
            <div>{currentname}</div>
            <div>{currentdesc}</div>
          </div>
          <div>
            {currenttype ? (
              <div>
                {props.finish ? (
                  <div className={styles.ReadyTimer}>
                    <div>Timer</div>
                    <LiveTimer time={currenttime} getTimer={getTimer} />
                    <div>
                      {props.plusset}/{currentexerciseset}
                    </div>
                  </div>
                ) : (
                  <div className={styles.ReadyTimer}>
                    Rest Timer
                    <LiveRestTimer
                      time={currentrest}
                      getTimer={getrestfinish}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                {props.finish ? (
                  <div className={styles.ReadyTimer}>
                    <div>
                      {props.plusset}/{currentexerciseset}
                    </div>
                    <div>{currentcount}개 </div>
                    <button className={styles.button} onClick={onClick}>
                      complete
                    </button>
                  </div>
                ) : (
                  currentrest !== 0 && (
                    <div className={styles.ReadyTimer}>
                      Rest Timer
                      <LiveRestTimer
                        time={currentrest}
                        getTimer={getrestfinish}
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>Finish</div>
      )}
    </div>
  );
};

export default LiveExStart;
