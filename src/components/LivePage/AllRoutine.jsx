import React, { useEffect, useState } from 'react';
import styles from '../../css/LivePage/AllRoutine.module.css';
import ActionModify from '../LiveExercise/ActionModify';

export default function AllRoutine({
  routine,
  currentEx,
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
  setOpenAllRoutine,
}) {
  const [selectedAction, setSelectedAction] = useState();

  const currentActionId = currentEx
    ? currentEx.ex.routinneDetailResult.ex.id
    : '';

  useEffect(() => {
    if (isModify) {
      let action = routine.routineDetails.filter(
        (r) => r.id === modifyActionId
      );
      // console.log('action: ', action[0]);
      setSelectedAction(action[0]);
    }
  }, [isModify, modifyActionId]);

  const handleActionModify = (routineActionId) => {
    socketSetModify(routineActionId);
  };

  // console.log('routine: ', routine);

  return (
    <div className={styles.allRoutinePopup}>
      <div className={styles.allRoutine}>
        {/* <div className={styles.routineTitle}>{routine?.name}</div> */}
        {/* <div className={styles.cates}>
        {routine?.cate.map((item, index) => (
          <span key={index} className={styles.actionCate}>
            #{item}
          </span>
        ))}
      </div> */}
        <div onClick={() => setOpenAllRoutine((prev) => !prev)}>X</div>
        <div className={styles.routineDetails}>
          {routine?.routineDetails?.map((detail, index) =>
            detail.type ? (
              <div>
                <span className={styles.sequence}>{index + 1}</span>
                <div
                  key={detail.ex.id}
                  className={`${styles.timer} ${
                    currentActionId === detail.ex.id && styles.currentAction
                  }`}
                  onClick={() => handleActionModify(detail.id)}
                >
                  <div className={styles.detailname}> {detail.ex?.name}</div>
                  <div> {detail.time}s</div>
                  <div>
                    <span>rest</span>
                    <span> {detail.rest}s</span>
                  </div>
                  <div>
                    <span>{detail.set} set</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span className={styles.sequence}>{index + 1}</span>
                <div
                  key={detail.ex.id}
                  className={`${styles.timer} ${
                    currentActionId === detail.ex.id && styles.currentAction
                  }`}
                  onClick={() => handleActionModify(detail.id)}
                >
                  <div className={styles.detailname}> {detail.ex?.name}</div>
                  <div>{detail.count}개</div>
                  <div>
                    <span>rest</span>
                    <span> {detail.rest}s</span>
                  </div>
                  <div>
                    <span>{detail.set} set</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {isModify && selectedAction && (
          <ActionModify
            // setIsModify={setIsModify}
            routine={routine}
            selectedAction={selectedAction}
            socketModifyComplete={socketModifyComplete}
            socketDecrease={socketDecrease}
            isDecrease={isDecrease}
            socketIncrease={socketIncrease}
            isIncrease={isIncrease}
            setIsModify={setIsModify}
            isModifySend={isModifySend}
            setIsModifySend={setIsModifySend}
            socketRoutineChange={socketRoutineChange}
          />
        )}
      </div>
    </div>
  );
}
