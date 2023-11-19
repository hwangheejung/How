import React from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../css/LivePage/LivePage.module.css';
import LiveExStart from '../../components/LiveExercise/LiveExStart';
import LiveReadyTimer from '../../components/LiveExercise/LiveReadyTimer';
import LiveInfo from '../../components/LivePage/LiveInfo';
import Videos from '../../components/LivePage/Videos';
import AllRoutine from '../../components/LivePage/AllRoutine';
import Bottom from '../../components/LivePage/Bottom';
import useSocket from '../../hooks/useSocket';

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

  return (
    <div className={styles.root}>
      {/* 라이브 기본 정보 */}
      <LiveInfo liveTitle={liveTitle} participateNum={participateNum} />
      {/* 각 운동 동작 */}
      <div className={styles.middleContainer}>
        {/* 카메라 */}

        <div className={styles.videoAction}>
          <Videos
            myMedia={myMedia}
            myInfo={myInfo}
            streams={streams}
            nicknames={nicknames}
          />
          <div className={styles.currentActionBox}>
            <div>
              {isownerbtn ? (
                <button onClick={handleStart}>START </button>
              ) : (
                <div></div>
              )}
            </div>
            <div>
              {readyTimer ? ( //준비 타이머
                <LiveReadyTimer getReadyTimer={getReadyTimer} time={5} />
              ) : (
                <div></div> //준비타이머 한번 나타나면 아무것도 나타나지 않음
              )}
            </div>
            <div>
              {currentEx ? (
                <div>
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
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
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
        />
      </div>
      <Bottom
        handleAudio={handleAudio}
        audioOn={audioOn}
        handleExit={handleExit}
        handleCamera={handleCamera}
        cameraOn={cameraOn}
      />
    </div>
  );
}
