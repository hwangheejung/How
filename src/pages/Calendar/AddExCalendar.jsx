import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, getYear } from "date-fns";
import axios from "axios";
import { getCookieToken } from "../../store/Cookie";
import styles from "../../css/Calendar/CalendarModal.module.css";

const AddExCalendar = (props) => {
  const { id } = useParams();

  // console.log(props.clickdate);
  const today = new Date();
  const [myroutinedata, setMyRoutindata] = useState([]);
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);
  const [routineid, setRoutineid] = useState(0);
  const [myroutineclick, setMyroutineclick] = useState("");

  const CalendarCreate = (date, routineid) => {
    console.log(date);
    axios
      .post(
        `https://52.78.0.53.sslip.io/api/calendars `,
        {
          localDate: date,
          routId: routineid,
          check: false,
        },
        {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
    window.location.reload();

    props.onCalendarDetailClose(false);
  };
  const onClick = (id, routineid) => {
    //루틴 선택
    setMyroutineclick(id); //루틴 배열 중 선택한 배열 index
    setRoutineid(routineid); // 루틴 아이디 세팅
    // console.log(routineid); //선택한 루틴 아이디
  };

  const onHandleCheck = (checked, id) => {
    axios
      .patch(`https://52.78.0.53.sslip.io/api/calendars/${id} `, {
        chk: checked,
      })
      .then((res) => {
        console.log(res.data);
      });
    window.location.reload();
  };

  // const CalendarCreate = (date, routineid) => {
  //   props.onCalendarDetailClose(false);
  // };
  // console.log(calendar);
  const fetchroutine = async () => {
    //라이브 리스트 api 연결
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
      console.log("에러 발생", e);
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
    <div className={styles.CalendarModal}>
      <div className={styles.container}>
        <div className={styles.clickdate}>
          <div className={styles.date}>
            {" "}
            {format(props.clickdate.monthday, "yyyy년 MM월 dd일")}
          </div>

          <div>
            {props.website ? null : (
              <div>
                {props.clickdate.comment ? (
                  <div className={styles.list}>
                    <div className={styles.mylist}>TODO</div>
                    <div className={styles.inputlabel}>
                      <input
                        type="checkbox"
                        className={styles.input}
                        value={props.clickdate.comment}
                        checked={props.clickdate.checked}
                        onChange={(e) => {
                          onHandleCheck(
                            e.currentTarget.checked,
                            props.clickdate.id
                          );
                        }}
                      />
                      <label htmlFor={props.clickdate.comment}>
                        {props.clickdate.comment}
                      </label>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <div className={styles.scroll}>
          {props.beforetoday ? (
            <div>
              <div className={styles.routineLabel}>My routine</div>
              <div className={styles.MyRoutineListarr}>
                {myroutinedata?.result?.map(
                  (
                    myroutine,
                    idx //내 루틴들 보여주기
                  ) => (
                    <button
                      key={idx}
                      //상세정보 보여주기 버튼
                      className={`${styles.MyroutineClick}
                  ${idx === myroutineclick && styles.selected}`}
                      onClick={() => onClick(idx, myroutine.routine.routineId)}
                    >
                      <div className={styles.subject}>
                        {myroutine.routine.routineSubject}
                      </div>
                      <div className={styles.cates}>
                        {myroutine.cate.map((item, index) => (
                          <span key={index} className={styles.actionCate}>
                            #{item}
                          </span>
                        ))}
                      </div>
                      <div className={styles.myhits}>
                        운동 횟수: {myroutine.routine.count}
                      </div>
                    </button>
                  )
                )}
              </div>

              <div className={styles.buttons}>
                <button
                  className={styles.button}
                  onClick={() =>
                    CalendarCreate(
                      format(props.clickdate.monthday, "yyyy-MM-dd"),
                      routineid
                    )
                  }
                >
                  추가
                </button>
                <button
                  className={styles.button}
                  onClick={props.onCalendarDetailClose}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.buttons}>
              <button
                className={styles.beforedatebutton}
                onClick={props.onCalendarDetailClose}
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExCalendar;
