import React from 'react';
import { Instagram, Mail, Heart, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white px-6 py-10 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">OneClothes</h2>
                    <p className="text-sm text-gray-400">
                        Elevate your wardrobe with curated fashion picks for every season. Premium quality. Stylish. Affordable.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/products" className="hover:text-white">Shop</Link></li>
                        <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Categories</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/categories/Shirts" className="hover:text-white">Shirta</Link></li>
                        <li><Link to="/categories/Pants" className="hover:text-white">Pants</Link></li>
                        <li><Link to="/categories/Shoes" className="hover:text-white">Shoes</Link></li>
                        <li><Link to="/categories/T Shirts" className="hover:text-white">T Shirts</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
                    <div className="flex space-x-4 mb-4">
                        <Link to="https://www.linkedin.com/in/abhishek-yadav-407331311/" aria-label="Linkedin" className="hover:text-blue-500"><Linkedin size={18} /></Link>
                        <Link to="https://www.instagram.com/abhi_yadav512/" aria-label="Instagram" className="hover:text-pink-500"><Instagram size={18} /></Link>
                        <Link to="https://github.com/abhiyadav512" aria-label="Github" className="hover:text-sky-400"><Github size={18} /></Link>
                        <Link to="mailto:abhishekcyadav9594@gmail.com.com" aria-label="Email" className="hover:text-red-400"><Mail size={18} /></Link>
                    </div>
                    <p className="text-sm text-gray-400">abhishekcyadav9594@gmail.com</p>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} OneClothes. All rights reserved. Made with
                <span className="inline-flex items-center gap-1 text-red-500 font-medium mx-1">
                    <Heart size={14} className="fill-red-500" /> Abhishek
                </span>
            </div>
        </footer>
    );
};

export default Footer;
