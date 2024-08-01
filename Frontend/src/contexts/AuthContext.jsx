import { useGetMyUser } from "../api/MyUserApi"
import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    // const [user, setUserInfo] = useState({})
    const { userInfo, isLoading, isError } = useGetMyUser()

    const isLoggedIn = !isError && userInfo
    const loggedInUser = userInfo

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, loggedInUser }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)