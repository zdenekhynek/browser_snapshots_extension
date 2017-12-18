import moment from 'moment';

export default function() {
  return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}
