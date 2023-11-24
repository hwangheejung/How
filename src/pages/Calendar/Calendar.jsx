import React, { useState, useMemo, useEffect } from "react";
import styles from "../../css/Calendar/Calendar.module.css";
import { ko } from "date-fns/locale";
import axios from "axios";
import { getCookieToken } from "../../store/Cookie";
import LiveDetail from "../Live/LiveDetail";

import {
  format,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  differenceInCalendarDays,
  addDays,
  getMonth,
  isSaturday,
  isSunday,
  subDays,
  getDate,
  getYear,
} from "date-fns";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import AddExCalendar from "./AddExCalendar";
import { setMonth } from "date-fns/esm";

const Calendar = () => {
  const [mycalendardata, setCalendardata] = useState();
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const today = new Date();
  const [current, setCurrent] = useState(new Date());
  const monthStart = useMemo(() => startOfMonth(current), [current]); //이번달 첫날 요일
  const monthEnd = useMemo(() => endOfMonth(current), [current]); //이번달 마지막날 요일
  const startDate = useMemo(() => startOfWeek(monthStart), [current]);
  const endDate = useMemo(() => endOfWeek(monthEnd), [current]);
  const months = [
    //달 표시
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  const [currentMonth, setCurrentMonth] = useState(current.getMonth()); //오늘이 포함된 달 가져오기
  const [currentYear, setCurrentYear] = useState(current.getFullYear()); //오늘이 포함된 년 가져오기

  //모달창
  const [isCalendarInsert, setIsCalendarInsert] = useState(false);
  const [clickdate, setClickDate] = useState();

  //api로 받아온걸 띄우기 위한 변수

  const [clickmonth, setclickmonth] = useState(false);

  const [monthCalendar, setMonthCalendar] = useState([
    {
      monthday: "",
      comment: "",
      checked: "",
    },
  ]);

  const onPrevMonth = () => {
    //이전달
    setCurrentMonth(currentMonth - 1);
    if (format(startDate, "d") === "1") {
      //1일이 일요일일때 전달을 표현하기 위해
      setCurrent(subDays(startDate, 1));
    } else {
      setCurrent(startDate);
    }

    if (currentMonth === 0) {
      //1월이면 전달에 전년도와 마지막달 전달
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    }
  };
  const onNextMonth = () => {
    //다음달
    setCurrentMonth(currentMonth + 1);
    if (format(endDate, "E") === "Sat") {
      //마지막날이 토요일일때 다음달을 표현하기 위해
      setCurrent(addDays(endDate, 1));
    } else {
      setCurrent(endDate);
    }

    if (currentMonth === 11) {
      //12월이면 다음달에 다음년도와 첫달 전달
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    }
  };

  useEffect(() => {
    const monthArray = [];
    let day = startDate;
    while (differenceInCalendarDays(endDate, day) >= 0) {
      monthArray.push({ monthday: day, comment: null, checked: false });
      day = addDays(day, 1);
    }
    setMonthCalendar(monthArray);
    setclickmonth(!clickmonth);
  }, [current]);

  const onClickdate = (v) => {
    if (today.getTime() < v.getTime() || today.getTime() === v.getTime()) {
      setIsCalendarInsert(!isCalendarInsert);
      setClickDate(v);
    }
  };
  const onCalendarDetailClose = () => {
    setIsCalendarInsert((prev) => !prev);
  };
  const fetchroutine = async () => {
    try {
      setCalendardata(null);
      setLoading(true);
      setError(null);

      axios
        .get(`http://52.78.0.53.sslip.io:8080/api/calendars`, {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        })

        .then((res) => {
          setCalendardata(res.data.result);
        });
    } catch (e) {
      setError(e);
      console.log("에러 발생", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, []);

  useEffect(() => {
    for (let i = 0; i < monthCalendar.length; i++) {
      // console.log(createMonth[i].monthday);
      for (let j = 0; j < mycalendardata?.length; j++) {
        // console.log(new Date(mycalendardata[j].date));
        let xx = new Date(mycalendardata[j].date);
        if (
          getYear(monthCalendar[i].monthday) === getYear(xx) &&
          getMonth(monthCalendar[i].monthday) === getMonth(xx) &&
          getDate(monthCalendar[i].monthday) === getDate(xx)
        ) {
          setMonthCalendar((prev) =>
            prev.map((item, index) => {
              if (index === i) {
                return {
                  ...item,
                  comment: mycalendardata[j].name,
                  checked: mycalendardata[j].isCheck,
                };
              } else {
                return item;
              }
            })
          );
          // console.log(monthCalendar);
        }
      }
    }
  }, [clickmonth, mycalendardata]);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!mycalendardata) return <div>null</div>;

  // console.log(monthCalendar);
  return (
    <div className={styles.calendar}>
      <div className={styles.CalendarHeader}>
        <div className={styles.headername}>
          <button onClick={onPrevMonth}>
            <CiCircleChevLeft />
          </button>
          <div className={styles.currentYear}>{currentYear}년</div>
          <div className={styles.currentMonth}>{months[currentMonth]}</div>
          <button onClick={onNextMonth}>
            <CiCircleChevRight />
          </button>
        </div>

        <div className={styles.dayContainer}>
          {days.map((v, i) => {
            // 달력 상단의 요일들을 넣어주는 부분
            let style;
            if (i === 0) {
              // 일요일부터 시작했기 때문에 0번 째는 빨간색 글씨
              style = {
                color: "#b57070",
              };
            } else if (i === 6) {
              // 토요일은 파란색 글씨
              style = {
                color: "#7070c3",
              };
            }

            return (
              <div className={styles.days} key={`day${i}`} style={style}>
                {v}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.dateContainer}>
        {monthCalendar.map((v, i) => {
          // console.log(v.comment);
          let style;
          const validation = getMonth(current) === getMonth(v.monthday);
          const todayvalid =
            getYear(today) === getYear(v.monthday) &&
            getMonth(today) === getMonth(v.monthday) &&
            getDate(today) === getDate(v.monthday);

          if (validation && isSaturday(v.monthday)) {
            style = {
              color: "#7070c3",
            };
          } else if (validation && isSunday(v.monthday)) {
            style = {
              color: "#b57070",
            };
          }

          return (
            <button
              key={format(v.monthday, "yyyyMMdd")}
              className={todayvalid ? styles.todaybutton : styles.datebutton}
              onClick={() => onClickdate(v.monthday)}
            >
              <div
                className={validation ? styles.currentMonth : styles.diffMonth}
                style={style}
              >
                <div className={styles.topLine}>
                  <span className={styles.day}>{format(v.monthday, "d")}</span>
                  {v.comment ? (
                    <div className={styles.comment}>
                      <input
                        type="checkbox"
                        id={v.comment}
                        value={v.comment}
                        checked={v.checked}
                      />
                      <label htmlFor={v.comment}>{v.comment}</label>
                    </div>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div>
        {isCalendarInsert ? (
          <AddExCalendar
            clickdate={clickdate}
            onCalendarDetailClose={onCalendarDetailClose}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Calendar;
