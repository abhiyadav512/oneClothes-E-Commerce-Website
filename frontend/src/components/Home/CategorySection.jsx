import React from "react";
import { Link } from "react-router-dom";

const categories = [
    {
        id: 1,
        name: "Shirts",
        image:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop&crop=center",
    },
    {
        id: 2,
        name: "Pants",
        image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop&crop=center",
    },
    {
        id: 3,
        name: "Shoes",
        image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&crop=center",
    },
    {
        id: 4,
        name: "T Shirts",
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&crop=center",
    }
];

const CategorySection = () => {
    return (
        <div className=" overflow-x-auto no-scrollbar">
            <div className="flex space-x-6 w-max px-4 py-6">
                {categories.map((category) => (
                    <Link
                        to={`/categories/${category.name}`}
                        key={category.id}
                        className="flex flex-col items-center text-center cursor-pointer transition-transform duration-300 hover:scale-105"
                    >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-md mb-3">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-800">
                            {category.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategorySection;
