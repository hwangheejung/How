import React from 'react';
import Video from './Video';
import styles from '../../css/LivePage/Videos.module.css';

export default function Videos({ myMedia, myInfo, streams, nicknames }) {
  return (
    <div className={styles.videoContainer}>
      <div className={styles.video}>
        <video className={styles.v} playsInline ref={myMedia} autoPlay />
        <div className={styles.nickname}>{myInfo.nickname}</div>
      </div>
      {streams.map((streamInfo, index) => (
        <Video key={index} streamInfo={streamInfo} nicknames={nicknames} />
      ))}
    </div>
  );
}
