import React from 'react';
import styles from '../../css/RoutineList.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Routinedetail() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/routine/list');
  };

  const onPopup = (id) => {
    //팝업 관리
    const width = 500;
    const height = 700;
    const x = window.outerWidth / 2 - width / 2;
    const y = window.outerHeight / 2 - height / 2;

    const url = `/routinedetail/${id}`;
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
      <div className={styles.Routine}>Search</div>
      <hr />
      <div className={styles.RoutineListarr}>
        {SearchArray.map((routine) => (
          <button
            type='button'
            className={styles.routineClick}
            onClick={() => onPopup(routine.id)}
          >
            <div className={styles.RoutineListItem}>
              <div className={styles.subject}>{routine.subject}</div>
              <div className={styles.hits}>조회수 : {routine.hits}</div>
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
