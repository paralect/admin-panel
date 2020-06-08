import moment from 'moment';

const DATE_FORMATS = {
  DATE: 'DD.MM.YYYY',
};

export const getDate = (date = Date.now()) => {
  return moment(date).format(DATE_FORMATS.DATE);
};
