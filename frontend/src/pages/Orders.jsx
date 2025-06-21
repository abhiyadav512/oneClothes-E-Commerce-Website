import React, { useState } from "react";
import { useMyOrders } from "@/hooks/useOrder";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

const Orders = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useMyOrders();
    const orders = data?.data || [];

    const [filterStatus, setFilterStatus] = useState("ALL");

    // console.log(data);

    // Filter orders by status
    const filteredOrders =
        filterStatus === "ALL"
            ? orders
            : orders.filter((order) => order.status === filterStatus);

    const totalOrders = filteredOrders.length;
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    const handleCancelOrder = async (orderId) => {
        // console.log(orderId);
        const reason = window.prompt("Why are you cancelling this order?");
        if (!reason) return;

        try {
            await axiosInstance.patch(`/api/orders/cancel/${orderId}`, { reason });
            toast.success("Order cancelled");
            queryClient.invalidateQueries(["myOrder"]);
        } catch (err) {
            toast.error(err.response?.data?.message || "Cancel failed");
            // console.log(err);
        }
    };

    return (
        <div className="px-4 py-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">My Orders</h1>

            <div className="mb-6 flex flex-wrap items-center gap-4">
                <label htmlFor="statusFilter" className="font-medium text-gray-700">
                    Filter by Status:
                </label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded px-3 py-1 text-gray-700"
                >
                    <option value="ALL">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            {/* Total Summary */}
            {!isLoading && !error && filteredOrders.length > 0 && (
                <div className="mb-6 text-gray-700">
                    <p className="text-sm md:text-base">
                        <strong>Total Orders:</strong> {totalOrders}
                    </p>
                    <p className="text-sm md:text-base">
                        <strong>Total Spent:</strong> ₹{totalAmount.toFixed(2)}
                    </p>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-md" />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <p className="text-red-500">Failed to load your orders. Please try again later.</p>
            )}
            {orders.length === 0 && (
                <div>
                    <p className="text-gray-600 text-sm">You don't have any orders. Shop now!</p>
                    <Button>
                        <Link to="/products">Shop</Link>
                    </Button>
                </div>
            )}

            {/* Filtered but empty (only if orders exist) */}
            {!isLoading && !error && data?.success !== false && orders.length > 0 && filteredOrders.length === 0 && (
                <p className="text-gray-600 text-sm">No orders found for selected status.</p>
            )}

            {/* Orders List */}
            <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                        <div className="flex justify-between flex-wrap text-sm text-gray-700">
                            <div>
                                <span className="font-medium">Order ID:</span> {order.id}
                            </div>
                            <div>
                                <span className="font-medium">Date:</span>{" "}
                                {format(new Date(order.createdAt), "dd MMM yyyy")}
                            </div>
                            <div>
                                <span className="font-medium">Total:</span> ₹{order.totalPrice}
                            </div>
                            <div>
                                <span className="font-medium">Status:</span>{" "}
                                <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${order.status === "PAID"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "SHIPPED"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="font-medium text-gray-800 mb-1">Items:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                {order.orderItems.map((item) => (
                                    <li key={item.id}>
                                        {item.product?.name} × {item.quantity} — ₹{item.price}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            onClick={() => handleCancelOrder(order.id)}
                        >
                            Cancel
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
