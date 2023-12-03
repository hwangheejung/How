import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../css/Popup.module.css';
import axios from 'axios';

const RoutineStart = (props) => {
  const [detailRoutine, setDetailRoutine] = useState(null); //루틴 상세 배열
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const { routid, id } = useParams(); //루틴 아이디를 받아옴

  const Start = () => {
    props.setIsRoutineDetailPopup(false);
  };

  const fetchroutine = async () => {
    //routine 상세정보 api 받아옴
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io/api/ex-routines/${routid}`
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
    <div className={styles.routinestartDetailPopup}>
      <div className={styles.layout}>
        <div className={styles.name}>detail</div>
        <div className={styles.routineInfo}>
          {detailRoutine.result.routineDetails.map(
            (
              detail,
              index //운동 동작 정보 (이름,설명) 띄우기
            ) => (
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
            )
          )}
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
