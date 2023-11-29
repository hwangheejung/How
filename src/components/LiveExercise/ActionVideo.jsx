import React from 'react';
import styles from '../../css/LivePage/ActionVideo.module.css';

export default function ActionVideo(props) {
  return (
    <div className={styles.actionVideo}>
      <video className={styles.video} controls width='250' muted>
        <source
          src={props.currentEx.ex.routinneDetailResult.img[0].img}
          type='video/mp4'
        />
      </video>
    </div>
  );
}
