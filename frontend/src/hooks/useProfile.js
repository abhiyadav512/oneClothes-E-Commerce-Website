import {
  getAllcustomer,
  handleDeleteUser,
  handleUpdateRole,
} from "@/api/profileApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllProfile = () => {
  return useQuery({
    queryFn: ["customer"],
    queryFn: getAllcustomer,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateRole = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: handleUpdateRole,
    onSuccess,
    onError,
  });
};

export const useDeleteUser = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: handleDeleteUser,
    onSuccess,
    onError,
  });
};
