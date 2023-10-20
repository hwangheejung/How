import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LoginPage.module.css';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleId = (e) => {
    setId(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setId('');
    setPassword('');
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleBox}>
        <FontAwesomeIcon className={styles.icon} icon={faSeedling} />
        <h1 className={styles.title}>how</h1>
      </div>
      <forma className={styles.inputForm}>
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
      </forma>
    </div>
  );
}
