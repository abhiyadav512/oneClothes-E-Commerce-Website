import React, {  useState } from 'react';
import { useDelete, useProducts } from '@/hooks/usePorduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import ProductForm from './ProductForm';
import ProductCartAdmin from './ProductCartAdmin';

const ProductManagement = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // <-- added

  const products = data?.data?.data || [];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProduct(null); 
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
    // toast.success(`Edit ${product.name}`);
  };

  const deleteMutation = useDelete({
    onSuccess: (data) => {
      toast.success("Porduct Deleted !")
      queryClient.invalidateQueries(['products']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Error deleting product.');
    }
  })

  const handleDelete = (product) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmed) return;
    deleteMutation.mutate(product.id);
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-800">Product Management</h2>
        <div className="flex items-center gap-2 justify-between w-full md:w-auto">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={handleAddProduct}>
            Add Product
          </Button>
        </div>
      </div>

      {showForm && (
        <ProductForm
          product={selectedProduct} // <-- pass selected product here
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))
        ) : error ? (
          <p className="text-sm text-red-500">Error: {error.message}</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCartAdmin
              key={product.id}
              product={product}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product)}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
