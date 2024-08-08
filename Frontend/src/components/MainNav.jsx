import React, { useEffect, useRef, useState } from 'react'
import { Separator } from './ui/separator'
import { Link } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { IoMdNotifications } from "react-icons/io"
import Notifications from './Notifications'
import { useMarkMyNotifications } from '../api/MyNotificationsApi'

const MainNav = ({ isLoggedIn, user, logout, isLoading, isAuthLoading }) => {
    const queryClient = useQueryClient()
    const { markNotifications } = useMarkMyNotifications()
    const [profileDrop, setProfileDrop] = useState(false)
    const [notifDrop, setNotifDrop] = useState(false)
    const prevNotifDropRef = useRef(notifDrop)
    const [done, setDone] = useState(false)
    const unseenMessages = user?.notifications.filter((notification) => !notification.seen)

    const handlePfpClick = () => {
        setNotifDrop(false)
        setProfileDrop(!profileDrop)
    }

    const handleLinkClick = () => {
        setProfileDrop(!profileDrop)
    }

    const handleNotifClick = () => {
        setProfileDrop(false)
        setNotifDrop(!notifDrop)
    } 

    const handleLogout = async () => {
        if (!done) {
            setDone(true)
            
            const res = await logout()

            if (res?.success) {            
                handleLinkClick()
                await queryClient.invalidateQueries('validateUser')
            }

            setDone(false)
        }    
    }

    const handleMarkNotifications = async () => {
        if(!user) {
            return
        }

        return await markNotifications()
    }

    useEffect(() => {
        if (prevNotifDropRef.current && !notifDrop) {
            handleMarkNotifications()
        }
        prevNotifDropRef.current = notifDrop
    }, [notifDrop])

    return (
        <div className='relative inline-block'>
            <div className='flex items-center gap-2'>
                {user &&
                <>
                    <div className='sm:hidden md:block font-bold'>{user.username} </div>
                    <div onClick={handleNotifClick} className='relative bg-neutral-800 h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-neutral-900 hover:scale-105 transition-all duration-300 ease-in-out'>
                        <IoMdNotifications className='h-7 w-7' />
                        <div className={`${unseenMessages.length < 1 ? 'hidden' : 'flex'} absolute rounded-full w-4 h-4  text-xs items-center justify-center font-bold bg-red-700 bottom-0 left-0`}>{unseenMessages.length > 9 ? '9+' : unseenMessages.length}</div>
                    </div>
                </>
                }
                <img onClick={handlePfpClick} src={user?.profilePicture ? user?.profilePicture : 'https://via.placeholder.com/150'} className='object-cover h-10 w-10 rounded-full border-2 border-gray-200 cursor-pointer transition-transform transform hover:scale-105' />
            </div>
            <div className={`shadow-lg z-10 w-40 border border-gray-300 font-semibold bg-black text-white absolute right-0 mt-2 flex flex-col rounded-lg transition-opacity duration-500 ease-in-out ${profileDrop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                {isLoggedIn && user ? (
                    <>                     
                        <Link onClick={handleLinkClick} to={'/user-profile'} className='px-4 pt-4 pb-4 cursor-pointer hover:bg-neutral-800 rounded-t-lg transition-colors duration-300 ease-in-out'>User Profile</Link>
                        <Separator className="bg-neutral-800" />
                        <Link onClick={handleLogout} className={`px-4 pt-4 pb-4 ${isLoading ? 'flex justify-center' : null} cursor-pointer hover:bg-neutral-800 rounded-b-lg transition-colors duration-300 ease-in-out`}>{isLoading ? (<span className='loader'></span>) : 'Logout'}</Link>
                    </>
                ) : (
                    <>
                        <Link onClick={handleLinkClick} to={'/login'} className='px-4 pt-4 pb-4 cursor-pointer hover:bg-neutral-800 rounded-t-lg transition-colors duration-300 ease-in-out'>Login</Link>
                        <Separator className="bg-neutral-800" />
                        <Link onClick={handleLinkClick} className='px-4 pt-4 pb-4 cursor-pointer hover:bg-neutral-800 rounded-b-lg transition-colors duration-300 ease-in-out'>Docs</Link>
                    </>
                )}
                
            </div>
            <Notifications notifDrop={notifDrop} />
        </div>
    )
}

export default MainNav
