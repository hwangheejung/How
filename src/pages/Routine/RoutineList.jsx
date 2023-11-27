import React from "react";
import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../css/Routine/RoutineList.module.css";
import RoutineDetail from "./RoutineDetail";

export default function RoutineList() {
  const [routinedata, setRoutindata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [detailPopup, setDetailPopup] = useState(false);
  const [detailId, setDetailId] = useState("");

  const [searchbool, setSearchbool] = useState(false);
  const [reloading, setReLoading] = useState(false);
  const navigate = useNavigate();

  const SearchValue = (event) => {
    setSearchInput(event.target.value);
  };

  const onClickSearch = () => {
    let sArray = routinedata.filter(
      (search) =>
        search.routine.subject.includes(searchInput) ||
        search.cate.includes(searchInput)
    );
    setRoutindata(sArray);
    setSearchbool(true);

    // navigate('/routineSearch', { state: { sArray } });
  };

  // console.log(routinedata);

  const onPress = (e) => {
    if (e.key === "Enter") {
      let sArray = routinedata.filter(
        (search) =>
          search.routine.subject.includes(searchInput) ||
          search.cate.includes(searchInput)
      );
      setRoutindata(sArray);
      setSearchbool(true);
      // navigate("/routineSearch", { state: { sArray } });
    }
  };

  const onPopup = (id) => {
    setDetailId(id);
    setDetailPopup(true);
  };

  const backscreen = () => {
    setSearchbool(false);
    setReLoading(!reloading);
  };
  const fetchroutine = async () => {
    try {
      setRoutindata(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "https://52.78.0.53.sslip.io/api/ex-routines?type=false"
      );
      setRoutindata(response.data.result.routines);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, [reloading]);

  const windowReload = () => {
    window.location.reload();
  };

  console.log(routinedata);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!routinedata) return <div>null</div>;

  return (
    <div className={styles.header}>
      <div className={styles.Routine}>운동루틴</div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.routinesearch}
          placeholder="Search..."
          value={searchInput}
          onChange={SearchValue}
          onKeyPress={onPress}
        />
        <button className={styles.searchButton} onClick={onClickSearch}>
          <AiOutlineSearch />
        </button>
      </div>
      <div className={styles.RoutineListarr}>
        {routinedata.map((routine, index) => (
          <div
            key={routine.routine.id}
            type="button"
            className={`${styles.routineClick}`}
          >
            <div className={styles.RoutineListItem}>
              <div className={styles.subjectHits}>
                <span className={styles.subject}>
                  {routine.routine.subject}
                </span>
                <div className={styles.hitBox}>
                  <span className={styles.dot}>∙</span>
                  <span className={styles.hits}>
                    조회수 {routine.routine.hits}회
                  </span>
                </div>
                <div className={styles.heartIconBox}>
                  <FaHeart className={styles.heartIcon} />
                </div>
              </div>
              <div className={styles.cates}>
                {routine.cate.map((item, index) => (
                  <span key={index} className={styles.actionCate}>
                    #{item}
                  </span>
                ))}
              </div>
            </div>
            <button
              className={styles.detailButton}
              onClick={() => onPopup(routine.routine.id)}
            >
              더보기
            </button>
          </div>
        ))}
        <div>
          {searchbool ? (
            <button className={styles.backbutton} onClick={backscreen}>
              뒤로가기
            </button>
          ) : null}
        </div>
      </div>
      {detailPopup ? (
        <RoutineDetail
          setDetailPopup={setDetailPopup}
          detailId={detailId}
          windowReload={windowReload}
        />
      ) : null}
    </div>
  );
}
