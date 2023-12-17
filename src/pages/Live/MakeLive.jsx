import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../css/Live/makeLive.module.css';
import axios from 'axios';
import { getCookieToken } from '../../store/Cookie';

const MakeLive = (props) => {
  const [myroutinedata, setMyRoutindata] = useState([]);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);
  const [routineid, setRoutineid] = useState(0);
  const [livelist, setLivelist] = useState([
    {
      subject: '',
      id: 0,
    },
  ]);
  const [myroutineclick, setMyroutineclick] = useState('');

  const onClick = (id, routineid) => {
    setMyroutineclick(id);
    setRoutineid(routineid);
    livelist.id = routineid;
  };

  const liveCreate = (livelist) => {
    axios
      .post(
        `https://52.78.0.53.sslip.io/api/lives`,
        {
          subject: livelist.subject,
          routId: livelist.id,
        },
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      )
      .then((res) => {
        props.setRoomId(res.data.result.roomId);
        props.setSubject(res.data.result.subject);
        props.setIsOwnerSetting(true);
        props.setMakeLive(false);
      });
  };

  const onChangeName = (event) => {
    setLivelist({
      subject: event.target.value,
      id: routineid,
    });
  };

  const close = () => {
    props.setMakeLive((prev) => !prev);
  };

  const fetchroutine = async () => {
    try {
      setMyRoutindata(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io/api/ex-routines/me?type=false`,
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      );
      setMyRoutindata(response.data);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!myroutinedata) return <div>null</div>;
  return (
    <div className={styles.MakeLiveModal}>
      <div className={styles.container}>
        <div className={styles.makeLabel}>Create Live</div>
        <div className={styles.titleLabel}>Live Title</div>
        <div className={styles.inputName}>
          <input
            type='text'
            className={styles.MakeLiveName}
            placeholder='제목'
            size='40'
            onChange={onChangeName}
          />
        </div>
        <div className={styles.scroll}>
          <div className={styles.routineLabel}>Select Routine</div>
          <div className={styles.MyRoutineListarr}>
            {myroutinedata.result?.map((myroutine, idx) => (
              <div
                key={idx}
                className={`${styles.MyroutineClick}
                ${idx === myroutineclick && styles.selected}`}
              >
                <div className={styles.routineDetail}>
                  <div className={styles.subjectHits}>
                    <div className={styles.subject}>
                      {myroutine.routine.routineSubject}
                    </div>
                    <div className={styles.myhits}>
                      ∙ 운동 횟수 {myroutine.routine.count}회
                    </div>
                  </div>
                  <div className={styles.cates}>
                    {myroutine.cate.map((item, index) => (
                      <span key={index} className={styles.actionCate}>
                        #{item}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className={styles.selectButton}
                  onClick={() => onClick(idx, myroutine.routine.routineId)}
                >
                  선택하기
                </button>
              </div>
            ))}
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() => liveCreate(livelist)}
            >
              생성
            </button>
            <button className={styles.button} onClick={close}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeLive;
