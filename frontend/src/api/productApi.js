import axiosInstance from "@/lib/axiosInstance";

export const getAllProducts = async () =>
  await axiosInstance.get("/api/products");

export const getCategoryProducts = async ({ queryKey }) => {
  const [, category] = queryKey;
  const response = await axiosInstance.get(`/api/products/category/${category}`);
  return response.data;
};

export const addProduct = async (data) =>
  await axiosInstance.post("/api/products", data);

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return await axiosInstance.post("/api/products/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = async ({ id, data }) =>
  await axiosInstance.put(`/api/products/${id}`, data);

export const deleteProduct = async (id) =>
  await axiosInstance.delete(`/api/products/${id}`);

export const getProductById = async ({ queryKey }) => {
  const [, ProdId] = queryKey;
  const response = await axiosInstance.get(`api/products/${ProdId}`);
  return response;
};


export const searchProducts = async (query) => {
  const res = await axiosInstance.get(
    `/api/products/search?query=${encodeURIComponent(query)}`
  );
  return res.data; 
};
