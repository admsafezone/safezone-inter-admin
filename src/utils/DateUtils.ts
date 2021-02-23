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

export { formatDate, getAttributeValue, setAttributeValue };
