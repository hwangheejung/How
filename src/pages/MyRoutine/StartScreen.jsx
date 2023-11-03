import React from "react";
import styles from "../../css/MyRoutine.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "./Timer";
function detail() {
  <div>상세</div>;
}

const StartScreen = () => {
  const navigate = useNavigate;
  const { id } = useParams();
  const onClickBack = () => {
    window.location.href = `/my/routine/list`;
    //navigate(`/my/routine/list/${id}`, { state: { id } });
  };
  return (
    <div className={styles.header}>
      <span className={styles.Routine}>RoutineSTART</span>
      <hr />
      <div>상세</div>
      <Timer />
      <button className={styles.backbutton} onClick={onClickBack}>
        뒤로가기
      </button>
    </div>
  );
};

export default StartScreen;
