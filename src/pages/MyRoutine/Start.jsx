import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Timer from "./Timer";
import styles from "../../css/Popup.module.css";
import axios from "axios";

const Startex = () => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const { id } = useParams();

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
    <div>
      <div className={styles.name}>Exercise</div>
      <div className={styles.frame}>
        <div className={styles.left}>
          {detailRoutine.result.routineDetails.map((detail) =>
            detail.type ? (
              <div key={detail.id} className={styles.timer}>
                <span className={styles.detailname}> {detail.ex.name}</span>
                <span> {detail.time}s</span>
                <div>
                  <span> rest</span>
                  <span> {detail.rest}s</span>
                </div>
              </div>
            ) : (
              <div className={styles.timer}>
                <span className={styles.detailname}> {detail.ex.name}</span>
                <span> {detail.count}개</span>
                <div>
                  <span>rest</span>
                  <span> {detail.rest}</span>
                </div>
              </div>
            )
          )}
        </div>
        <div className={styles.right}>
          <Timer />
        </div>
      </div>
      <Timer />
    </div>
  );
};

export default Startex;
