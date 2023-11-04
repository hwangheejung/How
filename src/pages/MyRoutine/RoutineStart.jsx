import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../../css/Popup.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosTimer } from "react-icons/io";

const RoutineStart = () => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const Start = (id) => {
    //window.opener.location.href = `/my/routine/list`;
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
        {detailRoutine.result.routineDetails.map((detail) => (
          <div className={styles.timerlayout}>
            <div className={styles.detailname}> {detail.ex.name}</div>
            <div className={styles.detaildesc}> {detail.ex.desc}</div>
          </div>
        ))}

        <div>
          <button className={styles.backbutton} onClick={() => Start(id)}>
            START
          </button>
        </div>
      </div>
    </>
  );
};

export default RoutineStart;
