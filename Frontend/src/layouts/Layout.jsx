import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useToast } from '../contexts/ToastContext'
import { useSocket } from '../contexts/SocketContext'

const Layout = ({ children }) => {
    const queryClient = useQueryClient()
    const { isLoading: isAuthLoading } = useAuth()
    const { addToast } = useToast()
    const socket = useSocket()

    useEffect(() => {
        if (socket) {
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

            socket.on("friendRequestReceived", handleFriendRequestReceived)
            socket.on("friendRequestCancelled", handleFriendRequestCancelled)
            socket.on("friendRequestAccepted", handleFriendRequestAccepted)
            socket.on("friendRequestRejected", handleFriendRequestRejected)
            socket.on("unfriendRequest", handleUnfriendRequest)

            return () => {
                socket.off("friendRequestReceived", handleFriendRequestReceived)
                socket.off("friendRequestCancelled", handleFriendRequestCancelled)
                socket.off("friendRequestAccepted", handleFriendRequestAccepted)
                socket.off("friendRequestRejected", handleFriendRequestRejected)
                socket.off("unfriendRequest", handleUnfriendRequest)
            }
        }
    }, [socket, addToast, queryClient])

    if (isAuthLoading) {
        return <div className='flex items-center justify-center h-screen w-screen'><div className='loader'></div></div>
    }

    return (
        <div className='flex flex-col min-h-screen font-heading text-white'>
            <Header/>
            <div className="container mt-16 mx-auto flex-1 py-10 bg-black">
                {children}
            </div>
        </div>
    )
}

export default Layout
