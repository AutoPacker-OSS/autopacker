import axios from 'axios';
import { getCookie } from './cookieService';

export const axiosRequest = (type, url, headers, data, callback, err) => {
  axios({
    method: type,
    url: url,
    headers: {
      Authorization: `${getCookie('Authorization')}`,
      ...headers,
    },
    data: data,
  })
    .then(callback)
    .catch(err);
};
