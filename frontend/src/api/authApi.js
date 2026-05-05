import axiosInstance from "./axiosInstance";

export const signup = async (data) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const signin = async (data) => {
  const response = await axiosInstance.post("/auth/signin", data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyOTP = async (data) => {
  const response = await axiosInstance.post("/auth/verify-otp", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

export const googleAuth = async (data) => {
  const response = await axiosInstance.post("/auth/google-auth", data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
