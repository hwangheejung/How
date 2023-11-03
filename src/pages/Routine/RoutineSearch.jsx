import React from "react";
import styles from "../../css/RoutineList.module.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Routinedetail() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/routine/list");
  };

  const onPopup = (id) => {
    //팝업 관리

    const url = `/routinedetail/${id}`;
    window.open(
      url,
      "window_name",
      "width=430,height=500,location=no,status=no,scrollbars=yes,top=200,left=100"
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

      <div className={styles.RoutineListarr}>
        {SearchArray.map((routine) => (
          <button
            type="button"
            className={styles.routineClick}
            onClick={() => onPopup(routine.id)}
          >
            <div className={styles.RoutineListItem}>
              <div className={styles.subject}>{routine.subject}</div>
              <div className={styles.hits}>{routine.hits}</div>
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
