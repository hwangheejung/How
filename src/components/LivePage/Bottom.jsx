import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faVideo,
  faMicrophoneSlash,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { IoMdExit } from 'react-icons/io';
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
            <FontAwesomeIcon icon={faMicrophone} />
          ) : (
            <FontAwesomeIcon icon={faMicrophoneSlash} />
          )}
        </button>
      </div>
      <div className={styles.exitbutton}>
        <button onClick={handleExit}>
          <IoMdExit />
        </button>
      </div>
      <div className={styles.camerabutton}>
        <button onClick={() => handleCamera()}>
          {cameraOn ? (
            <FontAwesomeIcon icon={faVideo} />
          ) : (
            <FontAwesomeIcon icon={faVideoSlash} />
          )}
        </button>
      </div>
    </div>
  );
}
