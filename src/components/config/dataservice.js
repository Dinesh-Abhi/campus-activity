import axios from 'axios';
// import { getItem } from '../../utility/localStorageControl';

const API_ENDPOINT = import.meta.env.VITE_APP_API_URL;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

const client = axios.create({
  baseURL: API_ENDPOINT,
  headers: {  
    'Content-Type': 'application/json',
  },
});

class DataService {
  static get(path = '') {
    return client({
      method: 'GET',
      url: path,
      headers: { ...authHeader() },
    });
  }

  static post(path = '', data = {}, optionalHeader = {}) {
    return client({
      method: 'POST',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader },
    });
  }

  static patch(path = '', data = {}) {
    return client({
      method: 'PATCH',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static put(path = '', data = {}) {
    return client({
      method: 'PUT',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static download(path = '', responseType = 'blob') {
    return client({
      method: 'GET',
      url: path,
      headers: { ...authHeader() },
      responseType,
    });
  }

  static postMultipart(path = '', formDataFields = {}, optionalHeader = {}) {
  return client({
    method: 'POST',
    url: path,
    data: formDataFields,
    headers: {
      ...authHeader(),
      ...optionalHeader,
      'Content-Type': 'multipart/form-data'  
    },
  });
}
}


/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use((config) => {
  // do something before executing the request
  // For example tag along the bearer access token to request header or set a cookie
  const requestConfig = config;
  const { headers } = config;
  requestConfig.headers = { ...headers, Authorization: `Bearer ${localStorage.getItem('access_token')}` };

  return requestConfig;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    /**
     * Do something in case the response returns an error code [3**, 4**, 5**] etc
     * For example, on token expiration retrieve a new access token, retry a failed request etc
     */
    const { response } = error;
    const originalRequest = error.config;
    if (response) {
      if (response.status === 500) {
        // do something here
      } else {
        return originalRequest;
      }
    }
    return Promise.reject(error);
  },
);
export { DataService };
