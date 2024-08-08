import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "./AuthContext"
import { io } from "socket.io-client"
import { useToast } from "./ToastContext"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
    const socket = useRef(null)
    const { isLoggedIn, isLoading, loggedInUser } = useAuth()
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        if (loggedInUser?._id !== userId) {
            if (socket.current) {
                socket.current.disconnect()
            }

            socket.current = io(API_BASE_URL, {
                withCredentials: true,
                // query: { userId: loggedInUser._id } // not safe
            })

            socket.current.on("connect", () => {
                console.log("Connected to socket server")
            })
            setUserId(loggedInUser?._id)

            // return is also known as component unmount
            // return also runs after the dependency array changes before rerunning the use effect
            return () => {
                if (socket.current) {
                    socket.current.disconnect()
                }
            }
        }
    }, [loggedInUser?._id]) //dependency array

    return (
        <SocketContext.Provider value={socket.current}>
            { children }
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)