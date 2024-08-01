import UserProfileRooms from '../components/UserProfileRooms'
import UserProfileBio from '../components/UserProfileBio'
import { useAuth } from '../contexts/AuthContext'
import React from 'react'

const UserProfile = () => {
    const { isLoading, loggedInUser } = useAuth()

    if (isLoading) {
        return (
            <div className='loader'></div>
        )
    }

    return (
        <div className='w-full flex flex-col justify-center gap-9 sm:gap-14'>
            <UserProfileBio user={loggedInUser} sameUser={true} />
            <UserProfileRooms user={loggedInUser} sameUser={true} />
        </div>
    )
}

export default UserProfile
