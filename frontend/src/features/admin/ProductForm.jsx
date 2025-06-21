import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useAddProduct, useUpdateProduct } from "@/hooks/usePorduct";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { uploadProductImage } from "@/api/productApi";

const defaultCategories = ["Shirts", "Pants", "Shoes", "T Shirts"];

const ProductForm = ({ onCancel, product }) => {
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await uploadProductImage(file);
            setImageUrl(response.data.imageUrl);
            toast.success("Image uploaded!");
        } catch {
            toast.error("Failed to upload image");
        }
        setUploading(false);
    };

    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price?.toString() || "",
        stock: product?.stock?.toString() || "",
        sizes: product?.sizes?.join(", ") || "",
        category: product?.category?.name || defaultCategories[0],
    });


    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price?.toString() || "",
                stock: product.stock?.toString() || "",
                sizes: product.sizes?.join(", ") || "",
                category: product.category?.name || defaultCategories[0],
            });
            setImageUrl(product.imageUrl || "");
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addProductMutation = useAddProduct({
        onSuccess: (data) => {
            const mes = data.data.data.name;
            toast.success(`${mes} added!`);
            queryClient.invalidateQueries(["products"]);
            onCancel();
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message ||
                err?.response?.data?.errors ||
                "Login failed."
            );
        },
    });

    const updateProductMutation = useUpdateProduct({
        onSuccess: (data) => {
            toast.success(`${data.data.data.name} updated!`);
            queryClient.invalidateQueries(["products"]);
            onCancel();
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message ||
                err?.response?.data?.errors ||
                "Failed to update product."
            );
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!imageUrl) {
            toast.error("Please upload an image before submitting.");
            return;
        }
        const newProduct = {
            ...formData,
            imageUrl,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            sizes: formData.sizes.split(",").map((s) => s.trim()),
        };
        if (product && product.id) {
            // Update mode
            // console.log(newProduct);
            updateProductMutation.mutate({ id: product.id, data: newProduct });
        } else {
            // Add mode
            addProductMutation.mutate(newProduct);
        } setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            sizes: "",
            imageUrl: "",
            category: defaultCategories[0],
        });
        onCancel();
    };



    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto p-6 bg-white shadow space-y-6"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <Label htmlFor="name" className="mb-1 block font-semibold">
                        Product Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Product name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="price" className="mb-1 block font-semibold">
                        Price
                    </Label>
                    <Input
                        id="price"
                        name="price"
                        placeholder="Price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="category" className="mb-1 block font-semibold">
                        Category
                    </Label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        {defaultCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label htmlFor="stock" className="mb-1 block font-semibold">
                        Stock
                    </Label>
                    <Input
                        id="stock"
                        name="stock"
                        placeholder="Stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="sizes" className="mb-1 block font-semibold">
                        Sizes (comma-separated)
                    </Label>
                    <Input
                        id="sizes"
                        name="sizes"
                        placeholder="M, L, XL"
                        value={formData.sizes}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="image" className="mb-1 block font-semibold">
                        Upload Image
                    </Label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploading}
                        className="w-full cursor-pointer rounded border border-gray-300 p-2"
                    />
                    {uploading && (
                        <p className="mt-2 text-sm text-gray-500 italic">Uploading...</p>
                    )}
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="mt-3 h-24 w-24 object-cover rounded-md shadow"
                        />
                    )}
                </div>

                <div className="sm:col-span-2">
                    <Label htmlFor="description" className="mb-1 block font-semibold">
                        Description
                    </Label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="w-full rounded border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end sm:gap-3 gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={addProductMutation.isPending}
                    className="w-full sm:w-auto"
                >
                    {addProductMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
