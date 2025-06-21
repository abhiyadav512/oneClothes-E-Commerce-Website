import axiosInstance from "@/lib/axiosInstance";

export const register = async (data) => {
  const response = await axiosInstance.post("/api/auth/singup", data);
  return response.data;
};
export const login = async (data) => {
  const response = await axiosInstance.post("/api/auth/singin", data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await axiosInstance.post("/api/auth/verify-otp", data);
  return response.data;
};
