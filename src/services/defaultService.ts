import { AxiosInstance, AxiosRequestConfig } from 'axios';
import api from './api';

class DefaultService {
  public api: AxiosInstance;

  constructor() {
    this.api = api;
  }

  async get(url: string, errorResponse = {}) {
    try {
      const result = await this.api.get(url);
      return result.data?.data;
    } catch (error) {
      return errorResponse;
    }
  }

  async post(url: string, data = {}, errorResponse = {}) {
    try {
      const result = await this.api.post(url, data);
      return result.data?.data;
    } catch (error) {
      const result = {
        error: error.response && error.response.data ? error.response.data?.message : [error.message],
        data: error.response && error.response.data ? error.response.data?.data : errorResponse,
      };
      return result;
    }
  }

  async put(url: string, data = {}, errorResponse = {}) {
    try {
      const result = await this.api.put(url, data);
      return result.data?.data;
    } catch (error) {
      const result = {
        error: error.response && error.response.data ? error.response.data?.message : [error.message],
        data: error.response && error.response.data ? error.response.data?.data : errorResponse,
      };
      return result;
    }
  }

  async delete(url: string, data: any = undefined, errorResponse = {}) {
    try {
      const config: AxiosRequestConfig | undefined = data ? { ...this.api.defaults, data } : undefined;
      const result = await this.api.delete(url, config);
      return result.data?.data;
    } catch (error) {
      return errorResponse;
    }
  }
}

export default new DefaultService();
