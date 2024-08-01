import React from 'react'
import Home from './pages/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ProtectedRoute from './auth/ProtectedRoute'
import AuthRoute from './auth/AuthRoute'
import UserProfile from './pages/UserProfile'
import OtherUserProfile from './pages/OtherUserProfile'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={
                <Layout>
                    <Home />
                </Layout>
            } />

            <Route path='/user/:id' element={
                <Layout>
                    <OtherUserProfile />
                </Layout>
            } />

            <Route element={<AuthRoute />}>
                <Route path='/login' element={
                    <Layout>
                        <Login />
                    </Layout>
                } />
                <Route path='/signup' element={
                    <Layout>
                        <SignUp />
                    </Layout>
                } />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path='/user-profile' element={
                    <Layout>
                        <UserProfile />
                    </Layout>
                } />
            </Route>
            <Route path='*' element={
                <Navigate to='/' />
            } />
        </Routes>
    )
}

export default AppRoutes
