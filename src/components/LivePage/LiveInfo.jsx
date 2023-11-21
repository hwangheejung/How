import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import styles from '../../css/LivePage/LiveInfo.module.css';

export default function LiveInfo({ liveTitle, participateNum }) {
  return (
    <div className={styles.header}>
      <div className={styles.liveTitle}> {liveTitle}</div>
      <div className={styles.colorBox}>
        <span className={styles.liveText}>live</span>
        <span className={styles.participateNum}>{participateNum}/6</span>
      </div>
    </div>
  );
}
