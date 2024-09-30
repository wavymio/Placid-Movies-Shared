import React, { useState } from 'react'
import { FaUsers, FaVideo } from 'react-icons/fa'
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp, IoMdExit } from 'react-icons/io'
import { IoPersonAdd } from 'react-icons/io5'
import { MdAdminPanelSettings, MdModeEdit } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import EditRoomTab from './EditRoomTab'
import ParticipantsTab from './ParticipantsTab'
import VideoSettingsTab from './VideoSettingsTab'
import InvitesTab from './InvitesTab'
import AdminSettingsTab from './AdminSettingsTab'

const RoomSettingsPanel = ({ openRoomSettingsBar, toggleRoomSettingsBar, room, loggedInUser, formatTime }) => {
    const navigate = useNavigate()
    const [tab, setTab] = useState(null)

    const closeComponent = () => {
        setTab(null)
        toggleRoomSettingsBar()
    }

    const handleLeaveRoom = () => {
        navigate('/')
    }

    const activeTabStyle = "bg-neutral-900"

    return (
        <div className={`flex flex-col sm:flex-row h-screen w-full bg-transparent backdrop-filter backdrop-blur-lg shadow-lg z-20 fixed left-0 top-0  transition-all duration-700 ease-in-out ${openRoomSettingsBar ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className='fixed bottom-0 w-full h-[110px] sm:h-full sm:w-[150px] md:w-[170px] sm:relative'>
                <div className='fixed bottom-0 sm:static flex flex-row justify-evenly items-center w-full h-[90px] sm:pt-24 sm:pl-8 sm:h-full sm:flex-col sm:items-stretch sm:justify-normal sm:gap-7 sm:w-[126px] md:w-[146px] lg:pt-32 font-semibold bg-black'>
                    <div onClick={() => tab === 'edit-room' ? closeComponent() : setTab('edit-room')}className={`flex items-center justify-center ${tab === "edit-room" ? 'bg-neutral-800' : activeTabStyle } h-9 w-9 xs:h-12 xs:w-12 sm:h-14 sm:w-14 rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125`} title='Edit Room'><MdModeEdit className='h-[18px] w-[18px] xs:h-[22px] xs:w-[22px]' /></div>
                    <div onClick={() => tab === 'participants' ? closeComponent() : setTab('participants')}className={`flex items-center justify-center ${tab === "participants" ? 'bg-neutral-800' : activeTabStyle } h-9 w-9 xs:h-12 xs:w-12 sm:h-14 sm:w-14 rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125`} title='Participants'><FaUsers className='h-[18px] w-[18px] xs:h-[22px] xs:w-[22px]' /></div>
                    <div onClick={() => tab === 'video-settings' ? closeComponent() : setTab('video-settings')}className={`flex items-center justify-center ${tab === "video-settings" ? 'bg-neutral-800' : activeTabStyle } h-9 w-9 xs:h-12 xs:w-12 sm:h-14 sm:w-14 rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125`} title='Video Settings'><FaVideo className='h-[18px] w-[18px] xs:h-[22px] xs:w-[22px]' /></div>
                    <div onClick={() => tab === 'invites-requests' ? closeComponent() : setTab('invites-requests')}className={`flex items-center justify-center ${tab === "invites-requests" ? 'bg-neutral-800' : activeTabStyle } h-9 w-9 xs:h-12 xs:w-12 sm:h-14 sm:w-14 rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125`} title='Room Invites and Requests'><IoPersonAdd className='h-[18px] w-[18px] xs:h-[22px] xs:w-[22px]' /></div>
                    <div onClick={() => tab === 'admin-settings' ? closeComponent() : setTab('admin-settings')}className={`flex items-center justify-center ${tab === "admin-settings" ? 'bg-neutral-800' : activeTabStyle } h-9 w-9 xs:h-12 xs:w-12 sm:h-14 sm:w-14 rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125`} title='Admin Settings'><MdAdminPanelSettings className='h-[18px] w-[18px] xs:h-[22px] xs:w-[22px]' /></div>
                    <div 
                    onClick={handleLeaveRoom}
                    className='flex items-center justify-center bg-neutral-900 h-9 w-9 xs:h-12 xs:w-12 sm:h-14 sm:w-14 rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125' title='Exit Room'><IoMdExit className='h-[18px] w-[18px] xs:h-[22px] xs:w-[22px]' /></div>
                </div>
                <div onClick={closeComponent} className='top-0 right-0 h-10 w-10 sm:h-12 sm:w-12 sm:top-1/2 sm:right-0 cursor-pointer bg-black flex items-center justify-center rounded-full absolute transition-transform duration-300 ease-in-out hover:scale-105'>
                    <IoIosArrowBack style={{ fontSize: '15px' }} className='hidden sm:flex' />
                    <IoIosArrowDown style={{ fontSize: '15px' }} className='flex sm:hidden' />
                </div>
            </div>
            <div className='h-full flex flex-grow items-center justify-center bg-transparent'>
                {tab === 'edit-room' && (
                    <EditRoomTab room={room} loggedInUser={loggedInUser} />
                )}
                {tab === 'participants' && (
                    <ParticipantsTab room={room} loggedInUser={loggedInUser} />
                )}
                {tab === 'video-settings' && (
                    <VideoSettingsTab room={room} loggedInUser={loggedInUser} formatTime={formatTime} />
                )}
                {tab === 'invites-requests' && (
                    <InvitesTab room={room} loggedInUser={loggedInUser} />
                )}
                {tab === 'admin-settings' && (
                    <AdminSettingsTab room={room} loggedInUser={loggedInUser} />
                )}
            </div>
        </div>
    )
}

export default RoomSettingsPanel
