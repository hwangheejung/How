import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import styles from '../../css/Login/LoginPage.module.css';
import axios from 'axios';
import { setUserToken } from '../../store/Cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_USERINFO } from '../../store/loginRedux';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleId = (e) => {
    setId(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (id.trim().length === 0) {
      alert('아이디를 입력해주세요.');
      setId('');
      return;
    } else if (password.trim().length === 0) {
      alert('비밀번호를 입력해주세요.');
      setPassword('');
      return;
    } else {
      axios
        .post(`https://52.78.0.53.sslip.io/api/users/login`, {
          userId: id,
          password: password,
        })
        .then((res) => {
          if (res.data.code === 1000) {
            setUserToken(res.data.result.jwt);
            dispatch(SET_USERINFO(res.data.result));
            alert('로그인이 완료되었습니다.');
            navigate('/');
          } else if (res.data.code === 3014) {
            // 로그인 정보 없어지는 코드 추가
            alert(res.data.message);
          }
          setId('');
          setPassword('');
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleBox}>
        <FontAwesomeIcon className={styles.icon} icon={faSeedling} />
        <h1 className={styles.title}>how</h1>
      </div>
      <form className={styles.inputForm}>
        <input
          className={styles.inputId}
          type='text'
          placeholder='Id'
          value={id}
          onChange={handleId}
        />
        <input
          className={styles.inputPassword}
          type='text'
          placeholder='Password'
          value={password}
          onChange={handlePassword}
        />
        <button className={styles.loginButton} onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
