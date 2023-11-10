import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../css/Popup.module.css";
import axios from "axios";

const ExerciseDetail = () => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate();

  const onClickBack = () => {
    navigate(`/my/routine/list`);
  };
  const fetchroutine = async () => {
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://52.78.0.53/api/ex-routines/${id}`
      );
      setDetailRoutine(response.data.result.routineDetails);
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

  //console.log(detailRoutine);

  return (
    <div>
      <div className={styles.frame}>
        <div className={styles.left}>
          {detailRoutine.map((detail) =>
            detail.type ? (
              <div key={detail.ex.id} className={styles.timer}>
                <span className={styles.detailname}> {detail.ex?.name}</span>
                <span> {detail.time}s</span>
                <div>
                  <span>rest</span>
                  <span> {detail.rest}s</span>
                </div>
                <div>
                  <span>{detail.set} set</span>
                </div>
              </div>
            ) : (
              <div key={detail.ex.id} className={styles.timer}>
                <span className={styles.detailname}> {detail.ex?.name}</span>
                <span>{detail.count}개</span>
                <div>
                  <span>rest</span>
                  <span> {detail.rest}s</span>
                </div>
                <div>
                  <span>{detail.set} set</span>
                </div>
              </div>
            )
          )}
          <button onClick={onClickBack} className={styles.button}>
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
