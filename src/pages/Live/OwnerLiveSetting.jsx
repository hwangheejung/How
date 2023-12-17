import React, { useState } from 'react';
import { PiVideoCameraLight, PiVideoCameraSlash } from 'react-icons/pi';
import { BiSolidMicrophoneOff, BiSolidMicrophone } from 'react-icons/bi';
import styles from '../../css/Live/LiveSetting.module.css';
import { useNavigate } from 'react-router-dom';

export default function OwnerLiveSetting(props) {
  const [camera, setCamera] = useState(true);
  const [audio, setAudio] = useState(true);

  const navigate = useNavigate();

  const handleCamera = () => {
    setCamera((prev) => !prev);
  };

  const handleAudio = () => {
    setAudio((prev) => !prev);
  };

  const handleEnter = (liveId) => {
    props.setIsOwnerSetting(false);
    navigate(
      `/live/realtime/${props.roomId}/${
        props.subject
      }/${camera}/${audio}/${true}`
    );
  };

  return (
    <div className={styles.cameraAudioModal}>
      <div className={styles.container}>
        <div className={styles.videoContainer} onClick={handleCamera}>
          {camera ? (
            <PiVideoCameraLight className={styles.cameraIcon} />
          ) : (
            <PiVideoCameraSlash className={styles.cameraIcon} />
          )}
          <span>카메라 on/off</span>
        </div>
        <div className={styles.audioContainer} onClick={handleAudio}>
          {audio ? (
            <BiSolidMicrophone className={styles.audioIcon} />
          ) : (
            <BiSolidMicrophoneOff className={styles.audioIcon} />
          )}
          <span>마이크 on/off</span>
        </div>
        <div className={styles.buttonblock}>
          <button className={styles.enterButton} onClick={handleEnter}>
            참여
          </button>
        </div>
      </div>
    </div>
  );
}
