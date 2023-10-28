import React from "react";
import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../css/RoutineList.module.css";

export default function RoutineList() {
  const [routinedata, setRoutindata] = useState(null); //루틴 데이터 받아오기
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState(""); //검색

  const navigate = useNavigate();

  const SearchValue = (event) => {
    setSearchInput(event.target.value);
    //console.log(event.target.value);
  };

  //const [showPopup, setShowPopup] = useState(false); //루틴 선택시 팝업창

  const onClickSearch = () => {
    let sArray = routinedata.result.routines.filter((search) =>
      search.subject.includes(searchInput)
    );

    console.log(sArray);

    //console.log(searchArray);
    navigate("/routineSearch", { state: { sArray } });
    //검색관리
  };

  const onPopup = (id) => {
    //팝업 관리

    const url = `/routinedetail/${id}`;
    window.open(
      url,
      "window_name",
      "width=430,height=500,location=no,status=no,scrollbars=yes,top=200,left=100"
    );
    //navigate(`/routinedetail/${id}`, { state: { id } });
  };

  const fetchroutine = async () => {
    try {
      setRoutindata(null);
      setLoading(true);
      setError(null);

      const response = await axios.get("http://52.78.0.53/api/ex-routine/all");
      setRoutindata(response.data);
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
  if (!routinedata) return <div>null</div>;
  /*
  useEffect(() => {
    const routines = [
      {
        id: 1,
        name: "복부 운동 할 수 있어요!",
        hits: 50,
        date: "2023-03-04",
      },
      {
        id: 2,
        name: "간단하게 두가지 하체운동",
        hits: 24,
        date: "2023-01-20",
      },
      {
        id: 3,
        name: "어깨운동 한세트씩",
        hits: 90,
        date: "2023-10-14",
      },
    ];
    setRoutindata(routines);
  }, []);*/

  return (
    <div className={styles.header}>
      <span className={styles.Routine}>Routine</span>
      <hr />
      <div className={styles.SearchandSort}>
        <input
          type="text"
          className={styles.routinesearch}
          placeholder="Search"
          value={searchInput}
          onChange={SearchValue}
        />
        <button onClick={onClickSearch}>
          <AiOutlineSearch />
        </button>
      </div>

      <div className={styles.RoutineListarr}>
        {routinedata.result.routines.map((routine) => (
          <button
            key={routine.id}
            type="button"
            className={styles.routineClick}
            onClick={() => onPopup(routine.id)}
          >
            <div className={styles.RoutineListItem}>
              <div className={styles.subject}>{routine.subject}</div>
              <div className={styles.hits}>조회수: {routine.hits}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
