import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../css/Calendar/Calendar.module.css';
import axios from 'axios';
import { getCookieToken } from '../../store/Cookie';

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
import AddExCalendar from './AddExCalendar';

const Calendar = () => {
  const [mycalendardata, setCalendardata] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date();
  const [current, setCurrent] = useState(new Date());
  const monthStart = useMemo(() => startOfMonth(current), [current]);
  const monthEnd = useMemo(() => endOfMonth(current), [current]);
  const startDate = useMemo(() => startOfWeek(monthStart), [current]);
  const endDate = useMemo(() => endOfWeek(monthEnd), [current]);
  const months = [
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

  const [currentMonth, setCurrentMonth] = useState(current.getMonth());
  const [currentYear, setCurrentYear] = useState(current.getFullYear());

  const [isCalendarInsert, setIsCalendarInsert] = useState(false);
  const [clickdate, setClickDate] = useState({
    id: '',
    monthday: '',
    comment: '',
    checked: '',
  });

  const [clickmonth, setclickmonth] = useState(false);

  const [monthCalendar, setMonthCalendar] = useState([
    {
      id: '',
      monthday: '',
      comment: '',
      checked: '',
    },
  ]);

  const [website, setWebsite] = useState(true);
  const [beforetoday, setBeforeToday] = useState(false);

  useEffect(() => {
    if (window.outerWidth < 576) {
      setWebsite(!website);
    }
  }, [window.outerWidth]);

  const onPrevMonth = () => {
    setCurrentMonth(currentMonth - 1);
    if (format(startDate, 'd') === '1') {
      setCurrent(subDays(startDate, 1));
    } else {
      setCurrent(startDate);
    }
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    }
    setclickmonth(!clickmonth);
  };
  const onNextMonth = () => {
    setCurrentMonth(currentMonth + 1);
    if (format(endDate, 'E') === 'Sat') {
      setCurrent(addDays(endDate, 1));
    } else {
      setCurrent(endDate);
    }
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    }
    setclickmonth(!clickmonth);
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

  const isSameDate = (target1, target2) => {
    return (
      target1.getFullYear() === target2.getFullYear() &&
      target1.getMonth() === target2.getMonth() &&
      target1.getDate() === target2.getDate()
    );
  };
  const onClickdate = (id, monthday, comment, checked) => {
    if (today < monthday || isSameDate(today, monthday)) {
      setIsCalendarInsert(!isCalendarInsert);
      setBeforeToday(true);
      setClickDate({
        id: id,
        monthday: monthday,
        comment: comment,
        checked: checked,
      });
    }
  };

  const mobileonClickdate = (id, monthday, comment, checked) => {
    setIsCalendarInsert(!isCalendarInsert);
    setClickDate({
      id: id,
      monthday: monthday,
      comment: comment,
      checked: checked,
    });
    if (today > monthday) {
      setBeforeToday(false);
    } else {
      setBeforeToday(true);
    }
  };
  const onCalendarDetailClose = () => {
    setIsCalendarInsert((prev) => !prev);
  };
  const onHandleCheck = (checked, id) => {
    axios
      .patch(`https://52.78.0.53.sslip.io/api/calendars/${id} `, {
        chk: checked,
      })
      .then((res) => {})
      .catch((error) => {});
    window.location.reload();
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, [isCalendarInsert]);

  useEffect(() => {
    for (let i = 0; i < monthCalendar.length; i++) {
      for (let j = 0; j < mycalendardata?.length; j++) {
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
                  id: mycalendardata[j].id,
                  comment: mycalendardata[j].name,
                  checked: mycalendardata[j].isCheck,
                };
              } else {
                return item;
              }
            })
          );
        }
      }
    }
  }, [clickmonth, mycalendardata]);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생</div>;
  if (!mycalendardata) return <div>null</div>;

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
            let style;
            if (i === 0) {
              style = {
                color: '#b57070',
              };
            } else if (i === 6) {
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
        {monthCalendar.map((v, i) => {
          let style;
          const validation = getMonth(current) === getMonth(v.monthday);
          const todayvalid =
            getYear(today) === getYear(v.monthday) &&
            getMonth(today) === getMonth(v.monthday) &&
            getDate(today) === getDate(v.monthday);

          if (validation && isSaturday(v.monthday)) {
            style = {
              color: '#7070c3',
            };
          } else if (validation && isSunday(v.monthday)) {
            style = {
              color: '#b57070',
            };
          }
          if (todayvalid && validation) {
            style = {
              backgroundColor: '#e6f7f2',
            };
          }

          return (
            <button
              key={format(v.monthday, 'yyyyMMdd')}
              className={styles.datebutton}
              onClick={
                website
                  ? () => onClickdate(v.id, v.monthday, v.comment, v.checked)
                  : () =>
                      mobileonClickdate(v.id, v.monthday, v.comment, v.checked)
              }
            >
              <div
                className={validation ? styles.currentMonth : styles.diffMonth}
              >
                <div className={styles.topLine} style={style}>
                  <span className={styles.day}>{format(v.monthday, 'd')}</span>

                  <div>
                    {v.comment ? (
                      <div>
                        {website ? (
                          <div
                            className={
                              validation ? styles.comment : styles.diffMonth
                            }
                          >
                            {validation ? (
                              <input
                                type='checkbox'
                                id={i}
                                value={v.comment}
                                checked={v.checked}
                                onChange={(e) => {
                                  onHandleCheck(e.currentTarget.checked, v.id);
                                }}
                              />
                            ) : null}

                            <label htmlFor={v.comment}>{v.comment}</label>
                          </div>
                        ) : (
                          <div
                            className={
                              validation
                                ? styles.mobilecomment
                                : styles.diffMonth
                            }
                          >
                            *
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
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
            website={website}
            beforetoday={beforetoday}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Calendar;
