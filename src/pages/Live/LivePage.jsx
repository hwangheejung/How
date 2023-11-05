import { Stomp } from '@stomp/stompjs';
import React, { useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faVideo,
  faMicrophoneSlash,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import Peer from 'peerjs';

export default function LivePage() {
  const [roomId, setRoomId] = useState('');
  const [routineId, setRoutineId] = useState('');
  const [myStream, setMyStream] = useState();
  const [video, setVideo] = useState();
  const [audio, setAudio] = useState();

  const client = useRef();
  const myMediaStream = useRef();
  const othersMediaStream = useRef();

  const enterRoom = () => {
    const peer = new Peer();
    // console.log(peer); // 👍

    client.current = Stomp.over(() => {
      return new SockJS('http://52.78.0.53:8080/live');
    });
    // console.log(client.current); //👍

    let Stream;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setMyStream(stream);
        Stream = stream;
        // console.log('stream', stream); // 👍
        // console.log('Stream', Stream); // 👍

        if (myMediaStream.current) myMediaStream.current.srcObject = stream;
      });

    peer.on('open', (id) => {
      // console.log('peer id:', id); //👍
      client.current.send(
        '/app/participate/' + roomId,
        {},
        JSON.stringify({
          sdp: id,
          nick: 'sdp 체크중인 분-!',
        })
      );
    });

    peer.on('call', (call) => {
      call.answer(myStream);
      console.log('my answer complete!', myStream);
      call.on('stream', (stream) => {
        console.log(`other stream complete`, stream);
        if (othersMediaStream.current)
          othersMediaStream.current.srcObject = stream;
      });
    });

    client.current.connect(
      {},
      () => {
        // console.log('connected!'); //👍
        client.current.subscribe('/room/routine/' + roomId, (routineDetail) => {
          // console.log('got routineDetail!'); //👍
          console.log(routineDetail.body);
        });

        client.current.subscribe('/room/ready/' + roomId, (readyTime) => {
          // console.log('got ready timer!'); //👍
          console.log(readyTime.body);
        });

        client.current.subscribe('/room/leave/' + roomId, (nick) => {
          // console.log('got nickname'); //👍
          console.log(nick.body);
        });

        client.current.subscribe('/room/participate/' + roomId, (data) => {
          // console.log(data.body); // 👍
          // console.log('Stream', Stream); 👍
          const call = peer.call(JSON.parse(data.body).sdp, Stream);
          console.log('my call complete!', Stream);
          call.on('stream', (stream) => {
            // console.log('call & stream');
            if (othersMediaStream.current)
              othersMediaStream.current.srcObject = stream;

            console.log('other stream complete', stream);
          });
        });
      },
      () => {
        console.log('error occured');
      }
    );
  };

  const handleVideo = () => {
    myStream
      .getVideoTracks()
      .forEach((video) => (video.enabled = !video.enabled));
    video ? setVideo(false) : setVideo(true);
  };

  const handleAudio = () => {
    myStream
      .getAudioTracks()
      .forEach((audio) => (audio.enabled = !audio.enabled));
    audio ? setAudio(false) : setAudio(true);
  };

  const sendRoutineId = () => {
    client.current.send(
      '/app/start/' + roomId,
      {},
      JSON.stringify({
        routId: routineId,
      })
    );
  };

  const sendReadyTimer = () => {
    client.current.send(
      '/app/ready/' + roomId,
      {},
      JSON.stringify({
        time: 10,
      })
    );
  };

  const handleLeave = () => {
    client.current.send(
      '/app/leave/' + roomId,
      {},
      JSON.stringify({
        nick: '떠나는 분-!',
      })
    );
  };

  const handleRoomId = (e) => {
    setRoomId(e.target.value);
  };

  const handleRoutineId = (e) => {
    setRoutineId(e.target.value);
  };

  return (
    <>
      <div>
        <input
          type='text'
          placeholder='room id'
          value={roomId}
          onChange={handleRoomId}
        />
        <button onClick={enterRoom}>enter</button>
        <input
          type='text'
          placeholder='routine id'
          value={routineId}
          onChange={handleRoutineId}
        />
        <button onClick={sendRoutineId}>send</button>
        <button onClick={sendReadyTimer}>start</button>
        <button onClick={handleLeave}>leave</button>
      </div>
      <div>
        <video
          playsInline
          ref={myMediaStream}
          autoPlay
          style={{ width: '400px', height: '400px' }}
        />
        <button onClick={() => handleAudio()}>
          {audio ? (
            <FontAwesomeIcon icon={faMicrophone} />
          ) : (
            <FontAwesomeIcon icon={faMicrophoneSlash} />
          )}
        </button>
        <button onClick={() => handleVideo()}>
          {!video ? (
            <FontAwesomeIcon icon={faVideo} />
          ) : (
            <FontAwesomeIcon icon={faVideoSlash} />
          )}
        </button>
      </div>
      <div>
        <video
          playsInline
          ref={othersMediaStream}
          autoPlay
          style={{ width: '400px', height: '400px' }}
        />
        <button onClick={() => handleAudio()}>
          {audio ? (
            <FontAwesomeIcon icon={faMicrophone} />
          ) : (
            <FontAwesomeIcon icon={faMicrophoneSlash} />
          )}
        </button>
        <button onClick={() => handleVideo()}>
          {!video ? (
            <FontAwesomeIcon icon={faVideo} />
          ) : (
            <FontAwesomeIcon icon={faVideoSlash} />
          )}
        </button>
      </div>
    </>
  );
}
