import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    ShoppingCart,
    LogOut,
    Settings,
    Heart,
    Phone,
    Mail,
    Edit3,
    Package,
    Clock,
    LogIn,
} from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { useMyOrders } from "@/hooks/useOrder";

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const wishlistItemsCount = useSelector((state) => state.wishlist.items.length);

    const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useMyOrders();
    const orders = ordersData?.data || [];

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };


    // Replace totalOrders with real count from fetched orders
    const totalOrders = orders.length;

    const quickActions = [
        {
            title: "My Orders",
            description: "View order history & track packages",
            icon: ShoppingCart,
            link: "/orders",
            color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
            iconColor: "text-blue-600",
        },
        {
            title: "Wishlist",
            description: "Items you want to buy later",
            icon: Heart,
            link: "/favorite",
            color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
            iconColor: "text-pink-600",
        },
    ];

    const activityFeed = [
        { action: "Order placed", details: "MacBook Pro 16-inch", time: "2 hours ago", icon: ShoppingCart },
        { action: "Item added to wishlist", details: "iPhone 15 Pro", time: "1 day ago", icon: Heart },
        { action: "Profile updated", details: "Changed shipping address", time: "3 days ago", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
                {!user ? (
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">You are not logged in</h1>
                        <Button variant="outline" asChild>
                            <Link to="/login">
                                <LogIn size={12} />
                                Login
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                            <p className="text-gray-600">Manage your account and view your activity</p>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <User size={32} className="text-white" />
                                    </div>
                                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                        <Edit3 size={14} className="text-gray-600" />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{user?.name || "Guest"}</h2>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Mail size={14} />
                                                    <span>{user?.email || "guest@example.com"}</span>
                                                </div>
                                                {user?.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone size={14} />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span className="hidden sm:inline">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {ordersLoading ? "Loading..." : ordersError ? "Error" : totalOrders}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Package size={20} className="text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Wishlist</p>
                                        <p className="text-2xl font-bold text-gray-900">{<p className="text-2xl font-bold text-gray-900">{wishlistItemsCount}</p>
                                        }</p>
                                    </div>
                                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                        <Heart size={20} className="text-pink-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={index}
                                            to={action.link}
                                            className={`${action.color} border rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-md hover:scale-105 group block`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <Icon size={24} className={action.iconColor} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                                                        {action.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{action.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Activity */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                                <button className="text-blue-600 hover:text-blue-700 px-3 py-1 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {activityFeed.map((activity, index) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Icon size={16} className="text-gray-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">{activity.action}</p>
                                                <p className="text-sm text-gray-600 truncate">{activity.details}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                                                <Clock size={12} />
                                                <span>{activity.time}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
