import HttpService from "./https";
import jwtDecode from "jwt-decode";
import Cookies from 'universal-cookie';
import { App } from "antd";
const cookies = new Cookies();
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";



const getAccessToken = () => {
  return `${window.localStorage.getItem(ACCESS_TOKEN_KEY)}`;
};
const getRefreshToken = () => {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

const setAccessToken = (token) => {
  return window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const resetAccessToken = (token) => {
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  return
};

const setRefreshToken = (refreshToken) => {
  return window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const claimNewToken = async () => {
  const payload = {
    token: getAccessToken(),
    refreshToken: getRefreshToken(),
  };
  await HttpService.get("refreshToken", payload).then((res) => {
    if (res) setAccessToken(res.data);
    return getAccessToken();
  });
};

const checkExistToken = () => {
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && token != "" && token != 'undefined') return true;
  return false;
};

const saveClaims = (token) => {
  const claims = jwtDecode(token); 
  return claims
};

const getClaims = ()=>{
  const claims = jwtDecode(getAccessToken()); 
  return claims
}

const jwt = {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  claimNewToken,
  checkExistToken,
  resetAccessToken,
  saveClaims,
  getClaims,
};
export default jwt;
