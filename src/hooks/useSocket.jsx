import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
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

  const [isModify, setIsModify] = useState(false);
  const [modifyActionId, setModifyActionId] = useState();
  const [isDecrease, setIsDecrease] = useState(false);
  const [isIncrease, setIsIncrease] = useState(false);
  const [isModifySend, setIsModifySend] = useState(false);

  const [exFinish, setExFinish] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [stopbutton, setStopbutton] = useState(false);

  const myMedia = useRef();

  useEffect(() => {
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
            }
            if (call) {
              let id;

              call.on('stream', (stream) => {
                if (id !== stream.id) {
                  id = stream.id;
                  setStreams((prev) => [
                    ...prev,
                    { peerId: call.peer, stream: stream },
                  ]);
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
              window.location.replace('/live/list');
            }
          } else {
            if (myPeerId !== JSON.parse(data.body).sdp) {
              if (nick.slice(-4, nick.length) === 'nick') {
                setNicknames((prev) => ({
                  ...prev,
                  [JSON.parse(data.body).sdp]: nick.slice(0, -4),
                }));
              } else {
                setStreams((prev) =>
                  prev.filter(
                    (item) => item.peerId !== JSON.parse(data.body).sdp
                  )
                );
                setNicknames((prev) => {
                  const { [JSON.parse(data.body).sdp]: remove, ...rest } = prev;
                  return rest;
                });
              }
            }
          }
        });

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

        peer.on('call', (call) => {
          call.answer(myMedia.current.srcObject);
          let id;
          call.on('stream', (stream) => {
            if (id !== stream.id) {
              id = stream.id;
              setStreams((prev) => [
                ...prev,
                { peerId: call.peer, stream: stream },
              ]);
            }
          });
          call.on('close', () => {});
        });

        client.subscribe('/room/ex/' + liveId, (data) => {
          if (JSON.parse(data.body).ex.routinneDetailResult.order !== 1) {
            setFinish(false);
          }

          setCurrentEx(JSON.parse(data.body));
          setIsParticipate(false);
          setStopbutton(false);
        });

        client.subscribe('/room/leave/' + liveId, (data) => {
          if (JSON.parse(data.body).nick === 'need rest') {
            setStopbutton(false);
            setFinish(false);
            setPlusset((prev) => prev + 1);
          } else if (JSON.parse(data.body).nick === 'no rest') {
            setStopbutton(false);
            setPlusset((prev) => prev + 1);
          } else if (JSON.parse(data.body).nick === 'no rest set done') {
            getTimer();
            setPlusset(1);
          }
        });

        client.subscribe('/room/routine/' + liveId, (data) => {
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
            setReadyTimer(true);
            setIsParticipate(false);
          } else if (massage.slice(0, 10) === 'set modify') {
            setIsModifySend(false);
            setIsModify(true);
            setModifyActionId(parseInt(massage.slice(11, massage.length)));
          } else if (massage === 'modify complete') {
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
            setStopbutton(false);
            setExFinish(true);
          }
        });

        client.send(
          '/app/leave/' + liveId,
          {},
          JSON.stringify({
            nick: myInfo.nickname,
          })
        );
      },
      () => {}
    );
    if (JSON.parse(isOwner)) {
      setIsownerbn(!isownerbtn);
      setShowBtn(true);
    } else {
      setIsParticipate(true);
      setShowBtn(false);
    }
  }, []);

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
    if (JSON.parse(isOwner)) {
      axios
        .delete('https://52.78.0.53.sslip.io/api/lives/' + liveId)
        .catch((e) => {});
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
        .catch((e) => {});
      myPeer.destroy();
      client.disconnect();
      alert('라이브에서 퇴장하셨습니다.');
    }

    window.location.replace('/live/list');
  };

  const handleStart = () => {
    client.send(
      '/app/ready/' + liveId,
      {},
      JSON.stringify({
        time: 5,
      })
    );
    setIsownerbn(!isownerbtn);
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

  const getReadyTimer = () => {
    setReadyTimer(!readyTimer);
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
    setStopbutton,
    stopbutton,
    socketTimerStop,
    socketTimerReset,
    socketRoutineFinish,
  ];
}
