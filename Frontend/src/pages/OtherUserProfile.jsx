import { useNavigate, useParams } from 'react-router-dom'
import { useGetUser } from '../api/UserApi'
import { useAuth } from '../contexts/AuthContext'
import React from 'react'
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
            <UserProfileBio user={user} sameUser={sameUser} loggedInUser={loggedInUser} />
            <UserProfileRooms user={user} sameUser={sameUser} loggedInUser={loggedInUser} />
        </div>
    )
}

export default OtherUserProfile
