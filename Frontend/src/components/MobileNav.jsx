import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Separator } from './ui/separator'
import { useQueryClient } from 'react-query'
import { IoLogOut } from "react-icons/io5"

const MobileNav = ({ isLoggedIn, user, logout, isLoading }) => {
    const queryClient = useQueryClient()
    const [profileDrop, setProfileDrop] = useState(false)
    const [done, setDone] = useState(false)

    const handlePfpClick = () => {
        setProfileDrop(!profileDrop)
    }

    const handleLinkClick = () => {
        setProfileDrop(!profileDrop)
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

    return (
        <div className='text-xs'>
            <img onClick={handlePfpClick} src='https://via.placeholder.com/150' className='h-7 w-7 rounded-full border-2 border-gray-200 cursor-pointer transition-transform transform hover:scale-105' />
            <div className={`px-6 shadow-lg z-10 absolute right-0 mt-4 w-full bg-black font-semibold text-white transition-opacity duration-500 ease-in-out ${profileDrop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className={`w-full flex flex-col`}>
                    {isLoggedIn && user ? (
                        <>
                            <Link onClick={handleLinkClick} to={'/user-profile'} className='px-4 pt-4 pb-4 cursor-pointer hover:bg-neutral-800 rounded-t-lg transition-colors duration-300 ease-in-out'>Profile</Link>
                            <Separator className="bg-neutral-800" />
                            <Link onClick={handleLogout} className='px-4 pt-4 pb-4 cursor-pointer hover:bg-neutral-800 rounded-b-lg transition-colors duration-300 ease-in-out'>{isLoading ? (<span className='loader'></span>) : (<span className='flex items-center gap-2'>Logout <IoLogOut /></span>)}</Link>
                        </>
                    ) : (
                        <>
                            <Link onClick={handleLinkClick} to={'/login'} className='px-4 pt-4 pb-4 cursor-pointer hover:bg-neutral-800 rounded-t-lg transition-colors duration-300 ease-in-out'>Login</Link>
                            <Separator className="bg-neutral-800" />
                            <Link onClick={handleLinkClick} className='px-4 pt-4 pb-4 cursor-pointer hover:bg-neutral-800 rounded-b-lg transition-colors duration-300 ease-in-out'>Docs</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MobileNav
