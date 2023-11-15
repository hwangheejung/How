import React from "react";
import { useState } from "react";
import LiveRestTimer from "./LiveRestTimer";
import styles from "../../../css/readyTimer.module.css";
import LiveTimer from "./LiveTimer";
const LiveExStart = (props) => {
  const [finish, setFinish] = useState(true); //쉬는시간이 끝남을 저장하는 상태
  const [plusset, setPlusset] = useState(1); //현재 set 관리

  //const currentid = props.currentEx.ex.order;
  const currentcount = props.currentEx.ex.count;
  const currenttime = props.currentEx.ex.time;
  const currentrest = props.currentEx.ex.rest;
  const currenttype = props.currentEx.ex.type;
  const currentname = props.currentEx.ex.ex.name;
  const currentdesc = props.currentEx.ex.ex.desc;

  const currentexerciseset = props.currentEx.ex.set;

  const getTimer = () => {
    setFinish(!finish);
    if (plusset === currentexerciseset) {
      console.log("성공");
      //props.getTimer();
      setPlusset(1);
    } else {
      setPlusset(plusset + 1);
    }
  };
  const onClick = () => {
    //complete버튼을 누르면 수행
    //부모 컴포넌트에 index 1 증가를 위해
    setFinish(!finish);
    if (plusset === currentexerciseset) {
      console.log("성공");
      //props.getTimer();
      setPlusset(1);
    } else {
      setPlusset(plusset + 1);
    }
  };

  const getrestfinish = () => {
    setFinish(!finish); //쉬는 시간이 끝나 상태 변화
    if (plusset === currentexerciseset) {
      console.log("성공");
      props.getTimer();
      setPlusset(1);
    }
  };

  const getNextTimer = () => {
    setFinish(!finish);
    props.getTimer();
  };

  return (
    <div>
      <div>
        <div>{currentname}</div>
        <div>{currentdesc}</div>
      </div>
      <div>
        {currenttype ? (
          <div>
            {finish ? (
              <div className={styles.ReadyTimer}>
                <div>Timer</div>
                <LiveTimer time={currenttime} getTimer={getTimer} />

                <div>
                  {plusset}/{currentexerciseset}
                </div>
              </div>
            ) : (
              <div className={styles.ReadyTimer}>
                Rest Timer
                <LiveRestTimer time={currentrest} getTimer={getTimer} />
              </div>
            )}
          </div>
        ) : (
          <div>
            {finish ? (
              <div className={styles.ReadyTimer}>
                <div>
                  {plusset}/{currentexerciseset}
                </div>
                <div>{currentcount}개 </div>
                <button className={styles.button} onClick={onClick}>
                  complete
                </button>
              </div>
            ) : (
              <div className={styles.ReadyTimer}>
                Rest Timer
                <LiveRestTimer time={currentrest} getTimer={getrestfinish} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveExStart;
