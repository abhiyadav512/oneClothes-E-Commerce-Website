import React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const OrderCardAdmin = ({ order, isAdmin, onStatusChange, isUpdating }) => {
    return (
        <div className="border p-4 rounded-md bg-white shadow-sm space-y-4">
            {/* Header Info */}
            <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-700">
                <div>
                    <span className="font-semibold text-gray-900">Order ID:</span> {order.id}
                </div>
                <div>
                    <span className="font-semibold text-gray-900">Date:</span>{" "}
                    {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                </div>
                <div>
                    <span className="font-semibold text-gray-900">Total:</span> ₹{order.totalPrice.toFixed(2)}
                </div>
                <div>
                    <span className="font-semibold text-gray-900">Customer:</span> {order.user.name}
                </div>
                <div>
                    <span className="font-semibold text-gray-900">Email:</span>{" "}
                    <span className="text-blue-600">{order.user.email}</span>
                </div>
            </div>

            {/* Items */}
            <div className="bg-gray-50 border rounded-md p-3">
                <p className="font-medium text-gray-800 mb-2">Items:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {order.orderItems.map((item) => (
                        <li key={item.id}>
                            {item.product?.name} × {item.quantity} — ₹{item.price}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Status & Action */}
            {order.status !== "CANCELLED" ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Status:</span>
                        {isAdmin ? (
                            <select
                                value={order.status}
                                onChange={(e) =>
                                    onStatusChange({ orderId: order.id, status: e.target.value })
                                }
                                disabled={isUpdating}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="PAID">Paid</option>
                                <option value="SHIPPED">Shipped</option>
                            </select>
                        ) : (
                            <Badge variant="outline">{order.status}</Badge>
                        )}
                    </div>

                    {isUpdating && <span className="text-blue-600 text-sm">Updating status...</span>}
                </div>
            ) : (
                <div className="flex flex-col gap-1 p-2 bg-red-50 rounded border border-red-200">
                    <span className="font-medium text-red-600">Status: CANCELLED</span>
                    <span className="text-sm text-red-700">
                            Reason: {order.cancellationReason || "No reason provided"}
                    </span>
                </div>
            )}

        </div>
    );
};

export default OrderCardAdmin;
