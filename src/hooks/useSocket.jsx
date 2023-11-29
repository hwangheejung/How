import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getCookieToken } from '../store/Cookie';

const client = Stomp.over(() => {
  return new SockJS('https://52.78.0.53.sslip.io/live');
});

export default function useSocket({ liveId, camera, audio, isOwner }) {
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
  const [readyTimer, setReadyTimer] = useState(false);
  const [isownerbtn, setIsownerbn] = useState(false);
  const [isParticipate, setIsParticipate] = useState(false);
  const [currentEx, setCurrentEx] = useState();
  const [finish, setFinish] = useState(true);
  const [plusset, setPlusset] = useState(1);
  // 라이브 루틴 수정 시 필요한 상태값들
  const [isModify, setIsModify] = useState(false);
  const [modifyActionId, setModifyActionId] = useState();
  const [isDecrease, setIsDecrease] = useState(false);
  const [isIncrease, setIsIncrease] = useState(false);
  const [isModifySend, setIsModifySend] = useState(false);

  const [exFinish, setExFinish] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [stopbutton, setStopbutton] = useState(false);

  const myMedia = useRef();

  const navigate = useNavigate();

  useEffect(() => {
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

    client.connect(
      {},
      () => {
        client.subscribe('/room/participate/' + liveId, (data) => {
          setParticipateNum(JSON.parse(data.body).participate);
          let nick = JSON.parse(data.body).nick;
          if (nick === undefined) {
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
            if (myPeerId !== JSON.parse(data.body).sdp) {
              alert('라이브가 종료되었습니다!');
              myPeer.destroy();
              client.disconnect();
              // navigate('/live/list');
              window.location.replace('/live/list');
            }
          } else {
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
          // console.log('/room/ex', JSON.parse(data.body));
          // console.log(
          //   'order',
          //   JSON.parse(data.body).ex.routinneDetailResult.order
          // );
          console.log('current ex');
          setCurrentEx(JSON.parse(data.body));
          // if (!exFinish) {
          // }
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

        // 전체 운동 루틴
        client.subscribe('/room/routine/' + liveId, (data) => {
          console.log('새로운 루틴: ', JSON.parse(data.body));
          setRoutine(JSON.parse(data.body));
        });

        client.send(
          '/app/start/' + liveId,
          {},
          JSON.stringify({
            routineReq: 1,
          })
        );

        client.subscribe('/room/ready/' + liveId, (data) => {
          let massage = JSON.parse(data.body).time;
          if (massage === 5) {
            setReadyTimer(!readyTimer);
            setIsParticipate(false);
          } else if (massage.slice(0, 10) === 'set modify') {
            setIsModifySend(false);
            setIsModify(true);
            setModifyActionId(parseInt(massage.slice(11, massage.length)));
          } else if (massage === 'modify complete') {
            // console.log('modify complete');
            // setIsModify(false);
            setIsModifySend(true);
          } else if (massage === 'modify decrease') {
            setIsDecrease((prev) => !prev);
          } else if (massage === 'modify increase') {
            setIsIncrease((prev) => !prev);
          } else if (massage === 'stop timer') {
            setStopbutton(false);
          } else if (massage === 'reset timer') {
            setStopbutton(true);
          } else if (massage === 'routine finish') {
            setExFinish(true);
            // console.log('routine finish isOwner: ', isOwner);
            // console.log('routine finish routine: ', routine);
            // if (isOwner) {
            //   axios
            //     .get(
            //       `https://52.78.0.53.sslip.io/api/ex-routines/${routine.routId}/me`,
            //       {},
            //       {
            //         headers: { Authorization: `Bearer ${getCookieToken()}` },
            //       }
            //     )
            //     .then((res) => {

            //     });
            // }
          }
        });

        // client.subscribe('/room/ready/' + liveId, (data) => {});
      },
      () => {
        console.log('error occured');
      }
    );
    if (JSON.parse(isOwner)) {
      //라이브 owner라면 start 버튼 보여주기
      setIsownerbn(!isownerbtn);
      setShowBtn(true);
    } else {
      setIsParticipate(true);
      setShowBtn(false);
    }
  }, []);

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

  const handleExit = () => {
    // 라이브 종료
    if (JSON.parse(isOwner)) {
      axios
        .delete('https://52.78.0.53.sslip.io/api/lives/' + liveId)
        .catch((e) => {
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
      // 라이브 퇴장e
      axios
        .delete(
          'https://52.78.0.53.sslip.io/api/lives/participates/' + liveId,
          {
            headers: { Authorization: `Bearer ${getCookieToken()}` },
          }
        )
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
    // navigate('/live/list');
    window.location.replace('/live/list');
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

  const onRest = () => {
    client.send(
      '/app/leave/' + liveId,
      {},
      JSON.stringify({
        nick: 'need rest',
      })
    );
  };

  const onNoRest = () => {
    client.send(
      '/app/leave/' + liveId,
      {},
      JSON.stringify({
        nick: 'no rest',
      })
    );
  };

  const onNoRestSetDone = () => {
    client.send(
      '/app/leave/' + liveId,
      {},
      JSON.stringify({
        nick: 'no rest set done',
      })
    );
  };

  // 라이브 루틴 수정 시 필요한 소켓 통신 함수
  const socketSetModify = (RoutineActionId) => {
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: `set modify ${RoutineActionId}`,
      })
    );
  };

  const socketModifyComplete = () => {
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: `modify complete`,
      })
    );
  };

  const socketDecrease = () => {
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: `modify decrease`,
      })
    );
  };

  const socketIncrease = () => {
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: `modify increase`,
      })
    );
  };

  const socketRoutineChange = (liveRoutine) => {
    client.send(
      '/app/routine/' + liveId,
      {},
      JSON.stringify({
        actionCnt: liveRoutine.actionCnt,
        cate: liveRoutine.cate,
        hits: liveRoutine.hits,
        name: liveRoutine.name,
        routId: liveRoutine.routId,
        routineDetails: liveRoutine.routineDetails,
      })
    );
  };

  const socketTimerStop = () => {
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: `stop timer`,
      })
    );
  };

  const socketTimerReset = () => {
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: `reset timer`,
      })
    );
  };

  const socketRoutineFinish = () => {
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: `routine finish`,
      })
    );
  };

  return [
    participateNum,
    myMedia,
    myInfo,
    streams,
    nicknames,
    isownerbtn,
    handleStart,
    readyTimer,
    getReadyTimer,
    currentEx,
    getTimer,
    onRest,
    onNoRest,
    onNoRestSetDone,
    finish,
    setFinish,
    plusset,
    setPlusset,
    routine,
    handleAudio,
    audioOn,
    handleExit,
    handleCamera,
    cameraOn,
    isModify,
    setIsModify,
    socketSetModify,
    modifyActionId,
    socketModifyComplete,
    socketDecrease,
    isDecrease,
    socketIncrease,
    isIncrease,
    isModifySend,
    setIsModifySend,
    socketRoutineChange,
    exFinish,
    isParticipate,
    showBtn,
    stopbutton,
    socketTimerStop,
    socketTimerReset,
    socketRoutineFinish,
  ];
}
