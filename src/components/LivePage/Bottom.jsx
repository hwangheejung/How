import React from 'react';
import { PiVideoCameraLight, PiVideoCameraSlash } from 'react-icons/pi';
import { BiSolidMicrophoneOff, BiSolidMicrophone } from 'react-icons/bi';
import { MdCallEnd } from 'react-icons/md';
import styles from '../../css/LivePage/Bottom.module.css';

export default function Bottom({
  handleAudio,
  audioOn,
  handleExit,
  handleCamera,
  cameraOn,
}) {
  return (
    <div className={styles.bottom}>
      <div className={styles.audiobutton}>
        <button onClick={() => handleAudio()}>
          {audioOn ? (
            <BiSolidMicrophone className={styles.icon} />
          ) : (
            <BiSolidMicrophoneOff className={styles.icon} />
          )}
        </button>
      </div>
      <div className={styles.exitbutton}>
        <button onClick={handleExit}>
          <MdCallEnd className={styles.exitIcon} />
        </button>
      </div>
      <div className={styles.camerabutton}>
        <button onClick={() => handleCamera()}>
          {cameraOn ? (
            <PiVideoCameraLight className={styles.icon} />
          ) : (
            <PiVideoCameraSlash className={styles.icon} />
          )}
        </button>
      </div>
    </div>
  );
}
