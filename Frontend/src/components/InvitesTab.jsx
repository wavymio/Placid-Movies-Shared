import React, { useState } from 'react'
import RoomInvitesTab from './RoomInvitesTab'
import RoomRequestsTab from './RoomRequestsTab'

const InvitesTab = ({ room, loggedInUser }) => {
    const [tab, setTab] = useState("invites")

    const changeTabs = (tabName) => {
        setTab(tabName)
    }

    return (
        <div className='-mt-10 xs:mt-0 sm:mt-16 md:mt-0 w-[260px] xs:w-[350px] sm:w-[470px] md:w-[550px] lg:w-[600px] min-h-[250px] relative bg-black border border-neutral-900 rounded-2xl px-8 py-8 max-h-[400px] xs:max-h-[400px] flex flex-col gap-5 items-center'>
            {/* <div className='flex flex-col items-center justify-center w-full sm:px-0 md:px-16 lg:px-60 mt-0 sm:mt-2'> */}
            <div className='px-10 flex items-center justify-center gap-5 sm:gap-10 border-b-1 border-neutral-800 w-full'>
                <div className={`w-36 cursor-pointer hidden sm:flex whitespace-nowrap justify-center pb-3 text-xs font-semibold transition-colors ease-in-out duration-300 ${tab === "invites" ? "border-b-2 border-white" : "text-neutral-400"}`} onClick={() => changeTabs("invites")}>
                    INVITED USERS
                </div>
                <div className={`w-36 px-2 cursor-pointer flex sm:hidden whitespace-nowrap justify-center pb-3 text-[11px] xs:text-xs font-semibold transition-colors ease-in-out duration-300 ${tab === "invites" ? "border-b-2 border-white" : "text-neutral-400"}`} onClick={() => changeTabs("invites")}>
                    INVITES
                </div>
                <div className={`w-36 cursor-pointer hidden sm:flex whitespace-nowrap justify-center pb-3 text-xs font-semibold transition-colors ease-in-out duration-300 ${tab === "requests" ? "border-b-2 border-white" : "text-neutral-400"}`} onClick={() => changeTabs("requests")}>
                    ROOM REQUESTS
                </div>
                <div className={`w-36 px-2 cursor-pointer flex sm:hidden whitespace-nowrap justify-center pb-3 text-[11px] xs:text-xs font-semibold transition-colors ease-in-out duration-300 ${tab === "requests" ? "border-b-2 border-white" : "text-neutral-400"}`} onClick={() => changeTabs("requests")}>
                    REQUESTS
                </div>
            </div>
            {tab === "invites" && (
                <RoomInvitesTab room={room} loggedInUser={loggedInUser} />
            )}
            {tab === "requests" && (
                <RoomRequestsTab room={room} loggedInUser={loggedInUser} />
            )}
        </div>
    )
}

export default InvitesTab
