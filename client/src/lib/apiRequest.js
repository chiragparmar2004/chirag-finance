// apiRequest.js
import axios from "axios";
import axiosRetry from "axios-retry";
import getUserToken from "./getUserToken";

const apiRequest = () => {
  // Get the user token
  const userToken = getUserToken();
  // console.log(userToken);

  // Create Axios instance with user token
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api`,
    withCredentials: true,
    headers: {
      Authorization: userToken ? `Bearer ${userToken}` : undefined,
    },
  });
  // Configure axios-retry to retry a request up to 3 times with exponential delay
  axiosRetry(instance, {
    retries: 3,
    retryDelay: (retryCount) => {
      console.log(`Retry attempt: ${retryCount}`);
      return retryCount * 1000; // Exponential backoff: 1s, 2s, 3s
    },
    retryCondition: (error) => {
      // Retry on network errors or 5xx status codes
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response && error.response.status >= 500)
      );
    },
  });

  return instance;
};

export default apiRequest;
