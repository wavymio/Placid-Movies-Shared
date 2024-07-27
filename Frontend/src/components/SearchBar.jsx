import { useSearchUsernamesAndRooms } from '../api/SearchApi'
import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5"
import { Link } from 'react-router-dom'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const SearchBar = () => {
    const { searchUsersandRooms, isLoading } = useSearchUsernamesAndRooms()
    const [searchInput, setSearchInput] = useState('')
    const [usernames, setUsernames] = useState(undefined)

    const handleSubmit = (ev) => {
        ev.preventDefault()
        setSearchInput('')
        setUsernames(undefined)
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
            {isLoading ? (
                <div className={`mt-20 xs:mt-24 left-0 w-full z-40 shadow-lg px-7 sm:p-0 sm:z-5 sm:w-96  bg-black text-white absolute sm:right-0 sm:mt-2 transition-opacity duration-500 ease-in-out ${isLoading} ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className='p-4 sm:p-3 border border-neutral-800 flex justify-center rounded-lg'>
                        <div className='loader'></div>
                    </div>
                </div>
            ) : (
                <div className={`mt-20 left-0 w-full shadow-lg z-40 px-7 sm:p-0 sm:z-5 sm:w-96 bg-black text-white absolute sm:right-0 sm:mt-2 transition-opacity duration-500 ease-in-out ${usernames && searchInput ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className={`rounded-lg border w-full border-neutral-800 flex flex-col`} >
                        {usernames?.length > 0 ? (
                            usernames.map((username, index) => (
                                <>
                                    <Link className={`px-4 pt-4 pb-4 cursor-pointer flex items-center gap-2 text-sm hover:bg-neutral-800 ${index !== 0 ? null : 'rounded-t-lg'} ${index === usernames.length-1 ? 'rounded-b-lg' : null} transition-colors duration-300 ease-in-out`} key={index} to={`${API_BASE_URL}/api/user/${username._id}`}>
                                        {username.username}
                                        <Badge>user</Badge>
                                    </Link>
                                    {/* {index !== usernames.length - 1 &&  
                                        <Separator className="hidden sm:block bg-neutral-800" />
                                    } */}
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
