import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../css/RoutineStart/Start.module.css";
import ExerciseDetail from "../../components/RoutineStart/ExerciseDetail";
import CountDetail from "../../components/RoutineStart/CountDetail";
import ReadyTimer from "../../components/RoutineStart/ReadyTimer";
import TimerDetail from "../../components/RoutineStart/TimerDetail";

const Startex = () => {
  const [detailRoutine, setDetailRoutine] = useState(null); //루틴 정보 배열
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0); //index로 각 운동 접근
  const [readyfinish, setReadyfinish] = useState(true); //ready타이머를 한번만 실행해주기 위한 상태
  const [exerciseEnd, setExerciseEnd] = useState(false); //운동이 끝난걸 인지하기 위한 상태
  //const [currentType, setCurrentType] = useState(true); //현재 운동 타입을 저장하는 상태
  const { id } = useParams(); //루틴 아이디

  const navigate = useNavigate();

  const getIndex = (num) => {
    //운동실행을 위한 index 주고받기

    if (num === 100) {
      //reset버튼을 눌렀을 때 index을 초기화 하기 위해 100을 받아옴
      setIndex(0);
      console.log(index);
    } else {
      if (index === detailRoutine.length - 1) {
        //index가 배열 크기와 같으면 운동 실행 끝
        setIndex(0);
        setExerciseEnd(!exerciseEnd); //운동이 끝났기 때문에 운동상태 변경
      } else {
        setIndex(index + num); //index를 하나씩 늘려줌. num은 1로 고정되어있음
      }
    }
  };
  const getReadyTimer = () => {
    setReadyfinish(!readyfinish);
  };

  const onclick = () => {
    //운동이 끝나서 홈화면으로 돌아가기 위한 함수
    navigate("/");
  };
  const fetchroutine = async () => {
    //루틴 상세정보 api 연결
    try {
      setDetailRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://52.78.0.53.sslip.io/api/ex-routines/${id}`
        // `http://52.78.0.53.sslip.io:8080/api/ex-routines/${id}`
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

  //console.log(detailRoutine);
  const currentcount = detailRoutine[index].count; //현재 하고 있는 동작의 count

  const currenttime = detailRoutine[index].time; //현재 하고 있는 동작의 timer
  const currentrest = detailRoutine[index].rest; //현재 하고 있는 동작의 restTime

  const currenttype = detailRoutine[index].type; //현재 하고 있는 동작의 type

  const currentname = detailRoutine[index].ex.name; //현재 하고 있는 동작의 type

  const currentexerciseset = detailRoutine[index].set;
  return (
    <div>
      {exerciseEnd ? ( //exercise가 끝났는지를 확인 .. 끝났으면 밑에 동작 수행
        <div>
          <div className={styles.letter}>운동 끝!</div>
          <button className={styles.button} onClick={onclick}>
            홈화면으로
          </button>
        </div>
      ) : (
        //exercise가 끝나지 않았을때 수행
        <div>
          <div className={styles.name}>Exercise</div>
          <div className={styles.frame}>
            <div className={styles.left}>
              <ExerciseDetail /> {/*루틴 데이터 상세로 보여주기 */}
            </div>
            <div className={styles.right}>
              {readyfinish ? ( //readyTimer을 보여주기 readyTimer가 실행되고 상태가 변경되면 운동 실행
                <ReadyTimer getReadyTimer={getReadyTimer} />
              ) : currenttype ? (
                <div>
                  <TimerDetail
                    routid={id}
                    name={currentname}
                    time={currenttime}
                    set={currentexerciseset}
                    restTime={currentrest}
                    getIndex={getIndex}
                    getReadyTimer={getReadyTimer}
                    index={index}
                  />
                </div>
              ) : (
                <div>
                  <CountDetail
                    routid={id}
                    name={currentname}
                    count={currentcount}
                    set={currentexerciseset}
                    restTime={currentrest}
                    getIndex={getIndex}
                    getReadyTimer={getReadyTimer}
                    index={index}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Startex;
