import React from 'react';
import { useSelector } from 'react-redux';
import ProductCart from '@/components/ProductCart';
import { useProducts } from '@/hooks/usePorduct';
import ProductCartSkeleton from '@/features/skeleton/ProductCartSkeleton';

const Favorite = () => {
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const { data, isLoading, error } = useProducts(); 

    // if (! isLoading) return <ProductCartSkeleton />;
    if (error) return <div className="text-red-500">Failed to load products.</div>;

    const products = data?.data?.data || [];
    const wishlistedProducts = products.filter((product) =>
        wishlistItems.includes(product.id)
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Your Favorites</h1>

            {isLoading ? (
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <ProductCartSkeleton key={i} />
                    ))}
                </div>
            ) : wishlistedProducts.length === 0 ? (
                <div className="text-gray-500">You have no items in your wishlist.</div>
            ) : (
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wishlistedProducts.map((product) => (
                        <ProductCart key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
    
};

export default Favorite;
