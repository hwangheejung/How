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
} from "@fortawesome/free-solid-svg-icons";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useParams } from "react-router-dom";
import Peer from "peerjs";
import { useSelector } from "react-redux";

// server 연결
const client = Stomp.over(() => {
  return new SockJS("http://52.78.0.53:8080/live");
});

export default function LivePage() {
  const { liveId, camera, audio } = useParams();
  // const myInfo = useSelector((state) => state.userInfo);

  const [myMediaStream, setMyMediaStream] = useState();
  const [audioOn, setAudioOn] = useState(JSON.parse(audio));
  const [cameraOn, setCameraOn] = useState(JSON.parse(camera));
  const [peers, setPeers] = useState([]);

  const myMedia = useRef();
  // const othersMedia = useRef([]);
  const otherMedia = useRef();

  useEffect(() => {
    let myPeerId;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyMediaStream(stream);
        myMedia.current.srcObject = stream;

        stream.getAudioTracks().forEach((audio) => (audio.enabled = audioOn));

        stream.getVideoTracks().forEach((video) => (video.enabled = cameraOn));
      });

    // 연결 되었을 때
    client.connect(
      {},
      () => {
        client.subscribe("/room/participate/" + liveId, (data) => {
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
                // othersMedia.current.push(otherMedia);
                // console.log(otherMedia);
                // console.log(othersMedia.current[0]);
                console.log(`received answer`);
                // setPeers((prev) => [
                //   ...prev,
                //   {
                //     peerId: call.peer,
                //     stream: stream,
                //   },
                // ]);
              }
            });
          }
        });

        const peer = new Peer();
        peer.on("open", (peerId) => {
          myPeerId = peerId;
          client.send(
            "/app/participate/" + liveId,
            {},
            JSON.stringify({
              sdp: peerId,
              // nick: myInfo.nickname,
            })
          );
        });

        peer.on("call", (call) => {
          call.answer(myMedia.current.srcObject);
          console.log("answer");
          call.on("stream", (stream) => {
            if (otherMedia.current) {
              otherMedia.current.srcObject = stream;
              // othersMedia.current.push(othersMedia);
              // console.log(otherMedia);
              // console.log(othersMedia[0]);
              console.log(`received offer`);
              setPeers((prev) => [
                ...prev,
                {
                  peerId: call.peer,
                  stream: stream,
                },
              ]);
            }
          });
        });
      },
      () => {
        console.log("error occured");
      }
    );
  }, []);

  // console.log(peers);
  // console.log(othersMediaStream);

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

  return (
    <div>
      <div>
        <video
          playsInline
          ref={myMedia}
          autoPlay
          style={{ width: "400px", height: "400px" }}
        />
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
        P
      </div>
      {/* {peers.map((peer) => (
        <div>
          <video
            playsInline
            ref={(e) => (e.srcObject = peer.stream)}
            autolay
            style={{ width: '400px', height: '400px' }}
          />
        </div>
      ))} */}
    </div>
  );
}