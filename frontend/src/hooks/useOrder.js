import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../api/orderApi";
import { useSelector } from "react-redux";

// export const useCreateOrder = ({ onSuccess, onError } = {}) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createOrder,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["myOrder"]);
//       onSuccess?.(data);
//     },
//     onError,
//   });
// };

export const useMyOrders = () => {
  const { user } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ["myOrder"],
    queryFn: getMyOrders,
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateOrderStatus = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["orders"]);
      onSuccess?.(data);
    },
    onError,
  });
};
