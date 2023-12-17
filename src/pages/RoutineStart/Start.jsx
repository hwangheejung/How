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

const Startex = () => {
  const [detailRoutine, setDetailRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [readyfinish, setReadyfinish] = useState(true);
  const [exerciseEnd, setExerciseEnd] = useState(false);

  const { routid, id } = useParams();

  const [isRoutineDetailPopup, setIsRoutineDetailPopup] = useState(true);

  const [routinestartbtn, setRoutinestartbtn] = useState(true);

  const navigate = useNavigate();

  const getIndex = (num) => {
    if (num === 100) {
      setIndex(0);
    } else {
      if (index === detailRoutine.length - 1) {
        setIndex(0);
        setExerciseEnd(!exerciseEnd);
      } else {
        setIndex((index) => index + num);
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
        .then((res) => {});
    }
  }, [exerciseEnd]);
  const getReadyTimer = () => {
    setReadyfinish(!readyfinish);
  };

  const onClickStart = () => {
    setRoutinestartbtn(!routinestartbtn);
  };
  const onclick = () => {
    navigate('/');
  };

  const fetchroutine = async () => {
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io/api/ex-routines/${routid}`
      );
      setDetailRoutine(response.data.result.routineDetails);
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
  if (!detailRoutine) return <div>null</div>;

  const currentId = detailRoutine[index].id;
  const currentorder = detailRoutine[index].order;
  const currentcount = detailRoutine[index].count;

  const currenttime = detailRoutine[index].time;
  const currentrest = detailRoutine[index].rest;

  const currenttype = detailRoutine[index].type;

  const currentname = detailRoutine[index].ex.name;

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
          {exerciseEnd ? (
            <div className={styles.startButtonBox}>
              <div className={styles.endMessage}>운동이 끝났습니다.</div>

              <button className={styles.button} onClick={onclick}>
                홈화면으로 가기
              </button>
            </div>
          ) : (
            <div>
              <div className={styles.currentActionBox}>
                {detailRoutine?.map(
                  (detail, index) =>
                    !exerciseEnd &&
                    detail.id === currentId &&
                    !routinestartbtn &&
                    !readyfinish && (
                      <div className={styles.sequenceBox} key={detail.order}>
                        <div
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
                      {readyfinish ? (
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
