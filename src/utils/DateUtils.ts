import moment from 'moment-timezone';
moment.tz.setDefault(process.env.REACT_APP_TZ || 'America/Sao_Paulo');

const formatDate = (date = new Date(), format = 'DD/MM/YYYY HH:mm'): string => {
  return moment(date).format(format);
};

export { formatDate };
