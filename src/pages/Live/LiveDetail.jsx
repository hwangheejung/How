import { React, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from '../../css/Popup.module.css';
import axios from 'axios';
import { IoIosTimer } from 'react-icons/io';
import { BsPerson } from 'react-icons/bs';

const LiveDetail = (props) => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const windowClose = () => {
    window.close();
  };

  const { routineId, liveId, livesubject, livenick } = useParams();

  const liveStart = (liveId) => {
    window.opener.location.href = `/live/setting/perticipate/${liveId}`;
    window.close();
  };

  const fetchroutine = async () => {
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://52.78.0.53/api/ex-routines/${routineId}`
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

  console.log(detailRoutine);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!detailRoutine) return <div>null</div>;

  return (
    <>
      <div className={styles.name}>Live</div>
      <div className={styles.layout}>
        <div className={styles.subject}>{livesubject}</div>
        <div className={styles.creatorBox}>
          <BsPerson />
          <span className={styles.creator}>{livenick}</span>
        </div>
        <span className={styles.routineTitle}>{detailRoutine.result.name}</span>
        <div className={styles.cates}>
          {detailRoutine.result.cate.map((cate, index) => (
            <span key={index} className={styles.actionCate}>
              #{cate}
            </span>
          ))}
        </div>
        <div className={styles.list}>
          <IoIosTimer />
          <span>Timer/Count</span>
          <span>Rest</span>
          <span>SET</span>
        </div>

        {detailRoutine.result.routineDetails.map((detail) =>
          detail.type ? (
            <div key={detail.id} className={styles.timer}>
              <span className={styles.detailname}> {detail.ex.name}</span>
              <div className={styles.details}>
                <span> {detail.time}s</span>
                <span> {detail.rest}</span>
                <span> {detail.set}</span>
              </div>
            </div>
          ) : (
            <div key={detail.id} className={styles.timer}>
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
