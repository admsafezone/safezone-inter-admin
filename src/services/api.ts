import axios, { AxiosInstance } from 'axios';
import { sls } from 'utils/StorageUtils';
import Constants from 'utils/Constants';
import i18n, { getCurrentLang } from 'i18n';

const csrfMethods = ['post', 'put', 'delete'];
const api: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_ROOT}${process.env.REACT_APP_API_PATH}`,
  withCredentials: true,
  headers: { locale: getCurrentLang() },
});

const refreshToken = async () => {
  try {
    const response = await api.post(Constants.api.REFRESH);
    const { data } = response.data;
    sls.setItem(Constants.storage.TOKEN, data);
    return data.token;
  } catch (error) {
    return false;
  }
};

const getCsrfToken = async (request) => {
  try {
    const response = await api.post(Constants.api.CSRF, { url: request.url, method: request.method });
    return response.headers['x-csrf-token'];
  } catch (error) {
    return '';
  }
};

api.interceptors.request.use(
  async function (config) {
    config.withCredentials = !config.headers.noToken;
    config.headers.locale = getCurrentLang();

    if (
      csrfMethods.includes(config.method || '') &&
      !config.url?.includes(Constants.api.CSRF) &&
      !config.url?.includes(Constants.api.AUTH) &&
      !config.url?.includes(Constants.api.REFRESH)
    ) {
      config.headers['x-xsrf-token'] = await getCsrfToken(config);
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

    if (message.includes(i18n.t(Constants.message.EXPIRED_TOKEN))) {
      const newToken = await refreshToken();

      if (!newToken) {
        sls.removeItem(Constants.storage.TOKEN);
        sls.removeItem(Constants.storage.USER);
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
