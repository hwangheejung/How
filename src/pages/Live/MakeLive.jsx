import React from "react";
import { useState, useEffect } from "react";
import styles from "../../css/makeLive.module.css";
const MakeLive = () => {
  const [liveName, setLiveName] = useState("");
  const [myroutinedata, setMyRoutindata] = useState([]);

  const onChangeName = (event) => {
    setLiveName(event.target.value);
  };
  const onClick = (id) => {
    alert(id);
  };

  useEffect(() => {
    const routines = [
      {
        id: 1,
        name: " 운동 할 수 있어요!",
        hits: 50,
        date: "2022-03-04",
      },
      {
        id: 2,
        name: "간단하게 두가지 하체운동",
        hits: 24,
        date: "2023-01-20",
      },
      {
        id: 3,
        name: "어깨운동 한세트씩",
        hits: 90,
        date: "2023-10-14",
      },
    ];
    setMyRoutindata(routines);
  }, []);
  return (
    <>
      <div>라이브 생성</div>
      <input
        type="text"
        className={styles.MakeLiveName}
        placeholder="이름"
        value={liveName}
        onChange={onChangeName}
      />
      <hr />
      <div>My routine</div>
      <div className={styles.MyRoutineListarr}>
        {myroutinedata.map(
          (
            routine //내 루틴들 보여주기
          ) => (
            <button
              type="button" //상세정보 보여주기 버튼
              className={styles.MyroutineClick}
              onClick={() => onClick(routine.id)}
            >
              <div className={styles.MyRoutineListItem}>
                <div className={styles.subject}>{routine.name}</div>
                <div className={styles.myhits}>{routine.hits}</div>
                <div className={styles.create_date}>{routine.date}</div>
              </div>
            </button>
          )
        )}
      </div>
      <button className={styles.backbutton}>생성</button>
    </>
  );
};

export default MakeLive;
