import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className=" bg-white flex flex-col">
            {/* Logo at the top */}
            <div className="pt-4 flex justify-center">
                <div className="flex items-center justify-center overflow-hidden bg-white">
                    <img
                        src="/logo.png"
                        alt="OneClothes Logo"
                        className="w-40 h-40 object-contain"
                    />
                </div>
            </div>

            {/* Main content centered below logo */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
                <div className="max-w-lg w-full text-center">
                    {/* 404 Heading */}
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-gray-100 select-none">404</h1>
                    </div>

                    {/* Message */}
                    <div className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-black">Page Not Found</h2>
                        <p className="text-gray-600 leading-relaxed px-2">
                            Sorry, we couldn't find the page you're looking for. It may have been moved, deleted, or never existed.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </button>

                            <button
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors"
                                onClick={() => window.location.href = '/'}
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Home Page
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}