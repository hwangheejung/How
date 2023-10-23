import { faWindowMinimize } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
//import RoutinePopup from "./RoutinePopup";
import styles from "../css/RoutineList.module.css";
import onPopup from "./onPopup";

export default function RoutineList() {
  const [routinedata, setRoutindata] = useState([]); //루틴 데이터 받아오기
  const [searchInput, setSearchInput] = useState(""); //검색
  const [searchArray, setSearchArray] = useState([]);
  //const [showPopup, setShowPopup] = useState(false); //루틴 선택시 팝업창

  const SearchValue = (event) => {
    setSearchInput(event.target.value);
    // console.log(event.target.value);
  };

  const onClick = () => {
    let searcharray = routinedata.filter((search) =>
      search.name.includes(searchInput)
    );
    console.log(searcharray);
    setSearchArray(searcharray);
  };

  routinedata.sort((a, b) => b.hits - a.hits);
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
  }, []);

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
        <button onClick={onClick}>
          <AiOutlineSearch />
        </button>
      </div>

      <div className={styles.RoutineListarr}>
        {routinedata.map((routine) => (
          <button
            type="button"
            className={styles.routineClick}
            onClick={onPopup}
          >
            <div className={styles.RoutineListItem}>
              <div className={styles.subject}>{routine.name}</div>
              <div className={styles.hits}>조회수: {routine.hits}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
