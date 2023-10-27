import React from "react";
import { useState } from "react";
import styles from "../../css/MyRoutine.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import onPopup from "../onPopup";

export default function MyRoutineSearch() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/my/routine/list");
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
            type="button"
            className={styles.MyroutineClick}
            onClick={() => onPopup(routine.id)}
          >
            <div className={styles.MyRoutineListItem}>
              <div className={styles.subject}>{routine.name}</div>
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
