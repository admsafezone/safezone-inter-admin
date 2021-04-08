import moment from 'moment-timezone';
import { set as objectSet, get as objectGet } from 'lodash';
moment.tz.setDefault(process.env.REACT_APP_TZ || 'America/Sao_Paulo');

const formatDate = (date = new Date(), format = 'DD/MM/YYYY HH:mm'): string => {
  return moment(date).format(format);
};

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getAttributeValue = (obj = {}, path: string): any => {
  return objectGet(obj, path);
};

const setAttributeValue = (obj = {}, path: string, value: unknown): any => {
  return objectSet(obj, path, value);
};

const fieldsToObject = (data = {}): any => {
  const keys = Object.keys(data);
  const result: any = {};

  keys.forEach((key) => {
    setAttributeValue(result, key, data[key]);
  });

  return result;
};

const objectToFields = (object = {}, objectPath = {}): any => {
  const keys = Object.keys(objectPath);
  const result = {};

  keys.forEach((key) => {
    result[key] = getAttributeValue(object, key);
  });

  return result;
};

export { formatDate, getAttributeValue, setAttributeValue, fieldsToObject, objectToFields, formatBytes };
