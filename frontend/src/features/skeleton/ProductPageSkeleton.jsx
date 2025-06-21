import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductPageSkeleton = () => {
    return (
        <div className="px-4 py-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image Skeleton */}
            <div className="w-full">
                <Skeleton className="aspect-square w-full rounded-lg" />
            </div>

            {/* Info Skeleton */}
            <div className="space-y-5">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Description */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />

                {/* Price & Stock */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                </div>

                {/* Sizes */}
                <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2 flex-wrap">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-10 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-4 rounded-full" />
                    ))}
                    <Skeleton className="h-4 w-24 ml-2" />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                    <Skeleton className="h-10 w-32 rounded-md" />
                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default ProductPageSkeleton;
