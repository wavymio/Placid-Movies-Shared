import { useAuth } from '../contexts/AuthContext'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AuthRoute = () => {
    const { isLoggedIn,  isLoading, loggedInUser } = useAuth()
    
    if (isLoading) {
        return (
            <div className='loader'></div>
        )
    }

    if (!isLoggedIn && !loggedInUser) {
        return <Outlet />
    }

    return <Navigate to="/" replace />
}

export default AuthRoute

