import React from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "../../css/Popup.module.css";

const MyRoutineDetail = () => {
  const windowClose = () => {
    window.close();
  };

  const { id } = useParams();

  const routineStart = (id) => {
    window.opener.location.href = `/start/${id}`;
    //window.close();

    const url = `/routinestart/${id}`;
    window.open(
      url,
      "window_name",
      "width=430,height=500,location=no,status=no,scrollbars=yes,top=200,left=100"
    );
  };
  return (
    <>
      <div>HI</div>
      <div>{id}</div>
      <div>
        <button className={styles.backbutton} onClick={() => routineStart(id)}>
          시작
        </button>
        <button className={styles.backbutton} onClick={windowClose}>
          닫기
        </button>
      </div>
    </>
  );
};

export default MyRoutineDetail;
