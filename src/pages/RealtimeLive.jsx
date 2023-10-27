import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';

export default function RealtimeLive() {
  const client = useRef();

  useEffect(() => {
    client.current = Stomp.over(() => {
      const sock = new SockJS('http://52.78.0.53:8080/live');
      return sock;
    });

    client.current.connect(
      {},
      () => {
        const sub = client.current.subscribe('/topic/1', (e) => {
          console.log(e.body);
        });
      },
      (e) => {
        console.log(e);
      }
    );
  }, []);

  const handleSend = () => {
    client.current.send(
      '/app/send',
      {},
      JSON.stringify({
        sender: '111',
        contents: 'test',
      })
    );
  };

  return (
    <>
      <button onClick={handleSend}>send</button>
    </>
  );
}
