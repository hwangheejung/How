import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../css/Popup.module.css';
import axios from 'axios';

const RoutineStart = () => {
  const [detailRoutine, setDetailRoutine] = useState(null); //루틴 상세 배열
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const { id } = useParams(); //루틴 아이디를 받아옴

  const Start = (id) => {
    window.close(); //check버튼을 누르면 팝업창이 닫힘
  };

  const fetchroutine = async () => {
    //routine 상세정보 api 받아옴
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io:8080/api/ex-routines/${id}`
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
        {detailRoutine.result.routineDetails.map(
          (
            detail //운동 동작 정보 (이름,설명) 띄우기
          ) => (
            <div className={styles.timerlayout}>
              <div className={styles.detailname}> {detail.ex.name}</div>
              <div className={styles.detaildesc}> {detail.ex.desc}</div>
            </div>
          )
        )}

        <div>
          <button className={styles.backbutton} onClick={() => Start(id)}>
            CHECK
          </button>
        </div>
      </div>
    </>
  );
};

export default RoutineStart;
