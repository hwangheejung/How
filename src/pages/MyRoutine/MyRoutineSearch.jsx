import React from 'react';
import { useState } from 'react';
import styles from '../../css/MyRoutine/MyRoutine.module.css';
import { FaHeart } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import MyRoutineDetail from './MyRoutineDetail';

export default function MyRoutineSearch() {
  const [type, setType] = useState(true);
  const [isRoutineDetailPopup, setIsRoutineDetailPopup] = useState(false);
  const [routineId, setRoutineId] = useState('');

  const navigate = useNavigate();

  const onClick = () => {
    navigate('/my/routine/list');
  };

  const onhitsOrder = () => {
    setType(false);
  };
  const onCreateOrder = () => {
    setType(true);
  };

  const onPopup = (routineId) => {
    setRoutineId(routineId);
    setIsRoutineDetailPopup(true);
  };

  let location = useLocation();
  const SearchArray = location.state.sArray;
  console.log(location.state.sArray);
  return (
    <div className={styles.header}>
      <div className={styles.Routine}>Search</div>
      <div className={styles.Sorted} style={{ paddingTop: '30px' }}>
        <button
          onClick={onhitsOrder}
          type='button'
          className={`${styles.sortButton} ${
            type === false && styles.selected
          }`}
        >
          운동횟수순
        </button>
        <button
          onClick={onCreateOrder}
          type='button'
          className={`${styles.sortButton} ${type === true && styles.selected}`}
        >
          최신순
        </button>
      </div>
      <div className={styles.RoutineListarr}>
        {SearchArray.map((routine) => (
          <div
            key={routine.routine.routineId}
            type='button'
            className={styles.MyroutineClick}
          >
            <div className={styles.MyRoutineListItem}>
              <div className={styles.subjectHits}>
                <span className={styles.subject}>
                  {routine.routine.routineSubject}
                </span>
                <div className={styles.hitBox}>
                  <span className={styles.dot}>∙</span>
                  <span className={styles.myhits}>
                    운동 횟수 {routine.routine.count}회
                  </span>
                </div>
                <div className={styles.createBox}>
                  <span className={styles.dot}>∙</span>
                  <span className={styles.createDate}>
                    생성일 {routine.routine.createDate}
                  </span>
                </div>
                <div className={styles.heartIconBox}>
                  <FaHeart className={styles.heartIcon} />
                </div>
              </div>
              <div className={styles.cates}>
                {routine.cate.map((item, index) => (
                  <span key={index} className={styles.actionCate}>
                    #{item}
                  </span>
                ))}
              </div>
            </div>
            <button
              className={styles.detailButton}
              onClick={() => onPopup(routine.routine.routineId)}
            >
              더보기
            </button>
          </div>
        ))}
      </div>

      <button className={styles.backbutton} onClick={onClick}>
        뒤로가기
      </button>
      {isRoutineDetailPopup ? (
        <MyRoutineDetail
          setIsRoutineDetailPopup={setIsRoutineDetailPopup}
          routineId={routineId}
        />
      ) : null}
    </div>
  );
}
