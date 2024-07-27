import React, { useState } from 'react'
import { Separator } from './ui/separator'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import SearchBar from './SearchBar'

const MainNav = ({ isLoggedIn, user, logout, isLoading }) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
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
        <div className='relative inline-block'>
            <div className='flex items-center gap-2'>
                {user && (
                    <div className='font-bold'>{user.username} </div>
                )}
                <img onClick={handlePfpClick} src='https://via.placeholder.com/150' className='h-10 w-10 rounded-full border-2 border-gray-200 cursor-pointer transition-transform transform hover:scale-105' />
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
        </div>
    )
}

export default MainNav
