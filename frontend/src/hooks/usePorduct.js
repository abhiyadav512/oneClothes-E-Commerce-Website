import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getCategoryProducts,
  getProductById,
  searchProducts,
  updateProduct,
} from "@/api/productApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddProduct = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: addProduct,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};

export const useUpdateProduct = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: updateProduct,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};

export const useDelete = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: deleteProduct,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};

export const useCategory = (category) => {
  return useQuery({
    queryKey: ["Categories", category],
    queryFn: getCategoryProducts,
    refetchOnWindowFocus: false,
  });
};

export const useProductGetById = (ProdId) => {
  return useQuery({
    queryKey: ["product", ProdId],
    queryFn: getProductById,
    refetchOnWindowFocus: false,
  });
};

export const useSearchProducts = (query) => {
  return useQuery({
    queryKey: ["searchProducts", query],
    queryFn: () => searchProducts(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
