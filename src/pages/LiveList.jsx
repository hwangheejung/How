import React from "react";
import { useState, useEffect } from "react";
import styles from "../css/LiveList.module.css";
import { AiOutlineSearch, AiOutlinePlusSquare } from "react-icons/ai";
import onPopup from "./onPopup";
export default function LiveList() {
  const [livedata, setLivedata] = useState([]);
  const [searchArray, setSearchArray] = useState([]);
  const [liveSearch, setliveSearch] = useState("");

  const SearchValue = (event) => {
    setliveSearch(event.target.value);
    //console.log(event.target.value);
  };

  const onClick = () => {
    let searchArray = [...livedata];
    console.log(searchArray);
    let searcharray = livedata.filter((search) =>
      search.name.includes(liveSearch)
    );
    console.log(searcharray);
    setSearchArray(searcharray);
  };
  useEffect(() => {
    const routines = [
      {
        id: 1,
        name: " 운동 할 수 있어요!",
        hits: 50,
        date: "2022-03-04",
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
    setLivedata(routines);
  }, []);

  return (
    <div className={styles.header}>
      <span className={styles.Live}>Live</span>
      <button className={styles.insertLive} onClick={onPopup}>
        <AiOutlinePlusSquare size="25" />
      </button>
      <hr />
      <div className={styles.SearchandSort}>
        <input
          type="text"
          className={styles.SearchandSort2}
          placeholder="Search"
          value={liveSearch}
          onChange={SearchValue}
        />
        <button className={styles.SearchButton} onClick={onClick}>
          <AiOutlineSearch />
        </button>
      </div>

      <div className={styles.Livearr}>
        {livedata.map((routine) => (
          <button type="button" className={styles.LiveClick} onClick={onPopup}>
            <div className={styles.LiveListItem}>
              <div className={styles.subject}>{routine.name}</div>
              <div className={styles.hits}>{routine.hits}</div>
              <div className={styles.create_date}>{routine.date}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
