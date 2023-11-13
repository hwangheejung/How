import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../css/makeLive.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookieToken } from '../../store/Cookie';

const MakeLive = () => {
  const navigate = useNavigate();
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

  //console.log(livelist);
  const onClick = (id, routineid) => {
    //루틴 선택
    setMyroutineclick(id); //루틴 배열 중 선택한 배열 index
    setRoutineid(routineid); // 루틴 아이디 세팅
    // console.log(routineid); //선택한 루틴 아이디
    livelist.id = routineid; //루틴 아이디를 배열에 넣어줌
  };

  const liveCreate = (livelist) => {
    //라이브 생성 버튼 클릭시
    // window.opener.href = '/live/list';
    // window.close();
    axios
      .post(
        `http://52.78.0.53/api/lives`,
        {
          subject: livelist.subject,
          routId: livelist.id,
        },
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      )
      .then((res) => {
        // console.log(res.data);
        window.opener.location.href = `/live/setting/owner/${res.data.result.roomId}`;
        window.close();
      });
    // console.log(livelist.subject + ':' + livelist.id);
  };

  const onChangeName = (event) => {
    //라이브 생성
    setLivelist({
      subject: event.target.value,
      id: routineid,
    });
  };

  const close = () => {
    //취소버튼 클릭시
    window.close();
  };

  const fetchroutine = async () => {
    //라이브 리스트 api 연결
    try {
      setMyRoutindata(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://52.78.0.53/api/ex-routines/me?type=false`,
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      );
      setMyRoutindata(response.data);
    } catch (e) {
      setError(e);
      console.log('에러 발생', e);
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
    <>
      <div className={styles.makeLabel}>라이브 생성</div>
      <input
        type='text'
        className={styles.MakeLiveName}
        placeholder='라이브 제목'
        size='40'
        //  value={liveName}
        onChange={onChangeName}
      />
      <hr />
      <div className={styles.routineLabel}>My routine</div>
      <div className={styles.MyRoutineListarr}>
        {myroutinedata.result?.map(
          (
            myroutine,
            idx //내 루틴들 보여주기
          ) => (
            <button
              key={idx}
              //상세정보 보여주기 버튼
              className={`${styles.MyroutineClick}
                ${idx === myroutineclick && styles.selected}`}
              onClick={() => onClick(idx, myroutine.routineId)}
            >
              <div className={styles.subject}>{myroutine.routineSubject}</div>
              <div className={styles.hitscreate}>
                <div className={styles.myhits}>
                  운동 횟수: {myroutine.count}
                </div>
                <div className={styles.createDate}>{myroutine.createDate}</div>
              </div>
            </button>
          )
        )}
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => liveCreate(livelist)}>
          생성
        </button>
        <button className={styles.button} onClick={close}>
          취소
        </button>
      </div>
    </>
  );
};

export default MakeLive;
