import axios, { AxiosInstance } from 'axios';
import { sls } from 'utils/StorageUtils';
import Constants from 'utils/Constants';
import i18n, { getCurrentLang } from 'i18n';

const { token } = sls.getItem(Constants.storage.TOKEN) || {};
const csrfMethods = ['post', 'put', 'delete'];
let hasRefresh = false;

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_ROOT}/api`,
  headers: {
    Authorization: `Bearer ${token}`,
    locale: getCurrentLang(),
  },
});

const refreshToken = async () => {
  try {
    hasRefresh = true;
    const response = await api.post(Constants.api.REFRESH);
    const { data } = response.data;
    sls.setItem(Constants.storage.TOKEN, data);
    hasRefresh = false;
    return data.token;
  } catch (error) {
    hasRefresh = false;
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
    const tokenObj = sls.getItem(Constants.storage.TOKEN);
    config.headers.Authorization = config.headers.noToken || !tokenObj ? '' : `Bearer ${tokenObj.token}`;

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
      let newToken = true;

      if (!hasRefresh) {
        newToken = await refreshToken();
      } else {
        await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
      }

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
