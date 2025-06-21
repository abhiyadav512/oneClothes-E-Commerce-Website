import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  getCartItems,
  updateCart,
  deleteCartItem,
} from "@/api/cartApi";

export const useGetCartItems = (options={}) => {
  return useQuery({
    queryKey: ["Carts"],
    queryFn: getCartItems,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useAddCart = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: addToCart,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};

export const useUpdateCartItem = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateCart,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};

export const useDeleteCartItem = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: deleteCartItem,
    refetchOnWindowFocus: false,
    onError,
    onSuccess,
  });
};
