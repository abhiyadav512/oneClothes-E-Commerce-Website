import ProductCart from "@/components/ProductCart";
import ProductCartSkeleton from "@/features/skeleton/ProductCartSkeleton";
import { useSearchProducts } from "@/hooks/usePorduct";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const { data, isLoading, error } = useSearchProducts(query);
    // console.log("search data:", data);
    // console.log("error:", error);

    if (error) {
        toast.error("Somthisn happend try again");
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <ProductCartSkeleton key={i} />
                    ))
                ) :
                    data?.data.length > 0 ? (
                        data?.data.map((p) => (
                            <ProductCart key={p.id} product={p} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-600 col-span-full text-center">
                            No matching products found for "<strong>{query}</strong>"
                        </p>
                    )}
            </div>
        </div>
    );
};

export default SearchResults;
