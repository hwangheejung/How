import React from 'react';
import styles from '../../css/LivePage/LiveInfo.module.css';
import { BiMenuAltRight } from 'react-icons/bi';

export default function LiveInfo({
  liveTitle,
  participateNum,
  setOpenAllRoutine,
}) {
  return (
    <div className={styles.header}>
      <div className={styles.liveTitle}> {liveTitle}</div>
      <div className={styles.colorBox}>
        <span className={styles.liveText}>live</span>
        <span className={styles.participateNum}>{participateNum}/6</span>
      </div>
      <button
        className={styles.menuButton}
        onClick={() => setOpenAllRoutine((prev) => !prev)}
      >
        <BiMenuAltRight className={styles.menuIcon} />
      </button>
    </div>
  );
}
