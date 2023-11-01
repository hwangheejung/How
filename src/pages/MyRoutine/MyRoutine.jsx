import React from "react";
import { useState, useEffect } from "react";
import styles from "../../css/MyRoutine.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function MyRoutine() {
  const [myroutinedata, setMyRoutindata] = useState([]);
  const [myroutineSearch, setMyroutineSearch] = useState("");

  const navigate = useNavigate();

  const SearchValue = (event) => {
    //검색 값
    setMyroutineSearch(event.target.value);
  };

  const onPopup = (id) => {
    //팝업 관리

    const url = `/myroutindetail/${id}`;
    window.open(
      url,
      "window_name",
      "width=430,height=500,location=no,status=no,scrollbars=yes,top=200,left=100"
    );
    //navigate(`/routindetail/${id}`, { state: { id } });
    //myRoutine.document.write(id);
  };

  const onClickSearch = () => {
    //검색 버튼 함수

    let sArray = myroutinedata.filter((search) =>
      search.name.includes(myroutineSearch)
    );
    console.log(sArray);
    navigate("/myroutineSearch", { state: { sArray } });
    //검색관리
  };
  const onPress = (e) => {
    if (e.key === "Enter") {
      //검색 버튼 함수

      let sArray = myroutinedata.filter((search) =>
        search.name.includes(myroutineSearch)
      );
      console.log(sArray);
      navigate("/myroutineSearch", { state: { sArray } });
      //검색관리
    }
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
    setMyRoutindata(routines);
  }, []);

  return (
    <div className={styles.header}>
      <span className={styles.Routine}>MyRoutine</span>
      <hr />
      <div className={styles.SearchandSort}>
        <input //검색어 받기
          type="text"
          className={styles.routinesearch}
          placeholder="Search"
          value={myroutineSearch}
          onChange={SearchValue}
          onKeyPress={onPress}
        />
        <button className={styles.SearchButton} onClick={onClickSearch}>
          <AiOutlineSearch />
        </button>

        <div className={styles.Sorted}>
          <button
            onClick={() => {
              //조회수 정렬
              let copy = [...myroutinedata];
              console.log(copy);
              copy.sort((a, b) => b.hits - a.hits);
              setMyRoutindata(copy);
            }}
            type="button"
            className={styles.sort}
          >
            조회수
          </button>
          <button
            onClick={() => {
              //최신순 정렬
              let copy = [...myroutinedata];

              copy.sort((a, b) => new Date(b.date) - new Date(a.date));
              console.log(copy);
              setMyRoutindata(copy);
            }}
            type="button"
            className={styles.sort}
          >
            최신순
          </button>
        </div>
      </div>

      <div className={styles.MyRoutineListarr}>
        {myroutinedata.map(
          (
            routine //내 루틴들 보여주기
          ) => (
            <button
              type="button" //상세정보 보여주기 버튼
              className={styles.MyroutineClick}
              onClick={() => onPopup(routine.id)}
            >
              <div className={styles.MyRoutineListItem}>
                <div className={styles.subject}>{routine.name}</div>
                <div className={styles.myhits}>{routine.hits}</div>
                <div className={styles.create_date}>{routine.date}</div>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}
