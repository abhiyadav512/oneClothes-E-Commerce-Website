import { login, register, verifyOtp } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";

export const useLogin = ({ onError, onSuccess }={}) => {
  return useMutation({
    mutationFn: login,
    onSuccess,
    onError,
  });
};

export const useRegister = ({ onError, onSuccess }={}) => {
 return useMutation({
    mutationFn: register,
    onSuccess,
    onError,
  });
};

export const useVerifiedOtp = ({ onError, onSuccess }={}) => {
 return useMutation({
    mutationFn: verifyOtp,
    onSuccess,
    onError,
  });
};
