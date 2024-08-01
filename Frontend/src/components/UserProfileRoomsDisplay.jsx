import React from 'react'
import { Link } from 'react-router-dom'
import { MdAdd } from "react-icons/md"
import { FaUsersSlash } from "react-icons/fa"
import { GoBookmarkSlash } from "react-icons/go"
import { FaDropletSlash } from "react-icons/fa6"

const UserProfileRoomsDisplay = ({ rooms, tab, sameUser }) => {
    return (
        <div className='mt-8 w-full flex items-center justify-center'>
            <div className={`w-full overflow-x-auto flex flex-nowrap ${rooms?.length > 0 ? 'justify-left' : 'justify-center'} gap-6 pb-8`}>
                {tab === "owned" && sameUser &&
                    <Link to={`/create-room`} className='flex flex-col items-center gap-2'>
                        <div className='flex items-center justify-center h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-neutral-900 border-1 hover:bg-neutral-800 transition-colors ease-in-out duration-300 '>
                            <MdAdd style={{ color: 'white', fontSize: '25px' }} />
                        </div>
                        <span className='text-xs text-center text-white'>ADD ROOM</span>
                    </Link>
                }

                {tab === "owned" && !sameUser &&
                    <Link to={``} className='flex flex-col items-center gap-2'>
                        <div className='flex items-center justify-center h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-neutral-900 border-1 hover:bg-neutral-800 transition-colors ease-in-out duration-300 '>
                            <FaUsersSlash style={{ color: 'white', fontSize: '25px' }} />
                        </div>
                        <span className='text-xs text-center text-white'>NO {tab.toUpperCase()} ROOMS</span>
                    </Link>
                }

                {rooms?.length > 0 && rooms.map((room, index) => (
                    <Link key={index} to={`/room/${room._id}`} className='flex flex-col items-center gap-2'>
                        <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pumpkin-orange via-gradient-midnight-black to-gradient-dark-purple'>
                            <img src={`https://via.placeholder.com/150`} alt="img" className='h-full w-full rounded-full' />
                        </div>
                        <span className='text-xs text-center font-bold'>{room.name}</span>
                    </Link>
                ))}

                {(tab === "saved" || tab === "favorite") && rooms?.length === 0 && 
                    <Link to={``} className='flex flex-col items-center justify-center gap-2'>
                        <div className='flex items-center justify-center h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-neutral-900 border-1 hover:bg-neutral-800 transition-colors ease-in-out duration-300 '>
                            {tab === "saved" ? (
                                <GoBookmarkSlash style={{ color: 'white', fontSize: '25px' }} />
                            ) : (
                                <FaDropletSlash style={{ color: 'white', fontSize: '25px' }} />
                            )}
                        </div>
                        <span className='text-xs text-center'>NO {tab.toUpperCase()} ROOMS</span>
                    </Link>
                }
            </div>
        </div>
    )
}

export default UserProfileRoomsDisplay





{/* <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pumpkin-orange via-gradient-midnight-black to-gradient-dark-purple'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pumpkin-orange via-gradient-midnight-black to-gradient-dark-purple'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pumpkin-orange via-gradient-midnight-black to-gradient-dark-purple'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pumpkin-orange via-gradient-midnight-black to-gradient-dark-purple'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pink via-gradient-purple to-gradient-yellow'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-light-gray via-gradient-medium-gray to-gradient-dark-gray'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-deep-red via-gradient-soft-pink to-gradient-rose-gold'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pumpkin-orange via-gradient-midnight-black to-gradient-dark-purple'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pink via-gradient-purple to-gradient-yellow'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='h-14 w-14 sm:h-20 sm:w-20 rounded-full p-1 bg-gradient-to-r from-gradient-pink via-gradient-purple to-gradient-yellow'>
                        <img src='https://via.placeholder.com/150' alt="img" className='h-full w-full rounded-full' />
                    </div>
                    <span className='text-xs text-center font-bold'>Archan's Room</span>
                </div> */}