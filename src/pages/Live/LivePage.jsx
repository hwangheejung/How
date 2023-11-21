import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../css/LivePage/LivePage.module.css";
import LiveExStart from "../../components/LiveExercise/LiveExStart";
import LiveReadyTimer from "../../components/LiveExercise/LiveReadyTimer";
import LiveInfo from "../../components/LivePage/LiveInfo";
import Videos from "../../components/LivePage/Videos";
import AllRoutine from "../../components/LivePage/AllRoutine";
import Bottom from "../../components/LivePage/Bottom";
import useSocket from "../../hooks/useSocket";

export default function LivePage() {
  const { liveId, liveTitle, camera, audio, isOwner } = useParams();

  const [
    participateNum,
    myMedia,
    myInfo,
    streams,
    nicknames,
    isownerbtn,
    handleStart,
    readyTimer,
    getReadyTimer,
    currentEx,
    getTimer,
    onRest,
    onNoRest,
    onNoRestSetDone,
    finish,
    setFinish,
    plusset,
    setPlusset,
    routine,
    handleAudio,
    audioOn,
    handleExit,
    handleCamera,
    cameraOn,
    isModify,
    setIsModify,
    socketSetModify,
    modifyActionId,
    socketModifyComplete,
    socketDecrease,
    isDecrease,
    socketIncrease,
    isIncrease,
    isModifySend,
    setIsModifySend,
    socketRoutineChange,
  ] = useSocket({ liveId, camera, audio, isOwner });

  const sequenceRef = useRef(null);
  const [openAllRoutine, setOpenAllRoutine] = useState(false);

  useEffect(() => {
    if (sequenceRef.current)
      sequenceRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentEx]);

  return (
    <div className={styles.root}>
      {/* <video controls muted autoPlay loop width='250'>
        <source src='demo-video.mp4' type='video/mp4' />
      </video> */}
      {/* 라이브 기본 정보 */}
      <LiveInfo liveTitle={liveTitle} participateNum={participateNum} />
      <button onClick={() => setOpenAllRoutine((prev) => !prev)}>메뉴바</button>
      {/* 각 운동 동작 */}
      {/* <div className={styles.middleContainer}> */}
      {/* 카메라 */}

      {/* <div className={styles.videoAction}> */}

      <div className={styles.currentActionBox}>
        <div className={styles.sequenceBox}>
          {routine?.routineDetails?.map((detail, index) => (
            <div
              key={index}
              className={`${styles.sequence} ${
                currentEx &&
                currentEx.ex.routinneDetailResult.order === index + 1 &&
                styles.nowSequence
              }`}
              ref={
                currentEx &&
                currentEx.ex.routinneDetailResult.order === index + 1
                  ? sequenceRef
                  : undefined
              }
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className={styles.currentActionDetailBox}>
          {isownerbtn ? (
            <button className={styles.startButton} onClick={handleStart}>
              START
            </button>
          ) : null}
          {readyTimer ? ( //준비 타이머
            <LiveReadyTimer getReadyTimer={getReadyTimer} time={5} />
          ) : null}
          {currentEx ? (
            <LiveExStart
              currentEx={currentEx}
              getTimer={getTimer}
              onRest={onRest}
              onNoRest={onNoRest}
              onNoRestSetDone={onNoRestSetDone}
              finish={finish}
              setFinish={setFinish}
              plusset={plusset}
              setPlusset={setPlusset}
              // stopbutton={stopbutton}
              // stopTimer={stopTimer}
              // restartTimer={restartTimer}
            />
          ) : null}
        </div>
      </div>
      {/* </div> */}
      {/* <AllRoutine
          routine={routine}
          currentEx={currentEx}
          isModify={isModify}
          setIsModify={setIsModify}
          socketSetModify={socketSetModify}
          modifyActionId={modifyActionId}
          socketModifyComplete={socketModifyComplete}
          socketDecrease={socketDecrease}
          isDecrease={isDecrease}
          socketIncrease={socketIncrease}
          isIncrease={isIncrease}
          isModifySend={isModifySend}
          setIsModifySend={setIsModifySend}
          socketRoutineChange={socketRoutineChange}
        /> */}
      {/* </div> */}
      <div className={styles.bottomVideo}>
        <Videos
          myMedia={myMedia}
          myInfo={myInfo}
          streams={streams}
          nicknames={nicknames}
        />
        <Bottom
          handleAudio={handleAudio}
          audioOn={audioOn}
          handleExit={handleExit}
          handleCamera={handleCamera}
          cameraOn={cameraOn}
        />
      </div>
      {openAllRoutine ? (
        <AllRoutine
          routine={routine}
          currentEx={currentEx}
          isModify={isModify}
          setIsModify={setIsModify}
          socketSetModify={socketSetModify}
          modifyActionId={modifyActionId}
          socketModifyComplete={socketModifyComplete}
          socketDecrease={socketDecrease}
          isDecrease={isDecrease}
          socketIncrease={socketIncrease}
          isIncrease={isIncrease}
          isModifySend={isModifySend}
          setIsModifySend={setIsModifySend}
          socketRoutineChange={socketRoutineChange}
          setOpenAllRoutine={setOpenAllRoutine}
        />
      ) : null}
    </div>
  );
}
