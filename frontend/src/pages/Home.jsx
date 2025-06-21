import CategorySection from '@/components/Home/CategorySection'
import ClothingSlider from '@/components/Home/ClothingSlider'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <section className=''>
                <ClothingSlider />
            </section>

            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover our carefully curated collections designed for every style
                            and occasion.
                        </p>
                    </div>
                    <div className='flex items-center justify-center'>
                        <CategorySection />
                    </div>
                    <div className="text-center mt-12">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 text-base font-semibold"
                        >
                            <Link to={"/products"}>View All Products</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home