// getToken.js
const getUserToken = () => {
  // Your logic to retrieve the user token
  // For example, you might retrieve it from localStorage or sessionStorage
  const token = JSON.parse(localStorage.getItem("user"));
  const userToken = token.token;
  return userToken; // Example: Retrieving from localStorage
};

export default getUserToken;
