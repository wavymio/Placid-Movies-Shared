import { useSearchUsernamesAndRooms } from '../api/SearchApi'
import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5"
import { FaUserInjured } from "react-icons/fa6"
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from './ui/badge'
import { useAuth } from '../contexts/AuthContext'

const SearchBar = () => {
    const { loggedInUser, isLoading: isAuthLoading} = useAuth()
    const { searchUsersandRooms, isLoading } = useSearchUsernamesAndRooms()
    const [searchInput, setSearchInput] = useState('')
    const [usernames, setUsernames] = useState(undefined)
    const navigate = useNavigate()

    const handleSubmit = (ev) => {
        ev.preventDefault()
        setSearchInput('')
        setUsernames(undefined)
    }

    const searchUser = (id) => {
        setSearchInput('')
        setUsernames(undefined)
        navigate(`/user/${id}`)
    }

    const handleSearchChange = async () => {
        if (searchInput) {
            const data = await searchUsersandRooms(searchInput)
            setUsernames(data)
        }
    }

    useEffect(() => {
        handleSearchChange()
    }, [searchInput])

    return (
        <>
            <form onSubmit={handleSubmit} className='absolute z-40 bg-black w-full h-12 top-16 xs:top-20 left-0 px-7 sm:p-0 sm:top-0 sm:left-0 sm:relative z-4 flex items-center sm:h-10 sm:w-full sm:bg-black'>
                <input 
                value={searchInput}
                onChange={(ev) => setSearchInput(ev.target.value)}
                placeholder='Search for a username or room'
                className='py-3 px-3 w-full h-12 sm:h-full sm:p-3 rounded-l-lg border border-neutral-800 sm:text-xs bg-inherit focus:outline-none placeholder-neutral-200 placeholder:text-xs' />
                <button type='submit' className='w-16 h-full flex items-center justify-center border-none rounded-r-lg bg-neutral-800 sm:p-3 sm:h-full sm:w-auto hover:bg-neutral-900 transition-colors ease-in-out duration-300'>
                    <IoCloseSharp />
                </button>
            </form>
            {isLoading || isAuthLoading ? (
                <div className={`mt-20 xs:mt-24 left-0 w-full z-40 shadow-lg px-7 sm:p-0 sm:z-5 sm:w-96 rounded-lg bg-black text-white absolute sm:right-0 sm:mt-2 transition-opacity duration-500 ease-in-out ${isLoading} ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className='p-4 sm:p-3 border border-neutral-800 flex justify-center rounded-lg'>
                        <div className='loader'></div>
                    </div>
                </div>
            ) : (
                <div className={`rounded-lg mt-20 left-0 w-full shadow-lg z-40 px-7 sm:p-0 sm:z-5 sm:w-96 bg-black text-white absolute sm:right-0 sm:mt-2 transition-opacity duration-500 ease-in-out ${usernames && searchInput ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className={`rounded-lg border w-full border-neutral-800 flex flex-col`} >
                        {usernames?.length > 0 ? (
                            usernames.map((username, index) => (
                                <>
                                    <Link onClick={() => searchUser(username._id)} className={`px-4 pt-4 pb-4 cursor-pointer flex items-center gap-2 text-sm hover:bg-neutral-800 ${index !== 0 ? null : 'rounded-t-lg'} ${index === usernames.length-1 ? 'rounded-b-lg' : null} transition-colors duration-300 ease-in-out`} key={index} to={`/user/${username._id}`}>
                                        {username.username}
                                        <Badge>{username._id === loggedInUser?._id ? (
                                            <span className='flex items-center gap-2'>You<FaUserInjured /></span>
                                        ): ( 
                                            <span>User</span>
                                        )}</Badge>
                                    </Link>
                                </>
                            ))
                        ) : (
                            <div className='sm:p-3 p-4 text-sm '>No results found</div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default SearchBar
