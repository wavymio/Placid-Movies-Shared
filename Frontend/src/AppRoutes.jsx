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
import MyRoom from './pages/MyRoom'
import MyVideos from './pages/MyVideos'
import Verification from './pages/Verification'
import SocietyMap from './pages/SocietyMap'
import Continent from './pages/Continent'
import Country from './pages/Country'
import City from './pages/City'

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

            <Route path='/verification/:outcome/:reason?' element={
                // <Layout>
                    <Verification />
                // </Layout>
            }/>

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
                <Route path='/room/:roomId' element={
                    <Layout>
                        <MyRoom />
                    </Layout>
                } />
                <Route path='/my-videos' element={
                    <Layout>
                        <MyVideos />
                    </Layout>
                } />
                <Route path='/map' element={
                    <Layout>
                        <SocietyMap />
                    </Layout>
                } />
                <Route path='/map/continent/:id' element={
                    <Layout>
                        <Continent />
                    </Layout>
                } />
                <Route path='/map/country/:continentId/:countryId' element={
                    <Layout>
                        <Country />
                    </Layout>
                } />
                <Route path='/map/city/:continentId/:countryId/:cityId' element={
                    <Layout>
                        <City />
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
