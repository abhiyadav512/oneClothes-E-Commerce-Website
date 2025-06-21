import CategorySection from '@/components/Home/CategorySection';
import ProductCart from '@/components/ProductCart';
import ProductCartSkeleton from '@/features/skeleton/ProductCartSkeleton';
import { useProducts } from '@/hooks/usePorduct';
import React from 'react';

const Products = () => {
    const { data, error, isLoading } = useProducts();
    const products = data?.data?.data || [];
    // console.log("p", products);

    return (
        <div className="px-4 md:px-8 py-6">
            <div className="flex justify-center mb-6">
                <CategorySection />
            </div>

            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <ProductCartSkeleton key={i} />
                    ))
                ) : error ? (
                    <p className="text-sm text-red-500 col-span-full">Error: {error.message}</p>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCart key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-sm text-gray-600 col-span-full text-center">
                        Product is not available right now! try again.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Products;
