import React from 'react';
import styles from '../../css/LivePage/ActionVideo.module.css';
export default function OwnActionVideo(props) {
  return (
    <div className={styles.actionVideo}>
      <video className={styles.video} width='250' controls muted autoPlay>
        <source src={props.currentexvideo} type='video/mp4' />
      </video>
    </div>
  );
}
