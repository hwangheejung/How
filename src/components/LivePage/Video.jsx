import React, { useEffect, useRef } from 'react';
import styles from '../../css/LivePage/Videos.module.css';

export default function Video({ streamInfo, nicknames }) {
  const { peerId, stream } = streamInfo;

  const streamRef = useRef();

  // console.log('nicknames peerId check: ', nicknames);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.srcObject = stream;
    }
  }, [stream, streamRef]);

  return (
    // <div className={styles.videoInfo}>
    <div className={styles.video}>
      <video
        className={styles.v}
        playsInline
        ref={streamRef}
        autoPlay
        // style={{ width: '400px', height: '400px' }}
      />
      {/* <div className={styles.nickname}>{nicknames[peerId]}</div> */}
    </div>
    /* <div className={styles.nickname}>{nicknames[peerId]}</div> */
    // </div>
  );
}
