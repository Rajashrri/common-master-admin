import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/auth`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// STEP 1: LOGIN
export const loginUser = (data) => {
  return API.post("/login", data);
};

// STEP 2: VERIFY OTP
export const verifyOtp = (data) => {
  return API.post("/verify-otp", data);
};

// FORGOT PASSWORD
export const forgotPassword = (data) => {
  return API.post("/forgot-password", data);
};

// RESET PASSWORD
export const resetPassword = (data) => {
  return API.post("/reset-password", data);
};

export default API;