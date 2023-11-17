import { endOfMonth, startOfMonth } from "date-fns/esm";
import React, { useState } from "react";
import styles from "../../css/Calendar.module.css";

const Calendar = () => {
  const [today, setToday] = useState(new Date());
  const monthStart = startOfMonth(today); //이번달 첫날 요일
  const monthEnd = endOfMonth(today); //이번달 마지막날 요일
  console.log(today);
  console.log(monthStart);
  console.log(monthEnd);
  const [selectedDate, setSelectDate] = useState(new Date());

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>Header</div>
      <div className={styles.days}>Days</div>
      <div className={styles.body}>Cells</div>
    </div>
  );
};

export default Calendar;
