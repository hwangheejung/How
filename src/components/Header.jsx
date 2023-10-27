import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/Header.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeCookieToken } from '../store/Cookie';
import { DELETE_USERINFO } from '../store/loginRedux';
import { persistor } from '..';

export default function Header({ menu, onMenu }) {
  const userInfo = useSelector((state) => state.userInfo);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(DELETE_USERINFO());
    persistor.purge();
    removeCookieToken();
    localStorage.removeItem('menu');
    navigate('/login');
  };

  return (
    <>
      <header>
        <div className={styles.navbar}>
          <div className={styles.titleBox}>
            <FontAwesomeIcon className={styles.icon} icon={faSeedling} />
            <Link to='/' className={styles.link} onClick={() => onMenu('')}>
              <h1 className={styles.title}>how</h1>
            </Link>
          </div>
          <ul className={styles.userInfo}>
            <li className={styles.userName}>{userInfo.nickname}</li>
            <li>
              <button
                className={`${styles.logout} ${styles.link}`}
                onClick={handleLogout}
              >
                로그아웃
                <FiLogOut className={styles.logoutIcon} />
              </button>
            </li>
          </ul>
        </div>
        <ul className={styles.menuBar}>
          <li>
            <Link
              to='/routine/list'
              className={`${styles.link} ${
                menu === '운동 루틴' && styles.selected
              }`}
              onClick={() => onMenu('운동 루틴')}
            >
              운동 루틴
            </Link>
          </li>
          <li>
            <Link
              to='/my/routine/list'
              className={`${styles.link} ${
                menu === '내 루틴' && styles.selected
              }`}
              onClick={() => onMenu('내 루틴')}
            >
              내 루틴
            </Link>
          </li>
          <li>
            <Link
              to='/live/list'
              className={`${styles.link} ${menu === 'live' && styles.selected}`}
              onClick={() => onMenu('live')}
            >
              live
            </Link>
          </li>
        </ul>
      </header>
    </>
  );
}
