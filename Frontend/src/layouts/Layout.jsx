import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import React from 'react'

const Layout = ({ children }) => {
    const { isLoading: isAuthLoading } = useAuth()

    if (isAuthLoading) {
        return <div className='flex items-center justify-center h-screen w-screen'><div className='loader'></div></div>
    }

    return (
        <div className='flex flex-col min-h-screen font-heading text-white'>
            <Header/>
            <div className="container mt-16 mx-auto flex-1 py-10 bg-black">
                {children}
            </div>
        </div>
    )
}

export default Layout
