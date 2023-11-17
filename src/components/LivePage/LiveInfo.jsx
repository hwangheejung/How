import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import styles from '../../css/LivePage/LiveInfo.module.css';

export default function LiveInfo({ liveTitle, participateNum }) {
  return (
    <div className={styles.header}>
      <img
        className={styles.livelogo}
        src='/live.png'
        alt='live icon'
        style={{ width: '50px', height: '50px' }}
      />
      <span className={styles.liveTitle}> {liveTitle}</span>
      <div className={styles.participateNum}>
        <FontAwesomeIcon icon={faUsers} />
        <span>{participateNum}</span>
      </div>
    </div>
  );
}
