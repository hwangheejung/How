import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../css/Live/LiveList.module.css';

const LiveSearch = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/live/list');
  };

  const onPopupdetail = (id) => {
    const width = 500;
    const height = 700;
    const x = window.outerWidth / 2 - width / 2;
    const y = window.outerHeight / 2 - height / 2;

    const url = `/livedetail/${id}`;
    window.open(
      url,
      'window_name',
      `width=${width},height=${height},location=no,status=no,scrollbars=yes,top=${y},left=${x}`
    );
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
            onClick={() => onPopupdetail(live.id)}
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
    </div>
  );
};

export default LiveSearch;
