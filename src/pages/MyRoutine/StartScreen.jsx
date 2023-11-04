import React from "react";
import styles from "../../css/Popup.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "./Timer";
const StartScreen = () => {
  const navigate = useNavigate;
  const { id } = useParams();
  const onClickStart = () => {
    window.location.href = `/startex/${id}`;
    //navigate(`/my/routine/list/${id}`, { state: { id } });
  };
  return (
    <div>
      <button className={styles.startbutton} onClick={onClickStart}>
        운동 시작
      </button>
    </div>
  );
};

export default StartScreen;
