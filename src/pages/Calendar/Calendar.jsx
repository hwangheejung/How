import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../css/Calendar.module.css';
import { ko } from 'date-fns/locale';
import axios from 'axios';
import { getCookieToken } from '../../store/Cookie';
import LiveDetail from '../Live/LiveDetail';

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
} from 'date-fns';
import { CiCircleChevLeft, CiCircleChevRight } from 'react-icons/ci';

const Calendar = () => {
  const [mycalendardata, setCalendardata] = useState();
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null);

  const today = new Date();
  const [current, setCurrent] = useState(new Date());
  const monthStart = startOfMonth(current); //이번달 첫날 요일
  const monthEnd = endOfMonth(current); //이번달 마지막날 요일
  const monthEndDate = format(monthEnd, 'd');
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const months = [
    //달 표시
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const [currentMonth, setCurrentMonth] = useState(current.getMonth()); //오늘이 포함된 달 가져오기
  const [currentYear, setCurrentYear] = useState(current.getFullYear()); //오늘이 포함된 년 가져오기

  //모달창
  const [isCalendarInsert, setIsCalendarInsert] = useState(false);
  const [date, setDate] = useState({
    date: '',
  });

  const onPrevMonth = () => {
    //이전달
    setCurrentMonth(currentMonth - 1);

    if (format(startDate, 'd') === '1') {
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

    if (format(endDate, 'E') === 'Sat') {
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

  const createMonth = useMemo(() => {
    const monthArray = [];
    let day = startDate;
    while (differenceInCalendarDays(endDate, day) >= 0) {
      monthArray.push(day);
      day = addDays(day, 1);
    }

    return monthArray;
  }, [startDate, endDate]);

  const onClickdate = (v) => {
    const width = 500;
    const height = 700;
    const x = window.outerWidth / 2 - width / 2;
    const y = window.outerHeight / 2 - height / 2;

    if (today.getTime() <= v.getTime()) {
      // setIsCalendarInsert(!isCalendarInsert);
      // setDate({ v });
      const clickdate = format(v, 'yyyy년 MM월 dd일');
      const url = `/datedetail/${clickdate}`;
      window.open(
        url,
        'window_name',
        `width=${width},height=${height},location=no,status=no,scrollbars=yes,top=${y},left=${x}`
      );
    }
  };
  const fetchroutine = async () => {
    try {
      setCalendardata(null);
      setLoading(true);
      setError(null);

      axios
        .get(`https://52.78.0.53.sslip.io/api/calendars`, {
          headers: { Authorization: `Bearer ${getCookieToken()}` },
        })

        .then((res) => {
          setCalendardata(res.data.result);
        });
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
  if (!mycalendardata) return <div>null</div>;

  // console.log(mycalendardata[0].date);

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
                color: '#b57070',
              };
            } else if (i === 6) {
              // 토요일은 파란색 글씨
              style = {
                color: '#7070c3',
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
        {createMonth.map((v, i) => {
          let style;
          const validation = getMonth(current) === getMonth(v);
          const todayvalid =
            getYear(today) === getYear(v) &&
            getMonth(today) === getMonth(v) &&
            getDate(today) === getDate(v);
          if (validation && isSaturday(v)) {
            style = {
              color: '#7070c3',
            };
          } else if (validation && isSunday(v)) {
            style = {
              color: '#b57070',
            };
          }

          return (
            <button
              key={format(v, 'yyyyMMdd')}
              className={todayvalid ? styles.todaybutton : styles.datebutton}
              onClick={() => onClickdate(v)}
            >
              <div
                className={validation ? styles.currentMonth : styles.diffMonth}
                style={style}
              >
                <div className={styles.topLine}>
                  <span className={styles.day}>{format(v, 'd')}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div>{isCalendarInsert ? <LiveDetail date={date} /> : null}</div>
    </div>
  );
};

export default Calendar;
