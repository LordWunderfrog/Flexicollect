/**
 * API component
 *
 * This component is used to send request and receive the response from API Server.
 * Request Interceptor will add token in every request
 * Response Interceptor will check for 401 response code to redirect to login page
 */
import axios from "axios";

const fetchClient = () => {
  // Create instance
  let instance = axios.create({
    baseURL: "https://devapi.flexicollect.com/",
    headers: {
      "Content-type": "application/json"
    }
  });

  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('api_key');
    const username = localStorage.getItem('username');
    config.headers.Auth = token ? `${token}` : '';
    config.headers.username = username ? `${username}` : '';
    return config;
  });

  instance.interceptors.response.use(response => {
    return response;
  }, error => {
    if (error.response && error.response.status && error.response.status === 401) {
      localStorage.removeItem("api_key");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return window.location.href = '/';
    }
    return error;
  });

  return instance;
};

export default fetchClient();
