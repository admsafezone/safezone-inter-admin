import axios, { AxiosInstance } from 'axios';
import { sls } from 'utils/StorageUtils';
import Constants from 'utils/Constants';
import i18n, { getCurrentLang } from 'i18n';

const { token } = sls.getItem(Constants.storage.TOKEN) || {};

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ROOT,
  headers: {
    Authorization: token,
    locale: getCurrentLang('api'),
  },
});

const refreshToken = async () => {
  try {
    const response = await api.post(Constants.api.REFRESH);
    const { data } = response.data;
    console.log(data);
    sls.setItem(Constants.storage.TOKEN, data);
    return data.token;
  } catch (error) {
    console.log(error);
    return false;
  }
};

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
  async function (error) {
    const message = error.response && error.response.data ? error.response.data.message : [];

    if (message.includes(i18n.t(Constants.message.INVALID_TOKEN))) {
      const newToken = await refreshToken();

      if (!newToken) {
        sls.removeItem(Constants.storage.TOKEN);
        sls.removeItem(Constants.storage.LOGGED);
        sls.removeItem(Constants.storage.LANG);
        window.location.href = window.location.origin;
      } else {
        return await api.request(error.config);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
