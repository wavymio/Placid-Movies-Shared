import { useNavigate, useParams } from 'react-router-dom'
import { useGetUser } from '../api/UserApi'
import { useAuth } from '../contexts/AuthContext'
import React from 'react'
import UserProfileBio from '../components/UserProfileBio'
import UserProfileRooms from '../components/UserProfileRooms'
import { useLoading } from '../contexts/LoadingContext'

const OtherUserProfile = () => {
    const { id } = useParams()
    const { isLoading: isUserLoading, user } = useGetUser(id)
    const { isLoading: isAuthLoading, loggedInUser } = useAuth()
    const { isRedirectLoading, setIsRedirectLoading } = useLoading()
    const navigate = useNavigate()
    const sameUser = loggedInUser?._id.toString() === user?._id.toString()

    if (isAuthLoading || isUserLoading) {
        return (
            <div className='overflow-y-hidden w-full h-[43vh] pb-2 flex justify-center items-center pt-[145px] lg:pt-[200px]'>
                <div className='big-loader'></div>
            </div>
        )
    }

    if (sameUser) {
        navigate('/user-profile')
    }
    
    if (isRedirectLoading) {
        return (
            <div className='overflow-y-hidden w-full h-screen flex flex-col gap-7 items-center pt-[145px] lg:pt-[200px]'>
                <div className='big-loader'></div>
                <div className='text-xs font-bold'>REDIRECTING TO ROOM...</div>
            </div>
        )
    }

    return (
        <div className='w-full flex flex-col justify-center gap-9 sm:gap-14'>
            <UserProfileBio user={user} sameUser={sameUser} loggedInUser={loggedInUser} />
            <UserProfileRooms user={user} sameUser={sameUser} loggedInUser={loggedInUser} />
        </div>
    )
}

export default OtherUserProfile
