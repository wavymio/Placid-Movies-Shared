import React from 'react'
import { Link } from 'react-router-dom'
import MobileNav from './MobileNav'
import MainNav from './MainNav'
import { Separator } from './ui/separator'
import { useAuth } from '../contexts/AuthContext'
import { useLogoutMyUser } from '../api/MyUserApi'
import SearchBar from './SearchBar'
import MobileSearchBar from './MobileSearchBar'

const Header = () => {
    // const {isError, userInfo} = useValidateMyUser()
    const { isLoggedIn, loggedInUser } = useAuth()
    const { logoutUser, isLoading } = useLogoutMyUser()

    return (
        <>
            <div className='bg-black py-5 relative'>
                <div className="container mx-auto flex justify-between items-center">
                    <Link to={'/'} className='text-sm  sm:text-xl font-heading font-bold tracking-wider text-white'>
                        PLÂCID
                    </Link>
                    <div className='hidden sm:block sm:w-96 sm:relative'>
                        <SearchBar />
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='sm:hidden'>
                            <MobileSearchBar />
                        </div>
                        <div className='xs:hidden'>
                            <MobileNav isLoggedIn={isLoggedIn} user={loggedInUser} logout={logoutUser} isLoading={isLoading} />
                        </div>
                        <div className='hidden xs:block '>
                            <MainNav isLoggedIn={isLoggedIn} user={loggedInUser} logout={logoutUser} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="bg-neutral-800" />
        </>
    )
}

export default Header
