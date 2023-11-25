import React, { useEffect, useState } from 'react';
import styles from '../../css/LivePage/AllRoutineWide.module.css';
import ActionModify from '../LiveExercise/ActionModify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';

export default function AllRoutineWide({
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
  openAllRoutine,
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
      setSelectedAction(action[0]);
    }
  }, [isModify, modifyActionId]);

  const handleActionModify = (routineActionId) => {
    socketSetModify(routineActionId);
  };

  return (
    <div
      className={`${styles.allRoutinePopup} ${openAllRoutine && styles.show}`}
    >
      <div className={styles.allRoutine}>
        <div className={styles.routineDetails}>
          {routine?.routineDetails?.map((detail, index) =>
            detail.type ? (
              <div className={styles.detailModify}>
                <div
                  key={detail.id}
                  className={styles.routineDetail}
                  onClick={() => handleActionModify(detail.id)}
                >
                  <span className={styles.sequence}>{index + 1}</span>
                  <span className={styles.detailname}> {detail.ex.name}</span>
                  <div className={styles.details}>
                    <div className={styles.ex}>
                      <FontAwesomeIcon
                        icon={faDumbbell}
                        className={styles.dumbbellIcon}
                      />
                      <span> {detail.time}s</span>
                    </div>
                    <div className={styles.ex}>
                      <span className={styles.restText}>rest</span>
                      <span> {detail.rest}s</span>
                    </div>
                    <div className={styles.ex}>
                      <span> {detail.set} set</span>
                    </div>
                  </div>
                  <div className={styles.video}>동영상 들어올 자리</div>
                </div>
                {isModify &&
                  selectedAction &&
                  selectedAction.id === detail.id && (
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
            ) : (
              <div className={styles.detailModify}>
                <div
                  key={detail.id}
                  className={styles.routineDetail}
                  onClick={() => handleActionModify(detail.id)}
                >
                  <span className={styles.sequence}>{index + 1}</span>
                  <span className={styles.detailname}> {detail.ex.name}</span>
                  <div className={styles.details}>
                    <div className={styles.ex}>
                      <FontAwesomeIcon
                        icon={faDumbbell}
                        className={styles.dumbbellIcon}
                      />
                      <span> {detail.count}개</span>
                    </div>
                    <div className={styles.ex}>
                      <span className={styles.restText}>rest</span>
                      <span> {detail.rest}s</span>
                    </div>
                    <div className={styles.ex}>
                      <span> {detail.set} set</span>
                    </div>
                  </div>
                  <div className={styles.video}>동영상 들어올 자리</div>
                </div>
                {isModify &&
                  selectedAction &&
                  selectedAction.id === detail.id && (
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
            )
          )}
        </div>
      </div>
    </div>
  );
}
