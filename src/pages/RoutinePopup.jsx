import React from 'react';

const RoutinePopup = (props) => {
  // let { param } = props;

  const onPopup = () => {
    const url = 'RoutineDetail ';
    window.open(
      url,
      'window_name',
      'width=430,height=500,location=no,status=no,scrollbars=yes'
    );
  };
  return (
    <div>
      <button type='button' className='btn-circle' onClick={onPopup}>
        미리보기
      </button>
    </div>
  );
};

export default RoutinePopup;
