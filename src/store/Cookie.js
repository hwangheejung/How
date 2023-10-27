import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export function setUserToken(refreshToken) {
  const today = new Date();
  const expireDate = today.setDate(today.getDate() + 1);

  return cookies.set('userToken', refreshToken, {
    path: '/',
    expires: new Date(expireDate),
  });
}

export function getCookieToken() {
  return cookies.get('userToken');
}

export function removeCookieToken() {
  return cookies.remove('userToken', { path: '/' });
}
