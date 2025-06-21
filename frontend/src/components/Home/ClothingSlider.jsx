import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClothingSlider = () => {
    // Sample clothing images - replace with your actual product images
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
            title: 'Summer Collection',
            subtitle: 'Lightweight & Stylish'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
            title: 'Casual Wear',
            subtitle: 'Comfort Meets Style'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop',
            title: 'Formal Collection',
            subtitle: 'Professional & Elegant'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop',
            title: 'Urban Style',
            subtitle: 'Street Fashion'
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
            title: 'Accessories',
            subtitle: 'Complete Your Look'
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full h-[26rem] sm:h-[36rem] overflow-hidden bg-gray-900">
            {/* Main slider container */}
            <div className="relative w-full h-full">
                {/* Slides */}
                <div
                    className="flex transition-transform duration-700 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                            {/* Content overlay */}
                            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                                <div className="max-w-2xl px-4">
                                    <h2 className="text-4xl md:text-6xl font-bold mb-4 transform transition-all duration-700 delay-300">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg md:text-2xl font-light transform transition-all duration-700 delay-500">
                                        {slide.subtitle}
                                    </p>
                                    <button className="mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                                        <Link to={"/products"}>
                                        Shop Now
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={18} />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    aria-label="Next slide"
                >
                    <ChevronRight size={18} />
                </button>

                {/* Slide indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-1 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-white scale-125'
                                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClothingSlider;