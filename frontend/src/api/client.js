import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust base URL if needed
});

// Add a request interceptor to attach the JWT token
client.interceptors.request.use(
  (config) => {
    // Note: Since token state is strictly in-memory React Context,
    // we need to inject the token from the context.
    // The easiest way is to either pass it to client explicitly per request
    // or expose a helper in client.js to set it globally.
    // We will use a global variable here to hold the token for Axios to use.
    if (window.__APP_TOKEN__) {
      config.headers.Authorization = `Bearer ${window.__APP_TOKEN__}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to set token for Axios interceptor
export const setAuthToken = (token) => {
  if (token) {
    window.__APP_TOKEN__ = token;
  } else {
    delete window.__APP_TOKEN__;
  }
};

export default client;
