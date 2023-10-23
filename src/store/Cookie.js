import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export function setRefreshToken(refreshToken) {
  const today = new Date();
  const expireDate = today.setDate(today.getDate() + 1);

  return cookies.set('refresh_token', refreshToken, {
    path: '/',
    expires: new Date(expireDate),
    sameSite: 'strict',
  });
}

export function getCookieToken() {
  return cookies.get('refresh_token');
}

export function removeCookieToken() {
  return cookies.remove('refresh_token'), { path: '/', sameSite: 'strict' };
}
