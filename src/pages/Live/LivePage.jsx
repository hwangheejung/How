import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faMicrophoneSlash,
  faVideoSlash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import styles from "../../css/LivePage.module.css";
import axios from "axios";
import { getCookieToken } from "../../store/Cookie";
import LiveReadyTimer from "./LiveReadyTimer";
// server 연결
const client = Stomp.over(() => {
  return new SockJS("http://52.78.0.53:8080/live");
});

export default function LivePage() {
  const { liveId, camera, audio, isOwner } = useParams();

  const myInfo = useSelector((state) => state.userInfo);

  const [myMediaStream, setMyMediaStream] = useState();
  const [audioOn, setAudioOn] = useState(JSON.parse(audio));
  const [cameraOn, setCameraOn] = useState(JSON.parse(camera));
  const [myPeerId, setMyPeerId] = useState();
  const [myPeer, setMyPeer] = useState();
  // const [peers, setPeers] = useState([]);
  const [otherNickname, setOtherNickname] = useState("");
  const [nicknames, setNicknames] = useState([]);
  const [routine, setRoutine] = useState();
  const [participateNum, setParticipateNum] = useState(0);
  const [readyTimer, setReadyTimer] = useState(false); //시작 버튼 누르면 ready timer 실행
  const [isownerbtn, setIsownerbn] = useState(false); //owner에게만 start 버튼 실행

  const myMedia = useRef();
  const otherMedia = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    // 내 카메라, 음성 정보
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyMediaStream(stream);
        myMedia.current.srcObject = stream;

        stream.getAudioTracks().forEach((audio) => (audio.enabled = audioOn));

        stream.getVideoTracks().forEach((video) => (video.enabled = cameraOn));
      });

    let myPeerId;
    let myPeer;

    // 소켓 연결됐을 때
    client.connect(
      {},
      () => {
        client.subscribe("/room/participate/" + liveId, (data) => {
          setParticipateNum(JSON.parse(data.body).participate);
          let nick = JSON.parse(data.body).nick;
          if (nick === undefined) {
            // stream 통신
            let call;
            if (myPeerId !== JSON.parse(data.body).sdp) {
              call = peer.call(
                JSON.parse(data.body).sdp,
                myMedia.current.srcObject
              );
              console.log("offer");
            }
            if (call) {
              call.on("stream", (stream) => {
                if (otherMedia.current) {
                  otherMedia.current.srcObject = stream;
                  console.log(`received answer`);
                }
              });
              // 라이브 퇴장
              call.on("close", () => {
                otherMedia.current.srcObject = null;
                console.log("someone leaved");
              });
            }

            // 닉네임
            client.send(
              "/app/nick/" + liveId,
              {},
              JSON.stringify({
                nickReq: 1,
              })
            );
          } else if (nick === "end") {
            // 라이브 종료
            if (myPeerId !== JSON.parse(data.body).sdp) {
              alert("라이브가 종료되었습니다!");
              myPeer.destroy();
              client.disconnect();
              navigate("/live/list");
            }
          } else {
            // 라이브 퇴장
            if (myPeerId !== JSON.parse(data.body).sdp) {
              alert(`${nick}님이 퇴장하셨습니다.`);
              // console.log(data.body);
            }
          }
        });

        // stream 통신
        const peer = new Peer();
        myPeer = peer;
        setMyPeer(peer);
        peer.on("open", (peerId) => {
          myPeerId = peerId;
          setMyPeerId(peerId);
          client.send(
            "/app/participate/" + liveId,
            {},
            JSON.stringify({
              sdp: peerId,
            })
          );
        });

        // stream 통신
        peer.on("call", (call) => {
          call.answer(myMedia.current.srcObject);
          console.log("answer");
          call.on("stream", (stream) => {
            if (otherMedia.current) {
              otherMedia.current.srcObject = stream;
              console.log(`received offer`);
            }
          });
          // 라이브 퇴장
          call.on("close", () => {
            otherMedia.current.srcObject = null;
            console.log("someone leaved");
          });
        });

        // 닉네임
        client.subscribe("/room/nick/" + liveId, (data) => {
          // console.log(JSON.parse(data.body));
          setNicknames(JSON.parse(data.body));
        });
        //운동 동작 받아오기
        client.subscribe("/room/ex/" + liveId, (data) => {
          // console.log(JSON.parse(data.body));
          setNicknames(JSON.parse(data.body));
        });

        // 전체 운동 루틴
        client.subscribe("/room/routine/" + liveId, (data) => {
          // console.log(JSON.parse(data.body));
          setRoutine(JSON.parse(data.body));
          //console.log(obj.name);
        });

        client.send(
          "/app/start/" + liveId,
          {},
          JSON.stringify({
            routineReq: 1,
          })
        );
        client.subscribe("/room/ready/" + liveId, (data) => {
          // console.log(JSON.parse(data.body).time);
          setReadyTimer(!readyTimer);
        });
      },
      () => {
        console.log("error occured");
      }
    );
    if (JSON.parse(isOwner)) {
      //라이브 owner라면 start 버튼 보여주기
      setIsownerbn(!isownerbtn);
    }
    // client.subscribe("/room/ex/" + liveId, (data) => {
    //   console.log(JSON.parse(data.body));
    // });
  }, []);

  //console.log(readyTimer);
  // 카메라, 음성 설정
  const handleAudio = () => {
    myMediaStream
      .getAudioTracks()
      .forEach((audio) => (audio.enabled = !audio.enabled));
    audioOn ? setAudioOn(false) : setAudioOn(true);
  };
  const handleCamera = () => {
    myMediaStream
      .getVideoTracks()
      .forEach((video) => (video.enabled = !video.enabled));
    cameraOn ? setCameraOn(false) : setCameraOn(true);
  };

  console.log(isOwner);

  const handleExit = () => {
    // 라이브 종료
    if (JSON.parse(isOwner)) {
      axios.delete("http://52.78.0.53/api/lives/" + liveId).catch((e) => {
        console.log("에러", e);
      });
      client.send(
        "/app/participate/" + liveId,
        {},
        JSON.stringify({
          sdp: myPeerId,
          nick: "end",
        })
      );
      alert("라이브가 종료되었습니다");
      myPeer.destroy();
      client.disconnect();
    } else {
      // 라이브 퇴장
      axios
        .delete("http://52.78.0.53/api/lives/participates/" + liveId, {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        })
        .catch((e) => {
          console.log("에러", e);
        });
      client.send(
        "/app/participate/" + liveId,
        {},
        JSON.stringify({
          sdp: myPeerId,
          nick: myInfo.nickname,
        })
      );
      myPeer.destroy();
      client.disconnect();
      alert("라이브에서 퇴장하셨습니다.");
    }
    navigate("/live/list");
  };

  const handleStart = () => {
    //운동 시작 후 ready timer 수행

    client.send(
      "/app/ready/" + liveId,
      {},
      JSON.stringify({
        time: 5,
      })
    );
    setIsownerbn(!isownerbtn); //start버튼 숨기기
  };
  console.log(nicknames);

  //console.log("owner" + isownerbtn);

  const getReadyTimer = () => {
    setReadyTimer(!readyTimer);
    client.send(
      "/app/ex/" + liveId,
      {},
      JSON.stringify({
        readyEnd: 1,
      })
    );
  };
  return (
    <div>
      <img
        src="/live.png"
        alt="live icon"
        style={{ width: "50px", height: "50px" }}
      />
      <div className={styles.participateNum}>
        <FontAwesomeIcon icon={faUsers} />
        <span>{participateNum}</span>
      </div>
      <div className={styles.left}>
        <div>
          <video
            playsInline
            ref={myMedia}
            autoPlay
            style={{ width: "400px", height: "400px" }}
          />
          <div>{myInfo.nickname}</div>
        </div>
        <button onClick={() => handleAudio()}>
          {audioOn ? (
            <FontAwesomeIcon icon={faMicrophone} />
          ) : (
            <FontAwesomeIcon icon={faMicrophoneSlash} />
          )}
        </button>
        <button onClick={() => handleCamera()}>
          {cameraOn ? (
            <FontAwesomeIcon icon={faVideo} />
          ) : (
            <FontAwesomeIcon icon={faVideoSlash} />
          )}
        </button>
        <div>
          <video
            playsInline
            ref={otherMedia}
            autoPlay
            style={{ width: "400px", height: "400px" }}
          />
          {/* <div>{nicknames[1] ? nicknames[1].nick : ''}</div> */}
        </div>

        <button onClick={handleExit}>나가기</button>
      </div>
      <div className={styles.right}>
        <div>{routine?.name}</div>
        <div className={styles.cates}>
          {routine?.cate.map((item, index) => (
            <span key={index} className={styles.actionCate}>
              #{item}
            </span>
          ))}
        </div>
        <div>
          {routine?.routineDetails?.map((detail) =>
            detail.type ? (
              <div key={detail.ex.id} className={styles.timer}>
                <span className={styles.detailname}> {detail.ex?.name}</span>
                <span> {detail.time}s</span>
                <div>
                  <span>rest</span>
                  <span> {detail.rest}s</span>
                </div>
                <div>
                  <span>{detail.set} set</span>
                </div>
              </div>
            ) : (
              <div key={detail.ex.id} className={styles.timer}>
                <span className={styles.detailname}> {detail.ex?.name}</span>
                <span>{detail.count}개</span>
                <div>
                  <span>rest</span>
                  <span> {detail.rest}s</span>
                </div>
                <div>
                  <span>{detail.set} set</span>
                </div>
              </div>
            )
          )}
        </div>
        <div>
          {isownerbtn ? (
            <button onClick={handleStart}>START </button>
          ) : (
            <div></div>
          )}
        </div>

        <div>
          {readyTimer ? (
            <LiveReadyTimer getReadyTimer={getReadyTimer} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
