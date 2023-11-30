import React, { useEffect, useState } from "react";
import styles from "../../css/LivePage/AllRoutine.module.css";
import ActionModify from "../LiveExercise/ActionModify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";

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
  showBtn,
}) {
  const [selectedAction, setSelectedAction] = useState();

  useEffect(() => {
    if (isModify) {
      let action = routine.routineDetails.filter(
        (r) => r.id === modifyActionId
      );
      setSelectedAction(action[0]);
    }
  }, [isModify, modifyActionId]);

  const handleActionModify = (routineActionId) => {
    if (showBtn) socketSetModify(routineActionId);
  };

  console.log("routine from AllRoutine: ", routine);
  console.log("currentEx from AllRoutine: ", currentEx);

  return (
    <div className={styles.allRoutinePopup}>
      <div className={styles.allRoutine}>
        <div className={styles.topNav}>
          <div className={styles.routineText}>Action List</div>
          <div
            className={styles.closeButton}
            onClick={() => setOpenAllRoutine((prev) => !prev)}
          >
            X
          </div>
        </div>
        <div className={styles.routineDetails}>
          {routine?.routineDetails?.map((detail, index) =>
            detail.type ? (
              <div className={styles.detailModify}>
                <div
                  key={detail.id}
                  className={`${styles.routineDetail} ${
                    !showBtn && styles.noModify
                  } ${
                    currentEx &&
                    detail.order <= currentEx.ex.routinneDetailResult.order &&
                    styles.doneAction
                  }`}
                  onClick={
                    currentEx &&
                    detail.order <= currentEx.ex.routinneDetailResult.order
                      ? null
                      : () => handleActionModify(detail.id)
                  }
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
                  <video className={styles.video} controls muted>
                    <source src={detail.img[0]?.img} type="video/mp4" />
                  </video>
                </div>
                {isModify &&
                  selectedAction &&
                  selectedAction.id === detail.id &&
                  showBtn && (
                    <ActionModify
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
                  className={`${styles.routineDetail} ${
                    !showBtn && styles.noModify
                  } ${
                    currentEx &&
                    detail.order <= currentEx.ex.routinneDetailResult.order &&
                    styles.doneAction
                  }`}
                  onClick={
                    currentEx &&
                    detail.order <= currentEx.ex.routinneDetailResult.order
                      ? null
                      : () => handleActionModify(detail.id)
                  }
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
                  <video className={styles.video} controls muted>
                    <source src={detail.img[0]?.img} type="video/mp4" />
                  </video>
                </div>
                {isModify &&
                  selectedAction &&
                  selectedAction.id === detail.id &&
                  showBtn && (
                    <ActionModify
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
