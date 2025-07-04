import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react';

const AppLayout = () => {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
                <Analytics/>
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout