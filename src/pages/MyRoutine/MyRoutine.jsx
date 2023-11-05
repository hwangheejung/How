import React from "react";
import { useState, useEffect } from "react";
import styles from "../../css/MyRoutine.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyRoutine() {
  const [myroutinedata, setMyRoutindata] = useState([]);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

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

    let sArray = myroutinedata.result.routines.filter((search) =>
      search.subject.includes(myroutineSearch)
    );
    console.log(sArray);
    navigate("/myroutineSearch", { state: { sArray } });
    //검색관리
  };
  const onPress = (e) => {
    if (e.key === "Enter") {
      //검색 버튼 함수

      let sArray = myroutinedata.result.routines.filter((search) =>
        search.subject.includes(myroutineSearch)
      );
      console.log(sArray);
      navigate("/myroutineSearch", { state: { sArray } });
      //검색관리
    }
  };

  const fetchroutine = async () => {
    try {
      setMyRoutindata(null);
      setLoading(true);
      setError(null);

      const response = await axios.get("http://52.78.0.53/api/ex-routine/all");
      setMyRoutindata(response.data);
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
  if (!myroutinedata) return <div>null</div>;

  return (
    <div className={styles.header}>
      <div className={styles.Routine}>MyRoutine</div>
      <hr />
      <div className={styles.SearchandSort}>
        <div className={styles.searchContainer}>
          <input //검색어 받기
            type="text"
            className={styles.routinesearch}
            placeholder="Search"
            value={myroutineSearch}
            onChange={SearchValue}
            onKeyPress={onPress}
          />
          <button className={styles.searchButton} onClick={onClickSearch}>
            <AiOutlineSearch />
          </button>
        </div>
        np
        <div className={styles.Sorted}>
          <button
            onClick={() => {
              //조회수 정렬
              let copy = [...myroutinedata];

              copy.result.routines.sort((a, b) => b.hits - a.hits);
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

              copy.result.routines.sort(
                (a, b) => new Date(b.createDate) - new Date(a.createDate)
              );
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
        {myroutinedata.result?.routines.map(
          (
            myroutine //내 루틴들 보여주기
          ) => (
            <button
              type="button" //상세정보 보여주기 버튼
              className={styles.MyroutineClick}
              onClick={() => onPopup(myroutine.id)}
            >
              <div key={myroutine.id} className={styles.MyRoutineListItem}>
                <div className={styles.subject}>{myroutine.subject}</div>
                <div className={styles.myhits}>{myroutine.hits}</div>
                <div className={styles.create_date}>{myroutine.createDate}</div>
              </div>
              {/* </div> */}
            </button>
          )
        )}
      </div>
    </div>
  );
}
