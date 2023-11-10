import { React, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from '../../css/Popup.module.css';
import axios from 'axios';
import { IoIosTimer } from 'react-icons/io';

const LiveDetail = () => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const windowClose = () => {
    window.close();
  };

  const { routineId, liveId } = useParams();

  const liveStart = (liveId) => {
    window.opener.location.href = `/live/setting/${liveId}`;
    window.close();
  };

  const fetchroutine = async () => {
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
<<<<<<< HEAD
        `http://52.78.0.53/api/ex-routine?id=${routineId}`
=======
        `http://52.78.0.53/api/ex-routines/${id}`
>>>>>>> 495ebc52a2c3ce63da96bf4338288905838d9cec
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
        <div className={styles.subject}>{detailRoutine.result.name}</div>
        <div>
          {/* {detailRoutine.result.routineDetails.map((v) => (
            <span>{v[8]}</span>
          ))} */}
          <div className={styles.category}>
            #{detailRoutine.result.routineDetails[0].cate[0].name}
          </div>
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
            <div className={styles.timer}>
              <span className={styles.detailname}> {detail.ex.name}</span>
              <div className={styles.details}>
                <span> {detail.time}s</span>
                <span> {detail.rest}</span>
                <span> {detail.set}</span>
              </div>
            </div>
          ) : (
            <div className={styles.timer}>
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
            onClick={() => liveStart(liveId)}
          >
            참여
          </button>
          <button className={styles.backbutton} onClick={windowClose}>
            취소
          </button>
        </div>
      </div>
    </>
  );
};

export default LiveDetail;
