import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../css/LiveList.module.css';
import { AiOutlineSearch, AiOutlinePlusSquare } from 'react-icons/ai';
import { PiYoutubeLogoLight } from 'react-icons/pi';
import axios from 'axios';

export default function LiveList() {
  const [livedata, setLivedata] = useState([]); //live data가져오기
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);
  const [searchArray, setSearchArray] = useState([]); //live 검색 배열
  const [liveSearch, setliveSearch] = useState(''); //live 검색어

  const SearchValue = (event) => {
    setliveSearch(event.target.value);
    //console.log(event.target.value);
  };

  const onPopup = () => {
    //팝업 관리
    const width = 500;
    const height = 700;
    const x = window.outerWidth / 2 - width / 2;
    const y = window.outerHeight / 2 - height / 2;

    const url = `/makelive`;
    window.open(
      url,
      'window_name',
      `width=${width},height=${height},location=no,status=no,scrollbars=yes,top=${y},left=${x}`
    );
    //navigate(`/routindetail/${id}`, { state: { id } });
    //mylive.document.write(id);
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

  const fetchLive = async () => {
    try {
      setLivedata(null);
      setLoading(null);
      setError(null);

      const response = await axios.get('http://52.78.0.53/api/live');
      setLivedata(response.data);
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
        <div className={styles.Live}>Live</div>
        <button className={styles.insertLive} onClick={onPopup}>
          <AiOutlinePlusSquare size='25' />
        </button>
      </div>
      <hr />
      <div className={styles.SearchandSort}>
        <input
          type='text'
          className={styles.searchInput}
          placeholder='Search'
          value={liveSearch}
          onChange={SearchValue}
        />
        <button className={styles.SearchButton} onClick={onClick}>
          <AiOutlineSearch />
        </button>
      </div>

      <div className={styles.liveicon}>
        {/* <PiYoutubeLogoLight size='50' /> */}
        <img
          src='/live.png'
          alt='live icon'
          style={{ width: '50px', height: '50px' }}
        />
      </div>
      <div className={styles.Livearr}>
        {livedata.result?.liveListMappings.map((live) => (
          <button
            key={live.id}
            type='button'
            className={styles.LiveClick}
            onClick={onPopup}
          >
            <div className={styles.LiveListItem}>
              <div className={styles.subject}>{live.subject}</div>
              <div className={styles.nick}>{live.nick}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
