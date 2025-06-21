import axiosInstance from "@/lib/axiosInstance";

export const addToCart = async (item) => {
  const res = await axiosInstance.post("/api/cart", item);
  return res.data;
};

export const getCartItems = async () => {
  const res = await axiosInstance.get("/api/cart");
  return res.data;
};

export const updateCart = async ({ id, quantity }) => {
  const res = await axiosInstance.patch(`/api/cart/${id}`, { quantity });
  return res.data;
};

export const deleteCartItem = async (id) => {
  const res = await axiosInstance.delete(`/api/cart/${id}`);
  return res.data;
};
