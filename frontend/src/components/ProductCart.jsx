import React, { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";

const ProductCart = ({ product }) => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector(state => state.wishlist.items);
    const isWishlisted = wishlistItems.includes(product.id);

    // console.log(product);
    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        dispatch(toggleWishlistItem(product.id));
    };

    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div
            onClick={handleNavigate}
            className="w-full max-w-4xl mx-auto p-4 sm:p-5 border-gray-100 bg-gray-50 border-2">
            <div className="relative">
                <div className="aspect-square bg-gray-100  overflow-hidden group">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">New</Badge>}
                        {product.isTrending && <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">Trending</Badge>}
                        {product.discount && (
                            <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">-{product.discount}%</Badge>
                        )}
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full w-6 h-6"
                        onClick={handleWishlistToggle}
                    >
                        <Heart
                            fill={isWishlisted ? "currentColor" : "none"}
                            className={isWishlisted ? "text-red-500 " : "text-gray-600"}
                        />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col justify-between gap-4 text-sm">
                <div className="space-y-2">
                    <CardHeader className="p-0">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {product.name}
                        </CardTitle>
                    </CardHeader>

                    <div className="flex items-center gap-1 text-gray-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="text-gray-300" />
                        ))}
                        <span className="text-xs ml-1">No reviews</span>
                    </div>

                    <div className="flex justify-between items-center font-semibold text-gray-900 text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                            <span>${product.price}</span>
                            {product.originalPrice && (
                                <span className="line-through text-gray-400 text-xs">${product.originalPrice}</span>
                            )}
                        </div>
                        <span
                            className={
                                product.stock > 0 ? "text-green-600 text-xs sm:text-sm" : "text-red-600 text-xs sm:text-sm"
                            }
                        >
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCart;
