import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart, UserRound, Menu, X, LogIn, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import { useDeleteCartItem, useGetCartItems, useUpdateCartItem } from '@/hooks/useCart';
import CartSlide from './CartSlide';
import debounce from 'lodash.debounce';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import InputSearch from './InputSearch';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [localCart, setLocalCart] = useState([]);

    const menuRef = useRef(null);

    const { user, token } = useSelector((state) => state.auth)
    const isLogin = localStorage.getItem('token') || token;
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user?.role);

    const queryClient = useQueryClient();
    const { data, isLoading } = useGetCartItems({ enabled: !!token });
    const cartItems = data?.data || [];
    // console.log('data', data);

    const wishlistItems = useSelector((state) => state.wishlist.items || []);

    useEffect(() => {
        if (token && cartItems.length >= 0) {
            setLocalCart(cartItems);
        }
    }, [cartItems]);



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const updateCartMutation = useUpdateCartItem({
        onSuccess: (data) => {
            queryClient.invalidateQueries(["Carts"]);
        },
        onError: (err) => {
            // console.log(err);
            toast.error(err?.response?.data?.message || 'Error while Updating cart.');
        }
    });

    const debouncedUpdate = useRef(
        debounce((id, quantity) => {
            updateCartMutation.mutate({ id, quantity });
        }, 500)
    ).current;

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setLocalCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
        debouncedUpdate(id, quantity);
    };

    const deleteCartMutation = useDeleteCartItem({
        onSuccess: (data) => {
            queryClient.invalidateQueries(["Carts"]);
            toast.success(data.message)
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error while Deleting cart.');
        }
    });

    const removeItem = (id) => {
        deleteCartMutation.mutate(id);
    };


    return (
        <>
            <header
                className=" w-full px-4 py-3 sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 "
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <Link to="/" className="block relative">
                                <h1 className="text-2xl font-bold text-gray-900 ">
                                    OneClothes
                                    {isAdmin && <span className='absolute text-sm font-light -bottom-3  right-0'>Admin</span>}
                                </h1>
                            </Link>
                        </div>

                        <nav className="hidden md:flex items-center gap-8 ml-8">
                            <Link
                                to="/products"
                                className="text-gray-700 hover:text-gray-600 font-medium transition-all duration-200 relative group"
                            >
                                Shop
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-200 group-hover:w-full"></span>
                            </Link>

                            <Link
                                to="/about-us"
                                className="text-gray-700 hover:text-gray-600 font-medium transition-all duration-200 relative group"
                            >
                                About us
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                        </nav>

                        <div className="hidden md:flex flex-1 max-w-lg mx-6 lg:mx-8">
                            <InputSearch />
                        </div>

                        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            {isLogin && isAdmin && (
                                <Button
                                    variant="outline"
                                >
                                    <Link className='flex items-center gap-1' to='/admin'>
                                        Admin
                                        <ArrowUpRight size={16} />
                                    </Link>
                                </Button>
                            )}


                            {
                                !isLogin && (
                                    <Button variant="outline" onClick={toggleMenu} asChild>
                                        <Link to="/login">
                                            <LogIn size={12} />
                                            Login
                                        </Link>
                                    </Button>
                                )
                            }
                            <Link
                                to="/favorite"
                                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group relative"
                                title="Favorites"
                            >
                                <Heart className="text-gray-600 group-hover:text-red-500 transition-colors duration-200" size={20} />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            <Link
                                to="/profile"
                                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                                title="Profile"
                            >
                                <UserRound className="text-gray-600 group-hover:text-blue-500 transition-colors duration-200" size={20} />
                            </Link>
                            <div
                                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group relative"
                                title="Shopping Cart"
                                onClick={toggleCart}

                            >
                                <ShoppingCart
                                    className="text-gray-600 group-hover:text-green-500 transition-colors duration-200" size={20} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="md:hidden flex items-center gap-1">
                            <Link
                                to="/favorite"
                                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group relative"
                                title="Favorites"
                            >
                                <Heart className="text-gray-600 group-hover:text-red-500 transition-colors duration-200" size={20} />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            <div
                                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group relative"
                                title="Cart"
                                onClick={toggleCart}
                            >
                                <ShoppingCart className="text-gray-600 group-hover:text-green-500 transition-colors duration-200" size={20} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={toggleMenu}
                                className={`
                p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isMenuOpen ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}
              `}
                                aria-label="Toggle navigation menu"
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    <div className="md:hidden mt-4">
                        <InputSearch />
                    </div>

                    <div
                        className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
                        ref={menuRef}
                    >
                        <div className="mt-4 pb-4 border-t border-gray-200">
                            <nav className="flex flex-col pt-4 space-y-1">
                                <Link
                                    to="/products"
                                    className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                                    onClick={toggleMenu}
                                >
                                    Shop
                                </Link>
                                <Link
                                    to="/about-us"
                                    className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                                    onClick={toggleMenu}
                                >
                                    About us
                                </Link>

                                {isLogin ? (
                                    <>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={toggleMenu}
                                                className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}

                                        <div className='flex justify-between items-center mr-2'>
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                                                onClick={toggleMenu}
                                            >
                                                <UserRound size={18} />
                                                Profile
                                            </Link>


                                        </div>
                                    </>
                                ) : (
                                    <Button variant="outline" onClick={toggleMenu} asChild>
                                        <Link to="/login">
                                            <LogIn size={18} />
                                            Login
                                        </Link>
                                    </Button>

                                )}

                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <CartSlide
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={localCart}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
            />
        </>
    );
};

export default Header;