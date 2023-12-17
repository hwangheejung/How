import React, { useState } from 'react';
import { PiVideoCameraLight, PiVideoCameraSlash } from 'react-icons/pi';
import { BiSolidMicrophoneOff, BiSolidMicrophone } from 'react-icons/bi';
import styles from '../../css/Live/LiveSetting.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookieToken } from '../../store/Cookie';

export default function LiveSetting(props) {
  const [camera, setCamera] = useState(true);
  const [audio, setAudio] = useState(true);

  const navigate = useNavigate();

  const handleCamera = () => {
    setCamera((prev) => !prev);
  };

  const handleAudio = () => {
    setAudio((prev) => !prev);
  };

  const handleCancel = () => {
    props.setIsParticipateSetting(false);
    navigate('/live/list');
  };

  const handleEnter = () => {
    axios
      .post(
        `https://52.78.0.53.sslip.io/api/lives/participates`,
        {
          liveId: props.roomId,
        },
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      )
      .then((res) => {
        navigate(
          `/live/realtime/${res.data.result.roomId}/${
            res.data.result.subject
          }/${camera}/${audio}/${false}`
        );
      });
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
        <button className={styles.enterButton} onClick={handleEnter}>
          참여
        </button>
        <button className={styles.enterButton} onClick={handleCancel}>
          취소
        </button>
      </div>
    </div>
  );
}
