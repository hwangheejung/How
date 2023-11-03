import React from "react";
import { useState, useEffect } from "react";
import styles from "../../css/LiveList.module.css";
import { AiOutlineSearch, AiOutlinePlusSquare } from "react-icons/ai";
import { PiYoutubeLogoLight } from "react-icons/pi";
import axios from "axios";

export default function LiveList() {
  const [livedata, setLivedata] = useState([]); //live data가져오기
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);
  const [searchArray, setSearchArray] = useState([]); //live 검색 배열
  const [liveSearch, setliveSearch] = useState(""); //live 검색어

  const SearchValue = (event) => {
    setliveSearch(event.target.value);
    //console.log(event.target.value);
  };

  const onPopup = () => {
    //팝업 관리

    const url = `/makelive`;
    window.open(
      url,
      "window_name",
      "width=430,height=500,location=no,status=no,scrollbars=yes,top=200,left=100"
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

      const response = await axios.get("http://52.78.0.53/api/live");
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

      <div className={styles.liveicon}>
        <PiYoutubeLogoLight size="50" />
      </div>
      <div className={styles.Livearr}>
        {livedata.result?.liveListMappings.map((live) => (
          <button
            key={live.id}
            type="button"
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
