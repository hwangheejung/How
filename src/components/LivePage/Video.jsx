import React, { useEffect, useRef } from 'react';
import styles from '../../css/LivePage/Videos.module.css';

export default function Video({ streamInfo, nicknames }) {
  const { peerId, stream } = streamInfo;

  const streamRef = useRef();

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.srcObject = stream;
    }
  }, [stream, streamRef]);

  return (
    <div className={styles.video}>
      <video className={styles.v} playsInline ref={streamRef} autoPlay />
      <div className={styles.nickname}>{nicknames[peerId]}</div>
    </div>
  );
}
