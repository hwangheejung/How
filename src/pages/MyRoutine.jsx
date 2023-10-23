import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../css/MyRoutine.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import onPopup from './onPopup';
export default function MyRoutine() {
  const [myroutinedata, setMyRoutindata] = useState([]);
  const [searchArray, setSearchArray] = useState([]);
  const [myroutineSearch, setMyroutineSearch] = useState('');

  const SearchValue = (event) => {
    setMyroutineSearch(event.target.value);
    //console.log(event.target.value);
  };

  const onClick = () => {
    let searchArray = [...myroutinedata];
    console.log(searchArray);
    let searcharray = myroutinedata.filter((search) =>
      search.name.includes(myroutineSearch)
    );
    console.log(searcharray);
    setSearchArray(searcharray);
  };
  useEffect(() => {
    const routines = [
      {
        id: 1,
        name: ' 운동 할 수 있어요!',
        hits: 50,
        date: '2022-03-04',
      },
      {
        id: 2,
        name: '간단하게 두가지 하체운동',
        hits: 24,
        date: '2023-01-20',
      },
      {
        id: 3,
        name: '어깨운동 한세트씩',
        hits: 90,
        date: '2023-10-14',
      },
    ];
    setMyRoutindata(routines);
  }, []);

  return (
    <div className={styles.header}>
      <span className={styles.Routine}>MyRoutine</span>
      <hr />
      <div className={styles.SearchandSort}>
        <input
          type='text'
          className={styles.routinesearch}
          placeholder='Search'
          value={myroutineSearch}
          onChange={SearchValue}
        />
        <button className={styles.SearchButton} onClick={onClick}>
          <AiOutlineSearch />
        </button>
        <div className={styles.Sorted}>
          <button
            onClick={() => {
              let copy = [...myroutinedata];
              console.log(copy);
              copy.sort((a, b) => b.hits - a.hits);
              setMyRoutindata(copy);
            }}
            type='button'
            className={styles.sort}
          >
            조회수
          </button>
          <button
            onClick={() => {
              let copy = [...myroutinedata];

              copy.sort((a, b) => new Date(b.date) - new Date(a.date));
              console.log(copy);
              setMyRoutindata(copy);
            }}
            type='button'
            className={styles.sort}
          >
            최신순
          </button>
        </div>
      </div>

      <div className={styles.MyRoutineListarr}>
        {myroutinedata.map((routine) => (
          <button
            type='button'
            className={styles.MyroutineClick}
            onClick={onPopup}
          >
            <div className={styles.MyRoutineListItem}>
              <div className={styles.subject}>{routine.name}</div>
              <div className={styles.myhits}>{routine.hits}</div>
              <div className={styles.create_date}>{routine.date}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
