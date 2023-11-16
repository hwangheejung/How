import React, { useEffect, useRef } from 'react';

export default function Video({ streamInfo, nicknames }) {
  const { peerId, stream } = streamInfo;

  const streamRef = useRef();

  // console.log('nicknames peerId check: ', nicknames);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.srcObject = stream;
    }
  }, [stream, streamRef]);

  return (
    <div>
      <video
        playsInline
        ref={streamRef}
        autoPlay
        style={{ width: '400px', height: '400px' }}
      />
      <span>{nicknames[peerId]}</span>
    </div>
  );
}
