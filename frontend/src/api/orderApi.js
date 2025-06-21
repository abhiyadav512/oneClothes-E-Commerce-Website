import axiosInstance from "@/lib/axiosInstance";

export const createOrder = async (orderData = {}) => {
  const response = await axiosInstance.post("/api/orders", orderData);
  return response.data;
};
  
export const getMyOrders = async () => {
  const response = await axiosInstance.get("/api/orders/my");
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axiosInstance.get("/api/orders/all-orders");
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.patch(`/api/orders/${orderId}`, { status });
  return response.data;
};
