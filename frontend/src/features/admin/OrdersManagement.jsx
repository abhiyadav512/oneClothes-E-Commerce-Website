import React, { useState } from "react";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useOrder";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import OrderCardAdmin from "./OrderCardAdmin"; // You'll build this similar to UserCardAdmin

const OrdersManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useAllOrders();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const orders = data?.data || [];
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";



  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateOrderMutation = useUpdateOrderStatus({
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update order status");
    },
  });

  const handleStatusChange = ({ orderId, status }) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  return (
    <div className="space-y-6 px-4 py-6 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Orders Management</h1>
        <div className="text-sm text-gray-600">
          Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 border px-3 py-2 rounded text-sm text-gray-700"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          placeholder="Search by user name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-60 border px-3 py-2 rounded text-sm text-gray-700"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-md" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-600">Failed to load orders.</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-gray-500 text-sm">No orders found matching the filters.</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCardAdmin
              key={order.id}
              order={order}
              isAdmin={isAdmin}
              onStatusChange={handleStatusChange}
              isUpdating={updateOrderMutation.isLoading && updateOrderMutation.variables?.orderId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
