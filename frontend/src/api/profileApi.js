import axiosInstance from "@/lib/axiosInstance";

export const getAllcustomer = async () => {
  const res = await axiosInstance.get("/api/profile");
  return res.data;
};

export const handleUpdateRole = async ({ id, role }) => {
  const res = await axiosInstance.patch(`/api/profile/${id}`, { role });
  return res.data;
};

export const handleDeleteUser = async (id) => {
  const res = await axiosInstance.delete(`/api/profile/${id}`);
  return res.data;
};
