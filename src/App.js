import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import { useEffect } from 'react';
import { getCookieToken } from './store/Cookie';
import { useDispatch } from 'react-redux';
import { DELETE_USERINFO } from './store/loginRedux';
import { persistor } from '.';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!getCookieToken()) {
      dispatch(DELETE_USERINFO());
      persistor.purge();
      localStorage.removeItem('menu');
      navigate('/login');
    } else {
      if (
        !JSON.parse(JSON.parse(localStorage.getItem('persist:root')).userInfo)
          .nickname
      ) {
        navigate('/login');
      }
    }
  }, [getCookieToken()]);

  if (
    window.location.pathname === '/' ||
    window.location.pathname === '/calendar'
  ) {
    localStorage.setItem('menu', '');
  } else if (window.location.pathname === '/routine/list') {
    localStorage.setItem('menu', '운동 루틴');
  } else if (window.location.pathname === '/my/routine/list') {
    localStorage.setItem('menu', '내 루틴');
  } else if (window.location.pathname === '/live/list') {
    localStorage.setItem('menu', 'live');
  }

  const handleMenu = (value) => {
    localStorage.setItem('menu', value);
  };

  return (
    <div className='container'>
      <Header menu={localStorage.getItem('menu')} onMenu={handleMenu} />
      <div className='main'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
