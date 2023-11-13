import React from 'react';
import { useState } from 'react';
import styles from '../../css/MyRoutine.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MyRoutineSearch() {
  const [type, setType] = useState(true);

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

  const onPopup = (id) => {
    //팝업 관리
    const width = 500;
    const height = 700;
    const x = window.outerWidth / 2 - width / 2;
    const y = window.outerHeight / 2 - height / 2;

    const url = `/myroutindetail/${id}`;
    window.open(
      url,
      'window_name',
      `width=${width},height=${height},location=no,status=no,scrollbars=yes,top=${y},left=${x}`
    );
    //navigate(`/routindetail/${id}`, { state: { id } });
    //myRoutine.document.write(id);
  };
  let location = useLocation();
  const SearchArray = location.state.sArray;
  console.log(location.state.sArray);
  return (
    <div className={styles.header}>
      <span className={styles.Routine}>Search</span>
      <hr />
      <div className={styles.Sorted}>
        <button onClick={onhitsOrder} type='button' className={styles.sort}>
          운동횟수순
        </button>
        <button onClick={onCreateOrder} type='button' className={styles.sort}>
          최신순
        </button>
      </div>
      <div className={styles.MyRoutineListarr}>
        {SearchArray.map((routine) => (
          <button
            key={routine.routine.routineId}
            type='button'
            className={styles.MyroutineClick}
            onClick={() => onPopup(routine.routine.routineId)}
          >
            <div className={styles.MyRoutineListItem}>
              <div className={styles.subjectcates}>
                <div className={styles.subject}>
                  {routine.routine.routineSubject}
                </div>
                <div className={styles.cates}>
                  {routine.cate.map((item, index) => (
                    <span key={index} className={styles.actionCate}>
                      #{item}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.hitscreate}>
                <div className={styles.myhits}>{routine.routine.count}</div>
                <div className={styles.create_date}>
                  {routine.routine.createDate}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button className={styles.backbutton} onClick={onClick}>
        뒤로가기
      </button>
    </div>
  );
}
