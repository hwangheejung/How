import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/RoutineStart/Start.module.css';
import CountDetail from '../../components/RoutineStart/CountDetail';
import ReadyTimer from '../../components/RoutineStart/ReadyTimer';
import TimerDetail from '../../components/RoutineStart/TimerDetail';
import RoutineStart from './RoutineStart';
import RoutineAllDetail from '../../components/RoutineStart/RoutineAllDetail';
import { getCookieToken } from '../../store/Cookie';
import ActionVideo from '../../components/LiveExercise/ActionVideo';

const Startex = (props) => {
  const [detailRoutine, setDetailRoutine] = useState(null); //루틴 정보 배열
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0); //index로 각 운동 접근
  const [readyfinish, setReadyfinish] = useState(true); //ready타이머를 한번만 실행해주기 위한 상태
  const [exerciseEnd, setExerciseEnd] = useState(false); //운동이 끝난걸 인지하기 위한 상태

  const { routid, id } = useParams(); //루틴 아이디
  console.log(routid);
  //모달창
  const [isRoutineDetailPopup, setIsRoutineDetailPopup] = useState(true);

  //루틴 시작 버튼

  const [routinestartbtn, setRoutinestartbtn] = useState(true);

  const navigate = useNavigate();

  const getIndex = (num) => {
    //운동실행을 위한 index 주고받기

    if (num === 100) {
      //reset버튼을 눌렀을 때 index을 초기화 하기 위해 100을 받아옴
      setIndex(0);
    } else {
      if (index === detailRoutine.length - 1) {
        //index가 배열 크기와 같으면 운동 실행 끝
        setIndex(0);
        setExerciseEnd(!exerciseEnd); //운동이 끝났기 때문에 운동상태 변경
      } else {
        setIndex((index) => index + num); //index를 하나씩 늘려줌. num은 1로 고정되어있음
      }
    }
  };
  useEffect(() => {
    if (exerciseEnd === true) {
      axios
        .post(
          `https://52.78.0.53.sslip.io/api/calendars `,
          {
            localDate: new Date(),
            routId: routid,
            check: true,
          },
          {
            headers: { Authorization: `Bearer ${getCookieToken()}` },
          }
        )
        .then((res) => {
          console.log(res.data);
        });
    }
  }, [exerciseEnd]);
  const getReadyTimer = () => {
    setReadyfinish(!readyfinish);
  };

  const onClickStart = () => {
    setRoutinestartbtn(!routinestartbtn);
  };
  const onclick = () => {
    //운동이 끝나서 홈화면으로 돌아가기 위한 함수
    navigate('/');
  };

  const fetchroutine = async () => {
    //루틴 상세정보 api 연결
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io/api/ex-routines/${routid}`
      );
      setDetailRoutine(response.data.result.routineDetails);
    } catch (e) {
      console.log(e);
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!detailRoutine) return <div>null</div>;

  const currentId = detailRoutine[index].id;
  const currentorder = detailRoutine[index].order;
  const currentcount = detailRoutine[index].count; //현재 하고 있는 동작의 count

  const currenttime = detailRoutine[index].time; //현재 하고 있는 동작의 timer
  const currentrest = detailRoutine[index].rest; //현재 하고 있는 동작의 restTime

  const currenttype = detailRoutine[index].type; //현재 하고 있는 동작의 type

  const currentname = detailRoutine[index].ex.name; //현재 하고 있는 동작의 type

  const currentexerciseset = detailRoutine[index].set;
  const currentexvideo = detailRoutine[index].img[0].img;

  return (
    <div>
      {isRoutineDetailPopup ? (
        <div>
          <RoutineStart setIsRoutineDetailPopup={setIsRoutineDetailPopup} />
        </div>
      ) : (
        <div className={styles.currentActionBox}>
          {exerciseEnd ? ( //exercise가 끝났는지를 확인 .. 끝났으면 밑에 동작 수행
            <div className={styles.startButtonBox}>
              <div className={styles.endMessage}>운동이 끝났습니다.</div>

              <button className={styles.button} onClick={onclick}>
                홈화면으로 가기
              </button>
            </div>
          ) : (
            //exercise가 끝나지 않았을때 수행
            <div>
              <div className={styles.currentActionBox}>
                {detailRoutine?.map(
                  (detail, index) =>
                    !exerciseEnd &&
                    detail.id === currentId &&
                    !routinestartbtn &&
                    !readyfinish && (
                      <div className={styles.sequenceBox}>
                        <div
                          key={detail.order}
                          className={`${styles.sequence} ${
                            currentorder === index + 1 && styles.nowSequence
                          }`}
                        >
                          {detail.order}
                        </div>
                        <div className={styles.actionName}>
                          {detail.ex.name}
                        </div>
                      </div>
                    )
                )}
              </div>
              {/* <div className={styles.name}>Exercise</div> */}
              <div className={styles.frame}>
                <div className={styles.left}>
                  {routinestartbtn ? (
                    <div className={styles.startButtonBox}>
                      <button
                        className={styles.startButton}
                        onClick={onClickStart}
                      >
                        START
                      </button>
                    </div>
                  ) : (
                    <div>
                      {readyfinish ? ( //readyTimer을 보여주기 readyTimer가 실행되고 상태가 변경되면 운동 실행
                        <ReadyTimer
                          getReadyTimer={getReadyTimer}
                          currentexvideo={currentexvideo}
                        />
                      ) : currenttype ? (
                        <div>
                          <TimerDetail
                            routid={routid}
                            id={id}
                            name={currentname}
                            time={currenttime}
                            set={currentexerciseset}
                            restTime={currentrest}
                            getIndex={getIndex}
                            getReadyTimer={getReadyTimer}
                            index={index}
                            currentexvideo={currentexvideo}
                            detailRoutine={detailRoutine}
                          />
                        </div>
                      ) : (
                        <div>
                          <CountDetail
                            routid={routid}
                            id={id}
                            name={currentname}
                            count={currentcount}
                            set={currentexerciseset}
                            restTime={currentrest}
                            getIndex={getIndex}
                            getReadyTimer={getReadyTimer}
                            index={index}
                            currentexvideo={currentexvideo}
                            detailRoutine={detailRoutine}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.right}>
                <RoutineAllDetail detailRoutine={detailRoutine} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Startex;
