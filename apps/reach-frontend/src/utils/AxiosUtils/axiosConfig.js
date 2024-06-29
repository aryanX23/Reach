import axios from 'axios';

const { VITE_SERVER_URL } = import.meta.env || {};

export default axios.create({
  baseURL: VITE_SERVER_URL
});

export const axiosPrivate = axios.create({
  baseURL: VITE_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});