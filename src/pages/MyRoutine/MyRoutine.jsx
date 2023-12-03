import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../css/MyRoutine/MyRoutine.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookieToken } from '../../store/Cookie';
import MyRoutineDetail from './MyRoutineDetail';

export default function MyRoutine() {
  const [myroutinedata, setMyRoutindata] = useState();
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);
  const [myroutineSearch, setMyroutineSearch] = useState('');
  const [type, setType] = useState(true);
  const [isRoutineDetailPopup, setIsRoutineDetailPopup] = useState(false);
  const [routineId, setRoutineId] = useState('');
  const [myroutid, setMyroutid] = useState('');
  const [searchbool, setSearchbool] = useState(false); //검색 여부
  const [reloading, setReLoading] = useState(false); //검색이 끝나고 데이터 다시 받아오기 위해

  const navigate = useNavigate();

  const SearchValue = (event) => {
    //검색 값
    setMyroutineSearch(event.target.value);
  };

  const onPopup = (routineId, id) => {
    setRoutineId(routineId);
    setIsRoutineDetailPopup(true);
    setMyroutid(id);
  };

  const onClickSearch = () => {
    //검색 버튼 함수

    let sArray = myroutinedata.filter(
      (search) =>
        search.routine.routineSubject.includes(myroutineSearch) ||
        search.cate.includes(myroutineSearch)
    );
    setMyRoutindata(sArray);
    setSearchbool(true);
    //검색관리
  };
  const onPress = (e) => {
    if (e.key === 'Enter') {
      //검색 버튼 함수

      let sArray = myroutinedata.filter(
        (search) =>
          search.routine.routineSubject.includes(myroutineSearch) ||
          search.cate.includes(myroutineSearch)
      );
      setMyRoutindata(sArray);
      setSearchbool(true);
    }
  };

  const onhitsOrder = () => {
    setType(false);
  };
  const onCreateOrder = () => {
    setType(true);
  };
  const backscreen = () => {
    setSearchbool(false);
    setReLoading(!reloading);
  };
  const fetchroutine = async () => {
    try {
      setMyRoutindata(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io/api/ex-routines/me?type=${type}`,
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      );
      setMyRoutindata(response.data.result);
    } catch (e) {
      setError(e);
      console.log('에러 발생', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, [type, reloading]);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!myroutinedata) return <div>null</div>;

  console.log('myroutine data: ', myroutinedata);
  return (
    <div className={styles.header}>
      <div className={styles.Routine}>my routine</div>
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
        <button
          onClick={onhitsOrder}
          type='button'
          className={`${styles.sortButton} ${
            type === false && styles.selected
          }`}
        >
          운동횟수순
        </button>
        <button
          onClick={onCreateOrder}
          type='button'
          className={`${styles.sortButton} ${type === true && styles.selected}`}
        >
          최신순
        </button>
      </div>
      <div className={styles.RoutineListarr}>
        {myroutinedata?.map(
          (
            myroutine //내 루틴들 보여주기
          ) => (
            <div
              key={myroutine.routineId}
              type='button' //상세정보 보여주기 버튼
              className={styles.MyroutineClick}
            >
              <div className={styles.MyRoutineListItem}>
                <div className={styles.subjectHits}>
                  <span className={styles.subject}>
                    {myroutine.routine.routineSubject}
                  </span>

                  <div className={styles.hitBox}>
                    <span className={styles.dot}>∙</span>
                    <span className={styles.myhits}>
                      운동 횟수 {myroutine.routine.count}회
                    </span>
                  </div>
                </div>
                <div className={styles.createBox}>
                  <span className={styles.dot}>∙</span>
                  <span className={styles.createDate}>
                    생성일 {myroutine.routine.createDate}
                  </span>
                </div>
                <div className={styles.heartIconBox}>
                  <FaHeart className={styles.heartIcon} />
                </div>
                <div className={styles.cates}>
                  {myroutine.cate.map((item, index) => (
                    <span key={index} className={styles.actionCate}>
                      #{item}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className={styles.addmyroutinebtn}
                onClick={() =>
                  onPopup(myroutine.routine.routineId, myroutine.routine.id)
                }
              >
                자세히 보기
              </button>
            </div>
          )
        )}
        <div>
          {searchbool ? (
            <button className={styles.backbutton} onClick={backscreen}>
              뒤로가기
            </button>
          ) : null}
        </div>
      </div>
      {isRoutineDetailPopup ? (
        <MyRoutineDetail
          setIsRoutineDetailPopup={setIsRoutineDetailPopup}
          routineId={routineId}
          myroutid={myroutid}
        />
      ) : null}
    </div>
  );
}
