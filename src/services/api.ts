import axios, { AxiosInstance } from 'axios';
import { sls } from 'utils/StorageUtils';
import Constants from '../utils/Constants';

const { token } = sls.getItem(Constants.storage.TOKEN) || {};

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ROOT,
  headers: {
    Authorization: token,
    locale: sls.getItem(Constants.storage.LANG),
  },
});

api.interceptors.request.use(
  function (config) {
    const { token } = sls.getItem(Constants.storage.TOKEN) || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const message = error.response && error.response.data ? error.response.data.message : [];

    if (message.includes(Constants.message.INVALID_TOKEN)) {
      sls.removeItem(Constants.storage.TOKEN);
      sls.removeItem(Constants.storage.LOGGED);
      sls.removeItem(Constants.storage.LANG);
      window.location.href = window.location.origin;
    }

    return Promise.reject(error);
  },
);

export default api;
