import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
//import { useLocation } from "react-router-dom";
import styles from '../../css/Routine/RoutineDetailPopup.module.css';
import { IoIosTimer } from 'react-icons/io';
import { getCookieToken } from '../../store/Cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';

const RoutineDetail = (props) => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const windowClose = () => {
    // window.close();
    props.setDetailPopup(false);
  };

  // const { id } = useParams();
  //const params = { id };

  const myroutineinsert = (id) => {
    axios
      .post(
        // `https://52.78.0.53.sslip.io:8080/api/ex-routines/me`,
        `http://52.78.0.53.sslip.io:8080/api/ex-routines/me`,
        {
          routId: id,
        },
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      )
      .then((res) => {
        // window.opener.location.href = `/my/routine/list`;
        // window.close();
        navigate(`/my/routine/list`);
      });
  };

  const fetchroutine = async () => {
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io/api/ex-routines/${props.detailId}`
        // `http://52.78.0.53.sslip.io:8080/api/ex-routines/${props.detailId}`
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
    <div className={styles.routineDetailPopup}>
      <div className={styles.layout}>
        <div className={styles.subjectHits}>
          <div className={styles.subject}>{detailRoutine.result.name}</div>
          <div className={styles.hits}>
            ∙ 조회수 {detailRoutine.result.hits}회
          </div>
        </div>
        <div className={styles.cates}>
          {detailRoutine.result.cate.map((item, index) => (
            <span key={index} className={styles.actionCate}>
              #{item}
            </span>
          ))}
        </div>
        <div className={styles.routineInfo}>
          {detailRoutine.result.routineDetails.map((detail, index) =>
            detail.type ? (
              <div key={detail.id} className={styles.routineDetail}>
                <span className={styles.sequence}>{index + 1}</span>
                <span className={styles.detailname}> {detail.ex.name}</span>
                <div className={styles.details}>
                  <div className={styles.ex}>
                    <FontAwesomeIcon
                      icon={faDumbbell}
                      className={styles.dumbbellIcon}
                    />
                    <span> {detail.time}s</span>
                  </div>
                  <div className={styles.ex}>
                    <span className={styles.restText}>rest</span>
                    <span> {detail.rest}s</span>
                  </div>
                  <div className={styles.ex}>
                    <span> {detail.set} set</span>
                  </div>
                </div>
                <div className={styles.video}>동영상 들어올 자리</div>
              </div>
            ) : (
              <div key={detail.id} className={styles.routineDetail}>
                <span className={styles.sequence}>{index + 1}</span>
                <span className={styles.detailname}> {detail.ex.name}</span>
                <div className={styles.details}>
                  <div className={styles.ex}>
                    <FontAwesomeIcon
                      icon={faDumbbell}
                      className={styles.dumbbellIcon}
                    />
                    <span> {detail.count}개</span>
                  </div>
                  <div className={styles.ex}>
                    <span className={styles.restText}>rest</span>
                    <span> {detail.rest}s</span>
                  </div>
                  <div className={styles.ex}>
                    <span> {detail.set} set</span>
                  </div>
                </div>
                <div className={styles.video}>동영상 들어올 자리</div>
              </div>
            )
          )}
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={() => myroutineinsert(props.detailId)}
          >
            내 루틴 추가
          </button>
          <button className={styles.button} onClick={windowClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetail;
