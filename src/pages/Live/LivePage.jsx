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
import Video from "./Video";
import LiveTimer from "./LiveEx/LiveTimer";
import LiveExStart from "./LiveEx/LiveExStart";
import LiveReadyTimer from "./LiveEx/LiveReadyTimer";
import LiveRestTimer from "./LiveEx/LiveRestTimer";

// server 연결
const client = Stomp.over(() => {
  return new SockJS("http://52.78.0.53:8080/live");
});

export default function LivePage() {
  const { liveId, liveTitle, camera, audio, isOwner } = useParams();

  const myInfo = useSelector((state) => state.userInfo);

  const [myMediaStream, setMyMediaStream] = useState();
  const [audioOn, setAudioOn] = useState(JSON.parse(audio));
  const [cameraOn, setCameraOn] = useState(JSON.parse(camera));
  const [myPeerId, setMyPeerId] = useState();
  const [myPeer, setMyPeer] = useState();
  const [streams, setStreams] = useState([]);
  const [participateNum, setParticipateNum] = useState(0);
  const [nicknames, setNicknames] = useState({});
  const [routine, setRoutine] = useState();
  const [readyTimer, setReadyTimer] = useState(false); //시작 버튼 누르면 ready timer 실행
  const [isownerbtn, setIsownerbn] = useState(false); //owner에게만 start 버튼 실행
  const [currentEx, setCurrentEx] = useState();
  const [finish, setFinish] = useState(true); //쉬는시간이 끝남을 저장하는 상태
  const [plusset, setPlusset] = useState(1); //현재 set 관리

  const myMedia = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    // 내 카메라, 음성 정보
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyMediaStream(stream);
        myMedia.current.srcObject = stream;

        console.log("my stream", stream);

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
              let id;
              call.on("stream", (stream) => {
                if (id !== stream.id) {
                  console.log("(offer)to check my peer id: ", myPeerId);
                  id = stream.id;
                  setStreams((prev) => [
                    ...prev,
                    { peerId: call.peer, stream: stream },
                  ]);
                  console.log(`received answer`);
                }
              });
              // 라이브 퇴장
              call.on("close", () => {});
            }

            // 닉네임
            // client.send(
            //   '/app/nick/' + liveId,
            //   {},
            //   JSON.stringify({
            //     nickReq: 1,
            //   })
            // );
            client.send(
              "/app/participate/" + liveId,
              {},
              JSON.stringify({
                sdp: myPeerId,
                nick: myInfo.nickname + "nick",
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
              if (nick.slice(-4, nick.length) === "nick") {
                console.log("to check nick: ", nick);
                setNicknames((prev) => ({
                  ...prev,
                  [JSON.parse(data.body).sdp]: nick.slice(0, -4),
                }));
              } else {
                console.log("(exit)to check nick");
                setStreams((prev) =>
                  prev.filter(
                    (item) => item.peerId !== JSON.parse(data.body).sdp
                  )
                );
                setNicknames((prev) => {
                  const { [JSON.parse(data.body).sdp]: remove, ...rest } = prev;
                  console.log(remove);
                  console.log(rest);
                  return rest;
                });
                alert(`${nick}님이 퇴장하셨습니다.`);
              }
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
          console.log("(answer)to check my peer id: ", myPeerId);
          let id;
          call.on("stream", (stream) => {
            if (id !== stream.id) {
              id = stream.id;
              setStreams((prev) => [
                ...prev,
                { peerId: call.peer, stream: stream },
              ]);
              console.log(`received offer`);
            }
          });
          // 라이브 퇴장
          call.on("close", () => {});
        });

        //운동 동작 받아오기
        client.subscribe("/room/ex/" + liveId, (data) => {
          console.log(JSON.parse(data.body));
          setCurrentEx(JSON.parse(data.body));
        });

        //complete버튼 타이머 수행 임시
        client.subscribe("/room/leave/" + liveId, (data) => {
          setFinish(!finish);
          setPlusset((prev) => prev + 1);

          console.log("성공");
        });
        // console.log(currentEx.ex);
        // 전체 운동 루틴
        client.subscribe("/room/routine/" + liveId, (data) => {
          // console.log(JSON.parse(data.body));
          setRoutine(JSON.parse(data.body));
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

  console.log(myPeerId);
  console.log("nicknames", nicknames);

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

  //console.log(isOwner);

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
        .then((res) => {
          client.send(
            "/app/participate/" + liveId,
            {},
            JSON.stringify({
              sdp: myPeerId,
              nick: myInfo.nickname,
            })
          );
        })
        .catch((e) => {
          console.log("에러", e);
        });
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

  const handleTimer = () => {
    //횟수인경우 resttimer 동시에 띄우기
    client.send(
      "/app/leave/" + liveId,
      {},
      JSON.stringify({
        nick: "운동만 하는 사람",
      })
    );
    // setFinish(!finish);
    setPlusset(plusset + 1);
  };
  //console.log(nicknames);

  //   client.send(
  //     '/app/ready/' + liveId,
  //     {},
  //     JSON.stringify({
  //       time: 5,
  //     })
  //   );
  //   setIsownerbn(!isownerbtn); //start버튼 숨기기
  // };

  const getReadyTimer = () => {
    setReadyTimer(!readyTimer); //ready timer 숨기기
    client.send(
      //첫번째 동작 보내기
      "/app/ex/" + liveId,
      {},
      JSON.stringify({
        readyEnd: 1,
      })
    );
  };

  const getTimer = () => {
    client.send(
      "/app/ex/" + liveId,
      {},
      JSON.stringify({
        readyEnd: 1,
      })
    );
  };
  //console.log(currentEx);
  const currentcount = currentEx?.ex.count;
  const currenttime = currentEx?.ex.time;
  const currentrest = currentEx?.ex.rest;
  const currenttype = currentEx?.ex.type;
  const currentname = currentEx?.ex.ex.name;
  const currentdesc = currentEx?.ex.ex.desc;
  const currentexerciseset = currentEx?.ex.set;
  const timerEnd = () => {
    setFinish(!finish);
    setPlusset(plusset + 1);
  };
  const onClick = () => {
    // setPlusset(plusset + 1);
    client.send(
      "/app/leave/" + liveId,
      {},
      JSON.stringify({
        nick: "운동만 하는 사람",
      })
    );
    //complete버튼을 누르면 수행
    //부모 컴포넌트에 index 1 증가를 위해

    //setFinish(!finish);
  };

  const getrestfinish = () => {
    console.log(plusset);
    setFinish(!finish);
    if (plusset === currentexerciseset + 1) {
      getTimer();
      //console.log("성공");
      setPlusset(1);
    }
    //쉬는 시간이 끝나 상태 변화
  };
  return (
    <div>
      <div className={styles.liveTitle}>
        <img
          src="/live.png"
          alt="live icon"
          style={{ width: "50px", height: "50px" }}
        />
        <span>{liveTitle}</span>
      </div>
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
        {streams.map((streamInfo, index) => (
          <Video key={index} streamInfo={streamInfo} nicknames={nicknames} />
        ))}
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
          {readyTimer ? ( //준비 타이머
            <LiveReadyTimer getReadyTimer={getReadyTimer} time={5} />
          ) : (
            <div></div> //준비타이머 한번 나타나면 아무것도 나타나지 않음
          )}
        </div>
        <div>
          {currentEx ? (
            <div>
              <div>
                <div>{currentname}</div>
                <div>{currentdesc}</div>
              </div>
              <div>
                {currenttype ? (
                  <div>
                    {finish ? (
                      <div className={styles.ReadyTimer}>
                        <div>Timer</div>
                        <LiveTimer time={currenttime} getTimer={timerEnd} />
                        <div>
                          {plusset}/{currentexerciseset}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.ReadyTimer}>
                        Rest Timer
                        <LiveRestTimer
                          time={currentrest}
                          getTimer={getrestfinish}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {finish ? (
                      <div className={styles.ReadyTimer}>
                        <div>
                          {plusset}/{currentexerciseset}
                        </div>
                        <div>{currentcount}개 </div>
                        <button className={styles.button} onClick={onClick}>
                          complete
                        </button>
                      </div>
                    ) : (
                      <div className={styles.ReadyTimer}>
                        Rest Timer
                        <LiveRestTimer
                          time={currentrest}
                          getTimer={getrestfinish}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* <LiveExStart
                currentEx={currentEx}
                getTimer={getTimer}
                handleTimer={handleTimer}
              /> */}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
