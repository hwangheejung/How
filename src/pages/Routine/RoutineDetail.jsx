import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
//import { useLocation } from "react-router-dom";
import styles from "../../css/Popup.module.css";
import { IoIosTimer } from "react-icons/io";

const RoutineDetail = () => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const windowClose = () => {
    window.close();
  };

  const { id } = useParams();
  //const params = { id };

  const routineStart = (id) => {
    window.opener.location.href = `/my/routine/list`;
    window.close();
  };

  const fetchroutine = async () => {
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://52.78.0.53/api/ex-routine?id=${id}`
      );
      setDetailRoutine(response.data);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!detailRoutine) return <div>null</div>;

  return (
    <>
      <div className={styles.name}>detail</div>
      <div className={styles.layout}>
        <div className={styles.subject}>
          {detailRoutine.result.routineDetails.routine.subject}
        </div>
        <div className={styles.hits}>
          조회수 : {detailRoutine.result.routineDetails.routine.hits}
        </div>
        <div className={styles.timer}>
          <IoIosTimer />
          <span>Timer</span>
          <span>Rest</span>
          <span>SET</span>
        </div>
        <div>
          <span> {detailRoutine.result.time}</span>
          <span> {detailRoutine.result.rest}</span>
          <span> {detailRoutine.result.set}</span>
        </div>

        <div>
          <button
            className={styles.backbutton}
            onClick={() => routineStart(id)}
          >
            내 루틴 추가
          </button>
          <button className={styles.backbutton} onClick={windowClose}>
            취소
          </button>
        </div>
      </div>
    </>
  );
};

export default RoutineDetail;
