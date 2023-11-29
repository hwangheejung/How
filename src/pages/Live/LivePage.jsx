import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../css/LivePage/LivePage.module.css';
import LiveExStart from '../../components/LiveExercise/LiveExStart';
import LiveReadyTimer from '../../components/LiveExercise/LiveReadyTimer';
import LiveInfo from '../../components/LivePage/LiveInfo';
import Videos from '../../components/LivePage/Videos';
import AllRoutine from '../../components/LivePage/AllRoutine';
import Bottom from '../../components/LivePage/Bottom';
import useSocket from '../../hooks/useSocket';
import AllRoutineWide from '../../components/LivePage/AllRoutineWide';
import { getCookieToken } from '../../store/Cookie';
import axios from 'axios';

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
    exFinish,
    isParticipate,
    showBtn,
    stopbutton,
    socketTimerStop,
    socketTimerReset,
    socketRoutineFinish,
  ] = useSocket({ liveId, camera, audio, isOwner });

  const [openAllRoutine, setOpenAllRoutine] = useState(false);

  console.log('currentEx from LivePage: ', currentEx);

  return (
    <div className={styles.root}>
      <div className={styles.cover}>
        <LiveInfo
          liveTitle={liveTitle}
          participateNum={participateNum}
          setOpenAllRoutine={setOpenAllRoutine}
        />
        <div className={styles.middle}>
          <div className={styles.actionVideo}>
            <div className={styles.currentActionBox}>
              {routine?.routineDetails?.map(
                (detail, index) =>
                  currentEx &&
                  !exFinish &&
                  detail.id === currentEx.ex.routinneDetailResult.id && (
                    <div className={styles.sequenceBox}>
                      <div
                        key={detail.order}
                        className={`${styles.sequence} ${
                          currentEx &&
                          currentEx.ex.routinneDetailResult.order ===
                            index + 1 &&
                          styles.nowSequence
                        }`}
                      >
                        {detail.order}
                      </div>
                      <div className={styles.actionName}>{detail.ex.name}</div>
                    </div>
                  )
              )}

              <div className={styles.currentActionDetailBox}>
                {isownerbtn ? (
                  <div className={styles.startButtonBox}>
                    <button
                      className={styles.startButton}
                      onClick={handleStart}
                    >
                      START
                    </button>
                  </div>
                ) : null}
                {isParticipate ? (
                  <div className={styles.startButtonBox}>
                    <div className={styles.endMassage}>{`Ready`}</div>
                  </div>
                ) : null}
                {readyTimer ? ( //준비 타이머
                  <LiveReadyTimer getReadyTimer={getReadyTimer} time={5} />
                ) : null}
                {currentEx && !exFinish ? (
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
                    showBtn={showBtn}
                    stopbutton={stopbutton}
                    socketTimerStop={socketTimerStop}
                    socketTimerReset={socketTimerReset}
                    socketRoutineFinish={socketRoutineFinish}
                  />
                ) : null}
                {exFinish && (
                  <div className={styles.startButtonBox}>
                    <div
                      className={styles.endMassage}
                    >{`${myInfo.nickname}님, 수고하셨어요!`}</div>
                    <div className={styles.completeText}>완료</div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.bottomVideo}>
              <Bottom
                handleAudio={handleAudio}
                audioOn={audioOn}
                handleExit={handleExit}
                handleCamera={handleCamera}
                cameraOn={cameraOn}
              />
              <Videos
                myMedia={myMedia}
                myInfo={myInfo}
                streams={streams}
                nicknames={nicknames}
              />
            </div>
          </div>
          <AllRoutineWide
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
            openAllRoutine={openAllRoutine}
            showBtn={showBtn}
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
            showBtn={showBtn}
          />
        ) : null}
      </div>
    </div>
  );
}
