import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophoneLines,
  faMicrophoneLinesSlash,
} from "@fortawesome/free-solid-svg-icons";
import { PiVideoCameraLight, PiVideoCameraSlash } from "react-icons/pi";
import { BiSolidMicrophoneOff, BiSolidMicrophone } from "react-icons/bi";
import styles from "../../css/Live/LiveSetting.module.css";
import { useNavigate, useParams } from "react-router-dom";

export default function OwnerLiveSetting(props) {
  const [camera, setCamera] = useState(true);
  const [audio, setAudio] = useState(true);

  // const { liveId, liveTitle } = useParams();

  const navigate = useNavigate();

  const handleCamera = () => {
    setCamera((prev) => !prev);
  };

  const handleAudio = () => {
    setAudio((prev) => !prev);
  };

  const handleEnter = (liveId) => {
    props.setIsOwnerSetting(false);
    // window.location.href = `/live/realtime/${liveId}`;
    // window.close();
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
            // <FontAwesomeIcon
            //   icon={faVideo}
            //   size='2x'
            //   className={styles.cameraIcon}
            // />
            <PiVideoCameraLight className={styles.cameraIcon} />
          ) : (
            // <FontAwesomeIcon
            //   icon={faVideoSlash}
            //   size='2x'
            //   className={styles.cameraIcon}
            // />
            <PiVideoCameraSlash className={styles.cameraIcon} />
          )}
          <span>카메라 on/off</span>
        </div>
        <div className={styles.audioContainer} onClick={handleAudio}>
          {audio ? (
            // <FontAwesomeIcon
            //   icon={faMicrophoneLines}
            //   size='2x'
            //   className={styles.audioIcon}
            // />
            <BiSolidMicrophone className={styles.audioIcon} />
          ) : (
            // <FontAwesomeIcon
            //   icon={faMicrophoneLinesSlash}
            //   size='2x'
            //   className={styles.audioIcon}
            // />
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
