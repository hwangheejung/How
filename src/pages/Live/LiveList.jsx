import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../css/Live/LiveList.module.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlinePlusSquare } from 'react-icons/ai';
import axios from 'axios';
import LiveDetail from './LiveDetail';

export default function LiveList() {
  const [livedata, setLivedata] = useState([]); //live data가져오기
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);
  const [liveSearch, setliveSearch] = useState(''); //live 검색어

  const navigate = useNavigate();

  const SearchValue = (event) => {
    setliveSearch(event.target.value);
    //console.log(event.target.value);
  };

  const onPopupdetail = (routineId, liveId, livesubject, livenick) => {
    //라이브 상세페이지 이동
    const width = 500;
    const height = 700;
    const x = window.outerWidth / 2 - width / 2;
    const y = window.outerHeight / 2 - height / 2;

    const url = `/livedetail/${routineId}/${liveId}/${livesubject}/${livenick}`;
    <LiveDetail livesubject={livesubject} livenick={livenick} />;
    window.open(
      url,
      'window_name',
      `width=${width},height=${height},location=no,status=no,scrollbars=yes,top=${y},left=${x}`
    );
  };
  const onPopup = () => {
    //팝업 관리
    const width = 500;
    const height = 700;
    const x = window.outerWidth / 2 - width / 2;
    const y = window.outerHeight / 2 - height / 2;

    const url = `/Makelive`;
    window.open(
      url,
      'window_name',
      `width=${width},height=${height},location=no,status=no,scrollbars=yes,top=${y},left=${x}`
    );
    //navigate(`/makelive`);
  };
  const onPress = (e) => {
    if (e.key === 'Enter') {
      let sArray = livedata.result.liveListMappings.filter(
        (search) =>
          search.subject.includes(liveSearch) ||
          search.nick.includes(liveSearch)
      );

      console.log(sArray);

      //console.log(searchArray);
      navigate('/liveSearch', { state: { sArray } });
    }
  };
  const onClick = () => {
    let sArray = livedata.result.liveListMappings.filter(
      (search) =>
        search.subject.includes(liveSearch) || search.nick.includes(liveSearch)
    );

    console.log(sArray);

    //console.log(searchArray);
    navigate('/liveSearch', { state: { sArray } });
  };

  const fetchLive = async () => {
    try {
      setLivedata(null);
      setLoading(null);
      setError(null);

      const response = await axios.get('http://52.78.0.53/api/lives');
      setLivedata(response.data);
      console.log(response.data.result.liveListMappings);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLive();
  }, []);
  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!livedata) return <div>null</div>;
  return (
    <div className={styles.header}>
      <div className={styles.titleplus}>
        <div className={styles.liveTitleBox}>
          <div className={styles.Live}>how live</div>
          <img
            src='/liveIcon.png'
            alt='live icon'
            style={{ width: '30px', height: '23px' }}
          />
        </div>
        <button className={styles.insertLive} onClick={onPopup}>
          {/* <AiOutlinePlusSquare size='25' /> */}+
        </button>
      </div>
      <div className={styles.searchContainer}>
        <input
          type='text'
          className={styles.routinesearch}
          placeholder='Search'
          value={liveSearch}
          onChange={SearchValue}
          onKeyPress={onPress}
        />
        <button className={styles.searchButton} onClick={onClick}>
          <AiOutlineSearch />
        </button>
      </div>
      <div className={styles.Livearr}>
        {livedata.result?.liveListMappings.map((live) => (
          <div key={live.id} type='button' className={styles.LiveClick}>
            <div className={styles.LiveListItem}>
              <div className={styles.subject}>{live.subject}</div>
              <div className={styles.nick}>{live.nick}</div>
            </div>
            <button
              className={styles.detailButton}
              onClick={() =>
                onPopupdetail(live.routineId, live.id, live.subject, live.nick)
              }
            >
              참가하기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
