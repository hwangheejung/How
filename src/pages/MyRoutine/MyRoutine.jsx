import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../css/MyRoutine.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookieToken } from '../../store/Cookie';

export default function MyRoutine() {
  const [myroutinedata, setMyRoutindata] = useState([]);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);
  const [myroutineSearch, setMyroutineSearch] = useState('');
  const [type, setType] = useState(true);

  const navigate = useNavigate();

  const SearchValue = (event) => {
    //검색 값
    setMyroutineSearch(event.target.value);
  };

  const onPopup = (id) => {
    //팝업 관리
    const width = 500;
    const height = 700;
    const x = window.outerWidth / 2 - width / 2;
    const y = window.outerHeight / 2 - height / 2;

    const url = `/myroutindetail/${id}`;
    window.open(
      url,
      'window_name',
      `width=${width},height=${height},location=no,status=no,scrollbars=yes,top=${y},left=${x}`
    );
    // navigate(`/myroutindetail/${id}`, { state: { id } });
    //myRoutine.document.write(id);
  };

  const onClickSearch = () => {
    //검색 버튼 함수

    let sArray = myroutinedata.result.filter(
      (search) =>
        search.routine.routineSubject.includes(myroutineSearch) ||
        search.cate.includes(myroutineSearch)
    );
    //console.log(sArray);
    navigate('/myroutineSearch', { state: { sArray } });
    //검색관리
  };
  const onPress = (e) => {
    if (e.key === 'Enter') {
      //검색 버튼 함수

      let sArray = myroutinedata.result.filter(
        (search) =>
          search.routine.routineSubject.includes(myroutineSearch) ||
          search.cate.includes(myroutineSearch)
      );
      // console.log(sArray);
      navigate('/myroutineSearch', { state: { sArray } });
      //검색관리
    }
  };

  const onhitsOrder = () => {
    setType(false);
  };
  const onCreateOrder = () => {
    setType(true);
  };
  const fetchroutine = async () => {
    try {
      setMyRoutindata(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://52.78.0.53/api/ex-routines/me?type=${type}`,
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      );
      setMyRoutindata(response.data);
    } catch (e) {
      setError(e);
      console.log('에러 발생', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, [type]);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!myroutinedata) return <div>null</div>;

  console.log(myroutinedata.result);
  return (
    <div className={styles.header}>
      <div className={styles.Routine}>MyRoutine</div>
      <hr />
      {/* <div className={styles.SearchandSort}> */}
      <div className={styles.searchContainer}>
        <input //검색어 받기
          type='text'
          className={styles.routinesearch}
          placeholder='Search'
          value={myroutineSearch}
          onChange={SearchValue}
          onKeyPress={onPress}
        />
        <button className={styles.searchButton} onClick={onClickSearch}>
          <AiOutlineSearch />
        </button>
      </div>

      <div className={styles.Sorted}>
        <button onClick={onhitsOrder} type='button' className={styles.sort}>
          운동횟수순
        </button>
        <button onClick={onCreateOrder} type='button' className={styles.sort}>
          최신순
        </button>
      </div>
      {/* </div> */}

      <div className={styles.MyRoutineListarr}>
        {myroutinedata.result?.map(
          (
            myroutine //내 루틴들 보여주기
          ) => (
            <button
              key={myroutine.routine.routineId}
              type='button' //상세정보 보여주기 버튼
              className={styles.MyroutineClick}
              onClick={() => onPopup(myroutine.routine.routineId)}
            >
              <div className={styles.MyRoutineListItem}>
                <div className={styles.subjectcates}>
                  <div className={styles.subject}>
                    {myroutine.routine.routineSubject}
                  </div>
                  <div className={styles.cates}>
                    {myroutine.cate.map((item, index) => (
                      <span key={index} className={styles.actionCate}>
                        #{item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.hitscreate}>
                  <div className={styles.myhits}>{myroutine.routine.count}</div>
                  <div className={styles.createDate}>
                    {myroutine.routine.createDate}
                  </div>
                </div>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}
