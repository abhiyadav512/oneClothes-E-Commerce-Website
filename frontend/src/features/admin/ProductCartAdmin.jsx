import React from "react";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductCartAdmin = ({ product, onEdit, onDelete }) => {
    return (
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 px-4 py-3 border  bg-white shadow-sm hover:shadow-md transition text-sm">

            {/* Image */}
            <div className="w-16 h-16 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"

                />
            </div>

            {/* Name */}
            <div className="min-w-[120px] font-semibold text-gray-900 truncate">
                {product.name}
            </div>

            {/* Description */}
            <div className="hidden lg:block text-gray-500 text-xs truncate max-w-[180px]">
                {product.description}
            </div>

            {/* Price */}
            <div className="min-w-[70px] font-medium text-gray-900">${product.price}</div>

            {/* Stock */}
            <div
                className={`min-w-[80px] text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
            >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>

            {/* Sizes */}
            <div className="flex flex-wrap gap-1 min-w-[90px]">
                {product.sizes.map((size) => (
                    <span
                        key={size}
                        className="px-2 py-0.5 border border-gray-300 rounded text-xs text-gray-700 bg-gray-50"
                    >
                        {size}
                    </span>
                ))}
            </div>

            {/* Category */}
            <div>
                <span className="font-light text-gray-700">{product.category.name}</span>
            </div>
            {/* Actions */}
            <div className="flex gap-2 ml-auto">
                <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => onEdit(product)}
                    aria-label="Edit"
                >
                    <Pencil size={16} />
                </Button>
                <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => onDelete(product)}
                    aria-label="Delete"
                >
                    <Trash size={16} />
                </Button>
            </div>
        </div>
    );
};

export default ProductCartAdmin;
