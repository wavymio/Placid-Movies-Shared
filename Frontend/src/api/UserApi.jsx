import { useQuery } from "react-query"
import { useToast } from "../contexts/ToastContext"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const useGetUser = (userId) => {
    const { addToast } = useToast()

    const useGetUserRequest = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
                credentials: 'include'
            })
    
            if (!response.ok) {
                const error = await response.json()
                console.log(error)
                throw new Error(error.error)
            }

            const data = await response.json()
            return data
        } catch (err) {
            console.log(err)
            addToast("error", (err.message === "Failed to fetch" ? "Network Error" : err.message))
        }
    }

    const { data: user, isLoading } = useQuery(['getUser', userId], useGetUserRequest, {
        enabled: !!userId
    })

    return { user, isLoading }
}