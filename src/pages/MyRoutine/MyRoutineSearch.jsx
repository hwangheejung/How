import React from 'react';
import { useState } from 'react';
import styles from '../../css/MyRoutine.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MyRoutineSearch() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/my/routine/list');
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

      <div className={styles.MyRoutineListarr}>
        {SearchArray.map((routine) => (
          <button
            type='button'
            className={styles.MyroutineClick}
            onClick={() => onPopup(routine.id)}
          >
            <div className={styles.MyRoutineListItem}>
              <div className={styles.subject}>{routine.subject}</div>
              <div className={styles.myhits}>{routine.hits}</div>
              <div className={styles.create_date}>{routine.date}</div>
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
