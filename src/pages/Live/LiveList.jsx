import React, { useTransition } from 'react';
import { useState, useEffect } from 'react';
import styles from '../../css/Live/LiveList.module.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlinePlusSquare } from 'react-icons/ai';
import axios from 'axios';
import LiveDetail from './LiveDetail';
import MakeLive from './MakeLive';
import OwnerLiveSetting from './OwnerLiveSetting';
import LiveSetting from './LiveSetting';

export default function LiveList() {
  const [livedata, setLivedata] = useState([]); //live data가져오기
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);
  const [liveSearch, setliveSearch] = useState(''); //live 검색어

  // 모달창
  const [isLiveDetail, setIsLiveDetail] = useState(false);
  const [live, setLive] = useState({
    rotuineId: '',
    liveId: '',
    livesubject: '',
    livenick: '',
  });
  const [isMakeLive, setMakeLive] = useState(false);
  const [isOwnerSetting, setIsOwnerSetting] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [subject, setSubject] = useState('');
  const [isParticipateSetting, setIsParticipateSetting] = useState(false);

  const [searchbool, setSearchbool] = useState(false); //검색 여부
  const [reloading, setReLoading] = useState(false); //검색이 끝나고 데이터 다시 받아오기 위해

  const navigate = useNavigate();

  const SearchValue = (event) => {
    setliveSearch(event.target.value);
    //console.log(event.target.value);
  };

  const onPopupdetail = (routineId, liveId, livesubject, livenick) => {
    setIsLiveDetail((prev) => !prev);
    setLive({ routineId, liveId, livesubject, livenick });
  };
  const onLiveDetailClose = () => {
    setIsLiveDetail((prev) => !prev);
  };

  const onPopupMakeLive = () => {
    setMakeLive((prev) => !prev);
  };

  const onPress = (e) => {
    if (e.key === 'Enter') {
      let sArray = livedata.filter(
        (search) =>
          search.subject.includes(liveSearch) ||
          search.nick.includes(liveSearch)
      );

      setLivedata(sArray);
      setSearchbool(true);
      // console.log(sArray);

      //console.log(searchArray);
      // navigate('/liveSearch', { state: { sArray } });
    }
  };
  const onClick = () => {
    let sArray = livedata.filter(
      (search) =>
        search.subject.includes(liveSearch) || search.nick.includes(liveSearch)
    );

    setLivedata(sArray);
    setSearchbool(true);

    //console.log(searchArray);
    // navigate('/liveSearch', { state: { sArray } });
  };
  const backscreen = () => {
    setSearchbool(false);
    setReLoading(!reloading);
  };
  const fetchLive = async () => {
    try {
      setLivedata(null);
      setLoading(null);
      setError(null);

      const response = await axios.get('https://52.78.0.53.sslip.io/api/lives');
      // const response = await axios.get(
      //   'http://52.78.0.53.sslip.io:8080/api/lives'
      // );
      setLivedata(response.data.result.liveListMappings);
      // console.log(response.data.result.liveListMappings);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLive();
  }, [reloading]);

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
        <button className={styles.insertLive} onClick={onPopupMakeLive}>
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
        {livedata?.map((live) => (
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
      {searchbool ? (
        <button className={styles.backbutton} onClick={backscreen}>
          뒤로가기
        </button>
      ) : null}
      {isLiveDetail ? (
        <LiveDetail
          onLiveDetailClose={onLiveDetailClose}
          live={live}
          setIsParticipateSetting={setIsParticipateSetting}
          setRoomId={setRoomId}
        />
      ) : null}
      {isMakeLive ? (
        <MakeLive
          setMakeLive={setMakeLive}
          setRoomId={setRoomId}
          setSubject={setSubject}
          setIsOwnerSetting={setIsOwnerSetting}
        />
      ) : null}
      {isOwnerSetting ? (
        <OwnerLiveSetting
          roomId={roomId}
          subject={subject}
          setIsOwnerSetting={setIsOwnerSetting}
        />
      ) : null}
      {isParticipateSetting ? (
        <LiveSetting
          roomId={roomId}
          setIsParticipateSetting={setIsParticipateSetting}
        />
      ) : null}
    </div>
  );
}
