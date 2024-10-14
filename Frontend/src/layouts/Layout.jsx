import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useToast } from '../contexts/ToastContext'
import { useSocket } from '../contexts/SocketContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoading } from '../contexts/LoadingContext'
import { usePlayPause } from '../contexts/PlayPauseContext'

const Layout = ({ children }) => {
    const { roomId: gottenRoomId } = useParams()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { isLoading: isAuthLoading, loggedInUser } = useAuth()
    const { addToast } = useToast()
    const { socket } = useSocket()
    const { isRedirectLoading, setIsRedirectLoading } = useLoading()
    const { playPause, setPlayPause } = usePlayPause()
    const topGRef = useRef(null)
    const [ roomId, setRoomId ] = useState(null)

    const scrollToTop = () => {
        topGRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (gottenRoomId) {
            setRoomId(gottenRoomId)
        } else {
            setPlayPause({})
        }
    }, [gottenRoomId])

    useEffect(() => {
        console.log(roomId)
        if (!roomId) setPlayPause({})
        if (socket) {
            const handleErrorNotification = (data) => {
                addToast("error", data.error)
                setIsRedirectLoading(false)
                navigate('/')
            }

            const handleFriendRequestReceived = async (data) => {
                console.log(`${data.from} has sent you a friend request`)
                addToast("success", `${data.from} has sent you a friend request`)
                await queryClient.invalidateQueries('getUser')
                await queryClient.invalidateQueries("validateUser")
            }

            const handleFriendRequestCancelled = async (data) => {
                await queryClient.invalidateQueries("getUser")
                await queryClient.invalidateQueries("validateUser")
            }

            const handleFriendRequestAccepted = async (data) => {
                console.log(`${data.from} has accepted your friend request`)
                addToast("success", `${data.from} has accepted your friend request`)
                await queryClient.invalidateQueries("getUser")
                await queryClient.invalidateQueries("validateUser")
            }

            const handleFriendRequestRejected = async (data) => {
                await queryClient.invalidateQueries("getUser")
                await queryClient.invalidateQueries("validateUser")
            }

            const handleUnfriendRequest = async (data) => {
                await queryClient.invalidateQueries("getUser")
                await queryClient.invalidateQueries("validateUser")
            }

            const handleRoomInviteReceived = async (data) => {
                console.log(`${data.from} has sent you a room invite`)
                addToast("success", `${data.from} sent you an invite`)
                await queryClient.invalidateQueries('getUser')
                await queryClient.invalidateQueries("validateUser")
            }

            const handleRoomCreated = async (data) => {
                await queryClient.invalidateQueries('validateUser')
                navigate(`/room/${data.room._id}`)
            }

            const handleUserJoined = async (data) => {
                // await queryClient.invalidateQueries('validateUser')
                await queryClient.invalidateQueries(['getRoom', roomId])
                // await queryClient.invalidateQueries('getRoom')
                // if (loggedInUser._id === data.user._id) {
                //     addToast("success", `Welcome btc, ${data.user.username}`)
                // } else {
                //     addToast("success", `${data.user.username} joined the room`)
                // }
                if (!sessionStorage.getItem(`userIsRejoining-${roomId}`)) {
                    navigate(`/room/${data.room._id}`)
                }
                setIsRedirectLoading(false)
            }

            const handleUserLeft = async (data) => {
                await queryClient.invalidateQueries(['getRoom', roomId])
                // await queryClient.invalidateQueries('getRoom')
                addToast("success", `${data.user.username} left the room`)
            }

            const handleRoomUpdated = async (data) => {
                console.log(roomId)
                await queryClient.invalidateQueries(['getRoom', roomId])
                // await queryClient.invalidateQueries('getRoom')
                if (loggedInUser._id === data.user._id) {
                    addToast("success", "Room Updated")
                } else {
                    addToast("success", `Room updated by ${data.user.username}`)
                }
            } 

            const handleGetLost = (data) => {
                addToast('success', `${data.user.username} kicked you from the room`)
                navigate('/')
            }

            const handleVideoChanged = async (data) => {
                await queryClient.invalidateQueries(['getRoom', roomId])
                // await queryClient.invalidateQueries('getRoom')
                if (loggedInUser._id === data.user._id) {
                    addToast("success", "Video Changed!")
                } else {
                    addToast("success", `Video changed by ${data.user.username}`)
                }
            }

            const handleUserInvited = async (data) => {
                await queryClient.invalidateQueries(['getRoom', roomId])
                // await queryClient.invalidateQueries('getRoom')
            }

            const handleAdminPromoted = async (data) => {
                await queryClient.invalidateQueries(['getRoom', roomId])
                // await queryClient.invalidateQueries('getRoom')
                if (loggedInUser._id === data.participant._id) {
                    addToast("success", `You have been promoted by ${data.user.username}`)
                } else {
                    addToast("success", `${data.participant.username} has been promoted to noble by ${data.user.username}`)
                }
            }

            const handleAdminDemoted = async (data) => {
                await queryClient.invalidateQueries(['getRoom', roomId])
                // await queryClient.invalidateQueries('getRoom')
                if (loggedInUser._id === data.participant._id) {
                    addToast("success", `${data.user.username} has made you a peasant`)
                } else {
                    addToast("success", `${data.user.username} has made ${data.participant.username} a peasant`)
                }
            }

            const handlePlayingTheVideo = ({ user, currentTime }) => {
                setPlayPause(prev => {return {user, currentTime, isPlaying: true}})
            }

            const handlePausingTheVideo = ({ user, currentTime }) => {
                setPlayPause(prev => {return {user, currentTime, isPlaying: false}})
            }

            socket.on("errorNotification", handleErrorNotification)

            socket.on("friendRequestReceived", handleFriendRequestReceived)
            socket.on("friendRequestCancelled", handleFriendRequestCancelled)
            socket.on("friendRequestAccepted", handleFriendRequestAccepted)
            socket.on("friendRequestRejected", handleFriendRequestRejected)
            socket.on("unfriendRequest", handleUnfriendRequest)

            socket.on("roomCreated", handleRoomCreated)
            socket.on("roomInviteReceived", handleRoomInviteReceived)
            socket.on("userJoined", handleUserJoined)
            socket.on("userLeft", handleUserLeft)

            socket.on("roomUpdated", handleRoomUpdated)
            socket.on("getLost", handleGetLost)
            socket.on("videoChanged", handleVideoChanged)
            socket.on("userInvited", handleUserInvited)
            socket.on("promotedAdmin", handleAdminPromoted)
            socket.on("demotedAdmin", handleAdminDemoted)

            socket.on("playingTheVideo", handlePlayingTheVideo)
            socket.on("pausingTheVideo", handlePausingTheVideo)

            return () => {
                socket.off("errorNotification", handleErrorNotification)

                socket.off("friendRequestReceived", handleFriendRequestReceived)
                socket.off("friendRequestCancelled", handleFriendRequestCancelled)
                socket.off("friendRequestAccepted", handleFriendRequestAccepted)
                socket.off("friendRequestRejected", handleFriendRequestRejected)
                socket.off("unfriendRequest", handleUnfriendRequest)

                socket.off("roomCreated", handleRoomCreated)
                socket.off("roomInviteReceived", handleRoomInviteReceived)
                socket.off("userJoined", handleUserJoined)
                socket.off("userLeft", handleUserLeft)

                socket.off("roomUpdated", handleRoomUpdated)
                socket.off("getLost", handleGetLost)
                socket.off("videoChanged", handleVideoChanged)
                socket.off("userInvited", handleUserInvited)
                socket.off("promotedAdmin", handleAdminPromoted)
                socket.off("demotedAdmin", handleAdminDemoted)            
                
                socket.off("playingTheVideo", handlePlayingTheVideo)
                socket.off("pausingTheVideo", handlePausingTheVideo)
            }
        }
    }, [socket, roomId])

    if (isAuthLoading) {
        return <div className='flex items-center justify-center h-screen w-screen'><div className='big-loader'></div></div>
    }

    const childrenWithProps = React.cloneElement(children, { scrollToTop })

    return (
        <div className='flex flex-col min-h-screen font-heading text-white'>
            <div ref={topGRef}></div>
            <Header/>
            <div className={`${roomId ? 'px-0 sm:px-8 fixed sm:static' : null} container mt-16 flex-1 py-10 bg-black`}>
                {childrenWithProps}
            </div>
        </div>
    )
}

export default Layout
