import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InputSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = searchTerm.trim();
        if (query) {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }

        setSearchTerm('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
                <Search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    size={18}
                />
            </button>
        </form>
    );
};

export default InputSearch;
