import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import styles from '../../css/Calendar.module.css';
import {
  addDays,
  getDate,
  getDaysInMonth,
  getMonth,
  getWeeksInMonth,
} from 'date-fns';
import { addMonths, endOfMonth, endOfWeek, startOfMonth } from 'date-fns/esm';
import { useCallback } from 'react';
import { getCookieToken } from '../../store/Cookie';
const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfMonth(monthStart);
  const endDate = endOfWeek(monthEnd);
  const weekMock = ['일', '월', '화', '수', '목', '금', '토'];
  const nextMonthHandler = useCallback(() => {
    setCurrentDate(addMonths(currentDate, 1));
  }, [currentDate]);
  const prevMonthHandler = useCallback(() => {
    setCurrentDate(addMonths(currentDate, 1));
  }, [currentDate]);

  // console.log(getCookieToken());

  return <div className={styles.CalendarPage}></div>;
};

export default CalendarPage;
