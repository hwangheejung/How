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
import axios from "axios";
import { getCookieToken } from "../../store/Cookie";

export default function LiveSetting(props) {
  const [camera, setCamera] = useState(true);
  const [audio, setAudio] = useState(true);

  // const { liveId } = useParams();

  const navigate = useNavigate();

  const handleCamera = () => {
    setCamera((prev) => !prev);
  };

  const handleAudio = () => {
    setAudio((prev) => !prev);
  };

  const handleCancel = () => {
    props.setIsParticipateSetting(false);
    navigate("/live/list");
  };

  const handleEnter = () => {
    // window.location.href = `/live/realtime/${liveId}`;
    // window.close();
    axios
      .post(
        `http://52.78.0.53.sslip.io:8080/api/lives/participates`,
        {
          liveId: props.roomId,
        },
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      )
      .then((res) => {
        console.log(res.data);
        navigate(
          `/live/realtime/${res.data.result.roomId}/${
            res.data.result.subject
          }/${camera}/${audio}/${false}`
        );
      }); // ✅
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
