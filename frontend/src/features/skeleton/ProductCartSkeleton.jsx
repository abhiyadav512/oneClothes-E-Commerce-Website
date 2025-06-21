import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCartSkeleton = () => {
    return (
        <Card className="w-full max-w-4xl mx-auto p-4 sm:p-5 shadow-md rounded-lg animate-pulse">
                <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                        <Skeleton className="absolute inset-0 w-full h-full" />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                            <Skeleton className="h-4 w-12 rounded-full" />
                            <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                        <div className="absolute top-2 right-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between gap-4 text-sm">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-3/4" /> 
                        <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-4 rounded" />
                            ))}
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </div>
        </Card>
    );
};

export default ProductCartSkeleton;
