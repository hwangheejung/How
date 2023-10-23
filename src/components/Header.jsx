import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/Header.module.css';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      <header>
        <div className={styles.navbar}>
          <div className={styles.titleBox}>
            <FontAwesomeIcon className={styles.icon} icon={faSeedling} />
            <Link to='/' className={styles.link}>
              <h1 className={styles.title}>how</h1>
            </Link>
          </div>
          <ul className={styles.userInfo}>
            <li className={styles.userName}>홍길동</li>
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
            <Link to='/routine/list' className={styles.link}>
              운동 루틴
            </Link>
          </li>
          <li>
            <Link to='/my/routine/list' className={styles.link}>
              내 루틴
            </Link>
          </li>
          <li>
            <Link to='/live/list' className={styles.link}>
              live
            </Link>
          </li>
        </ul>
      </header>
    </>
  );
}
