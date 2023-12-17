import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../css/Popup.module.css';
import axios from 'axios';

const RoutineStart = (props) => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { routid } = useParams();

  const Start = () => {
    props.setIsRoutineDetailPopup(false);
  };

  const fetchroutine = async () => {
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io/api/ex-routines/${routid}`
      );
      setDetailRoutine(response.data);
    } catch (e) {
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
    <div className={styles.routinestartDetailPopup}>
      <div className={styles.layout}>
        <div className={styles.name}>detail</div>
        <div className={styles.routineInfo}>
          {detailRoutine.result.routineDetails.map((detail, index) => (
            <div key={detail.id} className={styles.routineDetail}>
              <span className={styles.sequence}>{index + 1}</span>
              <span className={styles.detailname}> {detail.ex.name}</span>
              <span className={styles.detaildesc}> {detail.ex.desc}</span>
              <div className={styles.details}>
                <video className={styles.video} controls muted>
                  <source src={detail.img[0]?.img} type='video/mp4' />
                </video>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.button}>
          <button className={styles.backbutton} onClick={() => Start(routid)}>
            CHECK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineStart;
