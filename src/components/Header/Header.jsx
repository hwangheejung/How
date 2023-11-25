import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import { FiLogOut } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../css/Header/Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { removeCookieToken } from "../../store/Cookie";
import { DELETE_USERINFO } from "../../store/loginRedux";
import { persistor } from "../..";
import { useState } from "react";
import { useEffect } from "react";
import { CiMenuBurger } from "react-icons/ci";

export default function Header({ menu, onMenu }) {
  const userInfo = useSelector((state) => state.userInfo);
  const [website, setWebsite] = useState(true);
  const [menubar, setMenubar] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(DELETE_USERINFO());
    persistor.purge();
    removeCookieToken();
    localStorage.removeItem("menu");
    navigate("/login");
  };
  useEffect(() => {
    if (window.outerWidth < 576) {
      setWebsite(!website);
    }
  }, [window.outerWidth]);

  const onClick = () => {
    setMenubar(!menubar);
  };
  return (
    <>
      <div className={styles.header}>
        {website ? (
          <div>
            <div className={styles.titleBox}>
              {/* <FontAwesomeIcon className={styles.icon} icon={faSeedling} /> */}
              <Link
                to="/"
                className={styles.linkTitle}
                onClick={() => onMenu("")}
              >
                <h1 className={styles.title}>how</h1>
              </Link>
              <div className={styles.userBoxLogout}>
                <div className={styles.userBox}>
                  <FaRegUser size="20" className={styles.userIcon} />
                  <span className={styles.userName}>{userInfo.nickname}</span>
                </div>
                <button
                  className={`${styles.logoutButton} ${styles.link}`}
                  onClick={handleLogout}
                >
                  <FiLogOut className={styles.logoutIcon} />
                  logout
                </button>
              </div>
            </div>
            <ul className={styles.menuBar}>
              <li>
                <Link
                  to="/routine/list"
                  className={`${styles.link} ${
                    menu === "운동 루틴" ? styles.selected : ""
                  }`}
                  onClick={() => onMenu("운동 루틴")}
                >
                  운동루틴
                </Link>
              </li>
              <li>
                <Link
                  to="/my/routine/list"
                  className={`${styles.link} ${
                    menu === "내 루틴" ? styles.selected : ""
                  }`}
                  onClick={() => onMenu("내 루틴")}
                >
                  my routine
                </Link>
              </li>
              <li>
                <Link
                  to="/live/list"
                  className={`${styles.link} ${
                    menu === "live" ? styles.selected : ""
                  }`}
                  onClick={() => onMenu("live")}
                >
                  how live
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <div className={styles.titleBox}>
              {/* <FontAwesomeIcon className={styles.icon} icon={faSeedling} /> */}
              <Link
                to="/"
                className={styles.linkTitle}
                onClick={() => onMenu("")}
              >
                <h1 className={styles.title}>how</h1>
              </Link>
              <div className={styles.userBoxLogout}>
                <div className={styles.userBox}>
                  <FaRegUser size="20" className={styles.userIcon} />
                  <span className={styles.userName}>{userInfo.nickname}</span>
                </div>
                <button
                  className={`${styles.logoutButton} ${styles.link}`}
                  onClick={handleLogout}
                >
                  <FiLogOut className={styles.logoutIcon} />
                  logout
                </button>
              </div>
            </div>

            <div className={styles.dropdown}>
              <button className={styles.dropbtn} onClick={onClick}>
                <CiMenuBurger />
              </button>
              <div>
                {menubar ? (
                  <ul className={styles.dropdowncontent}>
                    <li>
                      <a href="/routine/list">운동루틴</a>
                      {/* <Link
                      to="/routine/list"
                      // className={`${styles.link} ${
                      //   menu === "운동 루틴" ? styles.selected : ""
                      // }`}
                      onClick={() => onMenu("운동 루틴")}
                    >
                    운동루틴
                    </Link> */}
                    </li>
                    <li>
                      <a href="/my/routine/list">내 루틴</a>
                      {/* <Link
                      to="/my/routine/list"
                      // className={`${styles.link} ${
                      //   menu === "내 루틴" ? styles.selected : ""
                      // }`}
                      onClick={() => onMenu("내 루틴")}
                    >
                      my routine
                    </Link> */}
                    </li>
                    <li>
                      <a href="/live/list">how live</a>
                      {/* <Link
                      to="/live/list"
                      // className={`${styles.link} ${
                      //   menu === "live" ? styles.selected : ""
                      // }`}
                      onClick={() => onMenu("live")}
                      >
                      how live
                    </Link> */}
                    </li>
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
