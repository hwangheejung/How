import React, { useState } from 'react';
import styles from '../../css/Routine/RoutineList.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import RoutineDetail from './RoutineDetail';

export default function Routinedetail() {
  const [detailPopup, setDetailPopup] = useState(false);
  const [detailId, setDetailId] = useState('');

  const navigate = useNavigate();

  const onClick = () => {
    navigate('/routine/list');
  };

  const onPopup = (id) => {
    setDetailId(id);
    setDetailPopup(true);
  };

  const windowReload = () => {
    window.location.reload();
  };

  let location = useLocation();
  const SearchArray = location.state.sArray;
  return (
    <div className={styles.header}>
      <div className={styles.Routine}>Search</div>
      <div className={styles.RoutineListarr}>
        {SearchArray.map((routine) => (
          <div
            key={routine.routine.id}
            type='button'
            className={styles.routineClick}
          >
            <div className={styles.RoutineListItem}>
              <div className={styles.subjectHits}>
                <span className={styles.subject}>
                  {routine.routine.subject}
                </span>
                <div className={styles.hitBox}>
                  <span className={styles.dot}>∙</span>
                  <span className={styles.hits}>
                    조회수: {routine.routine.hits}회
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
              onClick={() => onPopup(routine.routine.id)}
            >
              더보기
            </button>
          </div>
        ))}
      </div>
      <button className={styles.backbutton} onClick={onClick}>
        뒤로가기
      </button>
      {detailPopup ? (
        <RoutineDetail
          setDetailPopup={setDetailPopup}
          detailId={detailId}
          windowReload={windowReload}
        />
      ) : null}
    </div>
  );
}
