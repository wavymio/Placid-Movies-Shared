import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PatchEditForms from './PatchEditForms'
import { usePatchEditMyUser, usePatchEditMyUserProfilePic } from '../api/MyUserApi'
import { useQueryClient } from 'react-query'

const UserProfileBio = ({ user, sameUser }) => {
    const [openUsername, setOpenUsername] = useState(false)
    const [response, setResponse] = useState({})
    const { patchEditUser, isLoading } = usePatchEditMyUser()
    const { patchEditUserProfilePic, isLoading: isProfilePicLoading } = usePatchEditMyUserProfilePic()
    const queryClient = useQueryClient()

    const editUsername = () => {
        if (!sameUser) {
            return
        }
        setOpenUsername(true)
    }

    const editUser = async (inputs) => {
        const res = await patchEditUser(inputs)
        setResponse(res)
        if (res?.success) {
            setOpenUsername(false)
            await queryClient.invalidateQueries('validateUser')
        }
    }

    const handlePfpChange = async (ev) => {
        const file = ev.target.files[0]
        
        if (file) {
            const formData = new FormData()
            formData.append('profilePicture', file)
            const res = await patchEditUserProfilePic(formData)

            if (res?.success) {
                await queryClient.invalidateQueries('validateUser')
            }
        }
    }

    return (
        <div className={` w-full flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-5 md:gap-16 xs:px-0 sm:px-10`}>
            {sameUser ? (
                <div className='relative z-10'>
                    <img src={user?.profilePicture ? user.profilePicture : `https://via.placeholder.com/150`} alt="img" className='h-28 w-28 xs:h-32 xs:w-32 sm:h-32 sm:w-32 md:h-44 md:w-44 rounded-full' />
                    {isProfilePicLoading ? (
                        <div className='absolute flex items-center justify-center opacity-50 bg-black cursor-pointer top-0 h-28 w-28 xs:h-32 xs:w-32 sm:h-32 sm:w-32 md:h-44 md:w-44 rounded-full'>
                            <span className='loader'></span>
                        </div>
                    ) : (
                        <input type='file' accept=".jpg, .jpeg, .png" onChange={handlePfpChange} className='absolute opacity-0 cursor-pointer top-0 h-28 w-28 xs:h-32 xs:w-32 sm:h-32 sm:w-32 md:h-44 md:w-44 rounded-full'/>
                    )}
                </div>
            ) : (
                <div className=''>
                    <img src={user?.profilePicture ? user.profilePicture : `https://via.placeholder.com/150`} alt="img" className='h-28 w-28 xs:h-32 xs:w-32 sm:h-32 sm:w-32 md:h-44 md:w-44 rounded-full' />
                </div>
            )}

            <div className='flex flex-col gap-3 xs:gap-5'>
                <div className='flex items-center gap-3'>
                    <div onClick={editUsername} className='cursor-pointer border border-neutral-800 bg-neutral-900 flex justify-center px-3 py-3 min-w-14 xs:px-2 xs:py-3 xs:min-w-20 sm:py-4 sm:w-24 md:px-2 md:py-4 md:min-w-28 rounded-lg font-semibold text-xs sm:text-sm hover:bg-neutral-800 transition-colors ease-in-out duration-300'>
                        {user?.username}
                    </div>
                    <div className='border border-neutral-800 bg-neutral-900 flex justify-center px-3 py-3 w-min-14 xs:px-2 xs:py-3 xs:min-w-20 sm:px-2 sm:py-4 sm:w-24 md:px-2 md:py-4 md:w-28 rounded-lg font-semibold text-xs sm:text-sm'>
                        Noob
                    </div>
                    {sameUser? (
                        <>
                            <Link to={'/edit-profile'} className={`cursor-pointer bg-red-900 hidden xs:flex justify-center whitespace-nowrap px-2 py-3 w-24 md:px-2 md:py-4 md:w-28 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-950 transition-colors ease-in-out duration-300`}>Edit Profile</Link>
                            <Link to={'/edit-profile'} className={`cursor-pointer bg-red-900 flex xs:hidden justify-center xs:whitespace-nowrap px-3 py-3 w-14 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-950 transition-colors ease-in-out duration-300`}>Edit</Link>
                        </>
                    ) : (
                        <>
                            <button className={`cursor-pointer bg-red-900 hidden xs:flex justify-center whitespace-nowrap px-2 py-3 w-24 md:px-2 md:py-4 md:w-28 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-950 transition-colors ease-in-out duration-300`}>Add Friend</button>
                            <button className={`cursor-pointer bg-red-900 flex xs:hidden justify-center xs:whitespace-nowrap px-3 py-3 w-14 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-950 transition-colors ease-in-out duration-300`}>Add</button>
                        </>
                    )}
                </div>

                <div className='flex items-center justify-center xs:justify-normal gap-3'>
                    <div className='cursor-pointer border border-neutral-800 bg-neutral-900 flex justify-center px-3 py-3 w-auto xs:px-2 xs:py-3 xs:w-20 sm:px-2 sm:py-4 sm:w-24 md:px-2 md:py-4 md:w-28 rounded-lg font-semibold text-xs sm:text-sm hover:bg-neutral-800 transition-colors ease-in-out duration-300'>
                        {user?.friends.length === 1 ? `${user?.friends.length} Friend` : `${user?.friends.length} Friends`}
                    </div>
                    <div className='cursor-pointer border border-neutral-800 bg-neutral-900 flex justify-center px-3 py-3 w-auto xs:px-2 xs:py-3 xs:min-w-20 sm:px-2 sm:py-4 sm:min-w-28 rounded-lg font-semibold text-xs sm:text-sm hover:bg-neutral-800 transition-colors ease-in-out duration-300'>
                        {user?.country ? user?.country : "Country"}
                    </div>
                </div>
            </div>

            {openUsername &&
                <PatchEditForms response={response} isLoading={isLoading} editUser={editUser} setOpenUsername={setOpenUsername} user={user} />
            }
        </div>
    )
}

export default UserProfileBio
