import React from 'react';

export default function LiveActionDetail({ currentAction, getNextAction }) {
  const { ex: actionDetail, set, time } = currentAction;

  const handleDone = () => {
    getNextAction();
  };

  return (
    <>
      <h1>LiveActionDetail component</h1>
      <div>
        <span>{actionDetail.name}</span>
        <span style={{ whiteSpace: 'pre-wrap' }}>{actionDetail.desc}</span>
      </div>
      <div>
        <span>{actionDetail.name}</span>
        <span>Sets: {set}</span>
        <span>{time}s</span>
        <button onClick={handleDone}>Done</button>
      </div>
    </>
  );
}
