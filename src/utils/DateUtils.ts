import moment from 'moment-timezone';
moment.tz.setDefault(process.env.REACT_APP_TZ || 'America/Sao_Paulo');

const formatDate = (date = new Date(), format = 'DD/MM/YYYY HH:mm'): string => {
  return moment(date).format(format);
};

const getAttributeValue = (obj: any, path: string) => {
  return path
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.')
    .reduce((acc, part) => acc && acc[part], obj);
};

const setAttributeValue = (obj: any, path: string, value: any) => {
  let i;
  const a = path.replace(/^\./, '').split('.');
  for (i = 0; i < a.length - 1; i++) {
    if (!obj[a[i]]) {
      obj[a[i]] = {};
    }
    obj = obj[a[i]];
  }

  obj[a[i]] = value;
};

const fieldsToObject = (data) => {
  const keys = Object.keys(data);
  const result: any = {};

  keys.forEach((key) => {
    setAttributeValue(result, key, data[key]);
  });

  return result;
};

const objectToFields = (object, objectPath) => {
  const keys = Object.keys(objectPath);
  const result = {};

  keys.forEach((key) => {
    result[key] = getAttributeValue(object, key);
  });

  return result;
};

export { formatDate, getAttributeValue, setAttributeValue, fieldsToObject, objectToFields };
