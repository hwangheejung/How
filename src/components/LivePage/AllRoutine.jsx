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
    <div className={styles.allRoutine}>
      <div className={styles.routineTitle}>{routine?.name}</div>
      <div className={styles.cates}>
        {routine?.cate.map((item, index) => (
          <span key={index} className={styles.actionCate}>
            #{item}
          </span>
        ))}
      </div>
      <div>
        {routine?.routineDetails?.map((detail) =>
          detail.type ? (
            <div
              key={detail.ex.id}
              className={`${styles.timer} ${
                currentActionId === detail.ex.id && styles.currentAction
              }`}
              onClick={() => handleActionModify(detail.id)}
            >
              <span className={styles.detailname}> {detail.ex?.name}</span>
              <span> {detail.time}s</span>
              <div>
                <span>rest</span>
                <span> {detail.rest}s</span>
              </div>
              <div>
                <span>{detail.set} set</span>
              </div>
            </div>
          ) : (
            <div
              key={detail.ex.id}
              className={`${styles.timer} ${
                currentActionId === detail.ex.id && styles.currentAction
              }`}
              onClick={() => handleActionModify(detail.id)}
            >
              <span className={styles.detailname}> {detail.ex?.name}</span>
              <span>{detail.count}개</span>
              <div>
                <span>rest</span>
                <span> {detail.rest}s</span>
              </div>
              <div>
                <span>{detail.set} set</span>
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
  );
}
