import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import styles from '../css/LoginPage.module.css';
import axios from 'axios';

export default function LoginPage() {
  // const apiURL = `http://127.0.0.1:8080`;

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

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
    }
    // else {
    //   axios
    //     .post(`/api/users/login`, {
    //       userId: id,
    //       password: password,
    //     })
    //     .then((res) => {
    //       console.log(res.data);
    //       setId('');
    //       setPassword('');
    //     });
    // }
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
