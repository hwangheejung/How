import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../css/Live/LiveList.module.css';
import LiveDetail from './LiveDetail';

const LiveSearch = () => {
  const [isLiveDetail, setIsLiveDetail] = useState(false);
  const [live, setLive] = useState({
    rotuineId: '',
    liveId: '',
    livesubject: '',
    livenick: '',
  });
  const [roomId, setRoomId] = useState('');
  const [isParticipateSetting, setIsParticipateSetting] = useState(false);

  const navigate = useNavigate();

  const onClick = () => {
    navigate('/live/list');
  };

  const onPopupdetail = (routineId, liveId, livesubject, livenick) => {
    setIsLiveDetail((prev) => !prev);
    setLive({ routineId, liveId, livesubject, livenick });
  };

  const onLiveDetailClose = () => {
    setIsLiveDetail((prev) => !prev);
  };

  let location = useLocation();
  const SearchArray = location.state.sArray;
  return (
    <div className={styles.header}>
      <div className={styles.titleplus}>
        <div className={styles.Live}>Search</div>
      </div>
      <hr />

      <div className={styles.Livearr}>
        {SearchArray.map((live) => (
          <button
            key={live.id}
            type='button'
            className={styles.LiveClick}
            onClick={() =>
              onPopupdetail(live.routineId, live.id, live.subject, live.nick)
            }
          >
            <div className={styles.LiveListItem}>
              <div className={styles.subject}>{live.subject}</div>
              <div className={styles.nick}>{live.nick}</div>
            </div>
          </button>
        ))}
      </div>
      <button className={styles.backbutton} onClick={onClick}>
        뒤로가기
      </button>
      {isLiveDetail ? (
        <LiveDetail
          onLiveDetailClose={onLiveDetailClose}
          live={live}
          setIsParticipateSetting={setIsParticipateSetting}
          setRoomId={setRoomId}
        />
      ) : null}
    </div>
  );
};

export default LiveSearch;
