import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
//import { useLocation } from "react-router-dom";
import styles from '../../css/Routine/RoutineDetailPopup.module.css';
import { IoIosTimer } from 'react-icons/io';
import { getCookieToken } from '../../store/Cookie';

const RoutineDetail = () => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const windowClose = () => {
    window.close();
  };

  const { id } = useParams();
  //const params = { id };

  const myroutineinsert = (id) => {
    axios
      .post(
        `http://52.78.0.53/api/ex-routines/me`,
        {
          routId: id,
        },
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      )
      .then((res) => {
        window.opener.location.href = `/my/routine/list`;
        window.close();
      });
  };

  const fetchroutine = async () => {
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://52.78.0.53/api/ex-routines/${id}`
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
  console.log(detailRoutine.result);
  return (
    <>
      <div className={styles.name}>detail</div>
      <div className={styles.layout}>
        <div className={styles.subject}>{detailRoutine.result.name}</div>
        <div className={styles.cates}>
          {detailRoutine.result.cate.map((item, index) => (
            <span key={index} className={styles.actionCate}>
              #{item}
            </span>
          ))}
        </div>
        <div className={styles.hits}>조회수 : {detailRoutine.result.hits}</div>

        <div className={styles.list}>
          <IoIosTimer />
          <span>Timer/Count</span>
          <span>Rest</span>
          <span>SET</span>
        </div>

        {detailRoutine.result.routineDetails.map((detail) =>
          detail.type ? (
            <div className={styles.timer} key={detail.id}>
              <span className={styles.detailname}> {detail.ex.name}</span>
              <div className={styles.details}>
                <span> {detail.time}s</span>
                <span> {detail.rest}</span>
                <span> {detail.set}</span>
              </div>
            </div>
          ) : (
            <div className={styles.timer} key={detail.id}>
              <span className={styles.detailname}> {detail.ex.name}</span>
              <div className={styles.details}>
                <span> {detail.count}개</span>
                <span> {detail.rest}</span>
                <span> {detail.set}</span>
              </div>
            </div>
          )
        )}

        <div className={styles.buttons}>
          <button
            className={styles.backbutton}
            onClick={() => myroutineinsert(id)}
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
