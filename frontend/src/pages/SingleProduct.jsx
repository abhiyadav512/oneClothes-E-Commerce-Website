import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { useProductGetById } from "@/hooks/usePorduct";
import ProductPageSkeleton from "@/features/skeleton/ProductPageSkeleton";
import { useAddCart } from "@/hooks/useCart";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
// import { useCreateOrder } from "@/hooks/useOrder";

const SingleProduct = () => {
    const queryClient = useQueryClient();
    const { ProdId } = useParams();
    const [selectSize, setSelectSize] = useState(null)
    const [quantity, setQuantity] = useState(1);
    const { data, isLoading, error } = useProductGetById(ProdId);
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    const wishlistItems = useSelector(state => state.wishlist.items);
    const user = useSelector((state) => state.auth.user);
    const isWishlisted = wishlistItems.includes(ProdId);

    const product = data?.data.data;



    // const createOrderMutation = useCreateOrder({
    //     onSuccess: (data) => {
    //         toast.success("Order placed successfully!");
    //         // Optionally: navigate to order summary page
    //     },
    //     onError: (error) => {
    //         toast.error(error?.response?.data?.message || "Failed to place order.");
    //     }
    // });

    const handleBuyNow = async () => {
        if (!token) {
            toast.error("Please login to place an order.");
            return;
        }

        if (!selectSize) {
            toast.error("Please select a size.");
            return;
        }

        try {
            // Step 1: Create Order (Your existing API)
            const { data } = await axiosInstance.post(
                "/api/orders/create-order", // Or use axiosInstance if you configured one
                {
                    productId: ProdId,
                    quantity,
                    selectedSize: selectSize,
                });

            const { order, rezorpayOrder } = data;
            // console.log(data);
            // Step 2: Open Razorpay popup
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your test Razorpay key
                amount: rezorpayOrder.amount,
                currency: "INR",
                name: "OneClothes",
                description: "Product Purchase",
                order_id: rezorpayOrder.id,
                handler: async function (response) {
                    // console.log(response);
                    // Step 3: Verify Payment
                    try {
                        const verifyRes = await axiosInstance.post(
                            "/api/orders/verify-payment",
                            {
                                orderId: order.id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            });

                        if (verifyRes.data.success) {
                            toast.success("🎉 Payment successful!");
                        } else {
                            toast.error("⚠️ Payment verification failed.");
                        }
                    } catch (err) {
                        toast.error("Payment verification error");
                        console.error(err);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#000",
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create order");
            // console.error(error);
        }
    };


    const useAddMutation = useAddCart({
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries(["Carts"]);
        },
        onError: (err) => {
            // console.log(err);
            toast.error(err?.response?.data?.message || 'Error while adding into cart.');
        }
    })

    const HandleAddToCart = () => {
        const cartData = {
            productId: ProdId,
            quantity,
            selectedSize: selectSize,
        };
        useAddMutation.mutate(cartData);
        // console.log("Adding to cart:", cartData);
    }

    const handleWishlistToggle = () => {
        dispatch(toggleWishlistItem(ProdId));
    };
    useEffect(() => {
        if (product?.sizes?.length && !selectSize) {
            setSelectSize(product.sizes[0]);
        }
    }, [product, selectSize]);

    if (isLoading) {
        return (
            <ProductPageSkeleton />
        );
    }
    if (error || !product) {
        return (
            <div className="px-4 py-6 max-w-6xl mx-auto text-red-500">
                Error loading product.
            </div>
        );
    }
    return (
        <div className="px-4 py-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image */}
            <div className="w-full">
                <div className="aspect-square bg-gray-100  overflow-hidden">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src =
                                "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                    />
                </div>
            </div>

            {/* Info */}
            <div className="space-y-5 text-gray-800">
                <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>

                {product.description && (
                    <p className="text-gray-600 text-sm">{product.description}</p>
                )}

                {/* Price & Stock */}
                <div className="flex items-center justify-between text-lg font-medium">
                    <div className="flex items-center gap-2">
                        <span>₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="line-through text-gray-400 text-sm">
                                ₹{product.originalPrice}
                            </span>
                        )}
                    </div>
                    <span
                        className={
                            product.stock > 0 ? "text-green-600 text-sm" : "text-red-600"
                        }
                    >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Available Sizes:</p>
                        <div className="flex gap-2 flex-wrap">
                            {product.sizes.map((size) => (
                                <Badge key={size} variant={'outline'}
                                    onClick={() => setSelectSize(size)}
                                    className={`cursor-pointer ${selectSize === size
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border '
                                        }`}
                                >
                                    {size}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-medium text-gray-800 mb-1 text-center">Qty</h3>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                                className="h-8 w-8"
                            >-</Button>
                            <span className="w-8 text-center">{quantity}</span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                disabled={quantity >= product.stock}
                                className="h-8 w-8"
                            >+</Button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-gray-300" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">No reviews yet</span>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                    <Button
                        onClick={HandleAddToCart}
                    >Add to Cart</Button>

                    <Button variant="outline" onClick={handleBuyNow}>Buy</Button>

                    <Button variant="outline" onClick={handleWishlistToggle}>
                        <Heart
                            className={`w-4 h-4 mr-1 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
                                }`}
                        />
                        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;