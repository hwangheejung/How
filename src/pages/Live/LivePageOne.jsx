import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useNavigate, useParams } from 'react-router-dom';
import Peer from 'peerjs';
import { useSelector } from 'react-redux';
import styles from '../../css/LivePage/LivePage.module.css';
import axios from 'axios';
import { getCookieToken } from '../../store/Cookie';
import LiveExStart from '../../components/LiveExercise/LiveExStart';
import LiveReadyTimer from '../../components/LiveExercise/LiveReadyTimer';
import LiveInfo from '../../components/LivePage/LiveInfo';
import Videos from '../../components/LivePage/Videos';
import AllRoutine from '../../components/LivePage/AllRoutine';
import Bottom from '../../components/LivePage/Bottom';

// server 연결
const client = Stomp.over(() => {
  return new SockJS('http://52.78.0.53:8080/live');
});

export default function LivePageOne() {
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
  // const [stopbutton, setStopbutton] = useState(true);

  const myMedia = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    // 내 카메라, 음성 정보
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyMediaStream(stream);
        myMedia.current.srcObject = stream;

        console.log('my stream', stream);

        stream.getAudioTracks().forEach((audio) => (audio.enabled = audioOn));

        stream.getVideoTracks().forEach((video) => (video.enabled = cameraOn));
      });

    let myPeerId;
    let myPeer;

    // 소켓 연결됐을 때
    client.connect(
      {},
      () => {
        client.subscribe('/room/participate/' + liveId, (data) => {
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
              console.log('offer');
            }
            if (call) {
              let id;
              call.on('stream', (stream) => {
                if (id !== stream.id) {
                  console.log('(offer)to check my peer id: ', myPeerId);
                  id = stream.id;
                  setStreams((prev) => [
                    ...prev,
                    { peerId: call.peer, stream: stream },
                  ]);
                  console.log(`received answer`);
                }
              });
              // 라이브 퇴장
              call.on('close', () => {});
            }

            client.send(
              '/app/participate/' + liveId,
              {},
              JSON.stringify({
                sdp: myPeerId,
                nick: myInfo.nickname + 'nick',
              })
            );
          } else if (nick === 'end') {
            // 라이브 종료
            if (myPeerId !== JSON.parse(data.body).sdp) {
              alert('라이브가 종료되었습니다!');
              myPeer.destroy();
              client.disconnect();
              navigate('/live/list');
            }
          } else {
            // 라이브 퇴장
            if (myPeerId !== JSON.parse(data.body).sdp) {
              if (nick.slice(-4, nick.length) === 'nick') {
                console.log('to check nick: ', nick);
                setNicknames((prev) => ({
                  ...prev,
                  [JSON.parse(data.body).sdp]: nick.slice(0, -4),
                }));
              } else {
                console.log('(exit)to check nick');
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
        peer.on('open', (peerId) => {
          myPeerId = peerId;
          setMyPeerId(peerId);
          client.send(
            '/app/participate/' + liveId,
            {},
            JSON.stringify({
              sdp: peerId,
            })
          );
        });

        // stream 통신
        peer.on('call', (call) => {
          call.answer(myMedia.current.srcObject);
          console.log('answer');
          console.log('(answer)to check my peer id: ', myPeerId);
          let id;
          call.on('stream', (stream) => {
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
          call.on('close', () => {});
        });

        //운동 동작 받아오기
        client.subscribe('/room/ex/' + liveId, (data) => {
          console.log('/room/ex', JSON.parse(data.body));
          setCurrentEx(JSON.parse(data.body));
        });

        client.subscribe('/room/leave/' + liveId, (data) => {
          if (JSON.parse(data.body).nick === 'need rest') {
            setFinish(!finish);
            setPlusset((prev) => prev + 1);
            console.log('LivePage need rest');
          } else if (JSON.parse(data.body).nick === 'no rest') {
            setPlusset((prev) => prev + 1);
            console.log('LivePage no rest');
          } else if (JSON.parse(data.body).nick === 'no rest set done') {
            getTimer();
            // clickGetTimer();
            setPlusset(1);
          }
          // else if (JSON.parse(data.body).nick === 'stop timer') {
          //   setStopbutton(false);
          //   clearInterval(timerId.current);
          // } else if (JSON.parse(data.body).nick === 'restart timer') {
          //   setStopbutton(true);
          //   timerId.current = setInterval(() => {
          //     setSeconds(time.current);
          //     time.current -= 1;
          //   }, 1000);
          // }
        });

        // console.log(currentEx.ex);
        // 전체 운동 루틴
        client.subscribe('/room/routine/' + liveId, (data) => {
          // console.log(JSON.parse(data.body));
          setRoutine(JSON.parse(data.body));
          //console.log(obj.name);
        });

        client.send(
          '/app/start/' + liveId,
          {},
          JSON.stringify({
            routineReq: 1,
          })
        );

        client.subscribe('/room/ready/' + liveId, (data) => {
          // console.log(JSON.parse(data.body).time);
          setReadyTimer(!readyTimer);
        });
      },
      () => {
        console.log('error occured');
      }
    );
    if (JSON.parse(isOwner)) {
      //라이브 owner라면 start 버튼 보여주기
      setIsownerbn(!isownerbtn);
    }
  }, []);

  console.log(myPeerId);
  console.log('nicknames', nicknames);

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
      axios.delete('http://52.78.0.53/api/lives/' + liveId).catch((e) => {
        console.log('에러', e);
      });
      client.send(
        '/app/participate/' + liveId,
        {},
        JSON.stringify({
          sdp: myPeerId,
          nick: 'end',
        })
      );
      alert('라이브가 종료되었습니다');
      myPeer.destroy();
      client.disconnect();
    } else {
      // 라이브 퇴장
      axios
        .delete('http://52.78.0.53/api/lives/participates/' + liveId, {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        })
        .then((res) => {
          client.send(
            '/app/participate/' + liveId,
            {},
            JSON.stringify({
              sdp: myPeerId,
              nick: myInfo.nickname,
            })
          );
        })
        .catch((e) => {
          console.log('에러', e);
        });
      myPeer.destroy();
      client.disconnect();
      alert('라이브에서 퇴장하셨습니다.');
    }
    navigate('/live/list');
  };

  const handleStart = () => {
    //운동 시작 후 ready timer 수행
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: 5,
      })
    );
    setIsownerbn(!isownerbtn); //start버튼 숨기기
  };

  const getReadyTimer = () => {
    setReadyTimer(!readyTimer); //ready timer 숨기기
    console.log('getReadyTimer');
    if (JSON.parse(isOwner)) {
      client.send(
        //첫번째 동작 보내기
        '/app/ex/' + liveId,
        {},
        JSON.stringify({
          readyEnd: 1,
        })
      );
    }
  };

  const getTimer = () => {
    if (JSON.parse(isOwner)) {
      client.send(
        '/app/ex/' + liveId,
        {},
        JSON.stringify({
          readyEnd: 1,
        })
      );
    }
  };

  // const clickGetTimer = () => {
  //   // if (JSON.parse(isOwner)) {
  //   client.send(
  //     '/app/ex/' + liveId,
  //     {},
  //     JSON.stringify({
  //       readyEnd: 1,
  //     })
  //   );
  //   // }
  // };

  const onRest = () => {
    // setPlusset(plusset + 1);
    // if (JSON.parse(isOwner)) {
    client.send(
      '/app/leave/' + liveId,
      {},
      JSON.stringify({
        nick: 'need rest',
      })
    );
    // }
    //complete버튼을 누르면 수행
    //부모 컴포넌트에 index 1 증가를 위해

    //setFinish(!finish);
  };

  const onNoRest = () => {
    // if (JSON.parse(isOwner)) {
    client.send(
      '/app/leave/' + liveId,
      {},
      JSON.stringify({
        nick: 'no rest',
      })
    );
    // }
  };

  const onNoRestSetDone = () => {
    // if (JSON.parse(isOwner)) {
    client.send(
      '/app/leave/' + liveId,
      {},
      JSON.stringify({
        nick: 'no rest set done',
      })
    );
    // }
  };

  // const stopTimer = () => {
  //   client.send(
  //     '/app/leave/' + liveId,
  //     {},
  //     JSON.stringify({
  //       nick: 'stop timer',
  //     })
  //   );
  // };

  // const restartTimer = () => {
  //   client.send(
  //     '/app/leave/' + liveId,
  //     {},
  //     JSON.stringify({
  //       nick: 'restart timer',
  //     })
  //   );
  // };

  // const [seconds, setSeconds] = useState(0);
  // const time = useRef(currentEx.ex.routinneDetailResult.time);
  // const timerId = useRef(null);

  // const forTimerOne = () => {
  //   time.current = currentEx.ex.routinneDetailResult.time;
  // };

  // const forTimerTwo = () => {
  //   timerId.current = setInterval(() => {
  //     setSeconds(time.current);
  //     time.current -= 1;
  //   }, 1000);

  //   return () => clearInterval(timerId.current);
  // };

  // const forTimerThree = () => {
  //   if (time.current <= 0) {
  //     clearInterval(timerId.current);
  //     setFinish(!finish);
  //     setPlusset((plusset) => plusset + 1);
  //   }
  // };

  console.log(currentEx);

  return (
    <div className={styles.root}>
      {/* 라이브 기본 정보 */}
      <LiveInfo liveTitle={liveTitle} participateNum={participateNum} />
      {/* 각 운동 동작 */}
      <div className={styles.middleContainer}>
        {/* 카메라 */}

        <div className={styles.videoAction}>
          <Videos
            myMedia={myMedia}
            myInfo={myInfo}
            streams={streams}
            nicknames={nicknames}
          />
          <div className={styles.currentActionBox}>
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
                  <LiveExStart
                    currentEx={currentEx}
                    getTimer={getTimer}
                    onRest={onRest}
                    onNoRest={onNoRest}
                    onNoRestSetDone={onNoRestSetDone}
                    finish={finish}
                    setFinish={setFinish}
                    plusset={plusset}
                    setPlusset={setPlusset}
                    // stopbutton={stopbutton}
                    // stopTimer={stopTimer}
                    // restartTimer={restartTimer}
                    // forTimerOne={forTimerOne}
                    // forTimerTwo={forTimerTwo}
                    // forTimerThree={forTimerThree}
                    // seconds={seconds}
                  />
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
        <AllRoutine routine={routine} />
      </div>
      <Bottom
        handleAudio={handleAudio}
        audioOn={audioOn}
        handleExit={handleExit}
        handleCamera={handleCamera}
        cameraOn={cameraOn}
      />
    </div>
  );
}
