import { useNavigate, useParams } from 'react-router-dom'
import { useGetUser } from '../api/UserApi'
import { useAuth } from '../contexts/AuthContext'
import React, { useEffect } from 'react'
import UserProfile from './UserProfile'
import UserProfileBio from '../components/UserProfileBio'
import UserProfileRooms from '../components/UserProfileRooms'

const OtherUserProfile = () => {
    const { id } = useParams()
    const { isLoading: isUserLoading, user } = useGetUser(id)
    const { isLoading: isAuthLoading, loggedInUser } = useAuth()
    const navigate = useNavigate()
    const sameUser = loggedInUser?._id.toString() === user?._id.toString()

    if (isAuthLoading || isUserLoading) {
        return <div className='loader'></div>
    }

    if (sameUser) {
        navigate('/user-profile')
    }
    
    return (
        <div className='w-full flex flex-col justify-center gap-9 sm:gap-14'>
            <UserProfileBio user={user} sameUser={sameUser} />
            <UserProfileRooms user={user} sameUser={sameUser} />
        </div>
    )
}

export default OtherUserProfile
