import { useMutation } from "react-query"
import { useToast } from "../contexts/ToastContext"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useSearchUsernamesAndRooms = () => {
    const { addToast } = useToast()

    const searchUsernamesAndRoomsRequest = async (searchInput) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({searchInput})
            })
    
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error)
            }
    
            const data = await response.json()
            return data
        } catch (err) {
            addToast("error", (err.message === "Failed to fetch" ? "Network Error" : err.message))
        }
    }

    const { mutateAsync: searchUsersandRooms, isLoading } = useMutation(searchUsernamesAndRoomsRequest)

    return {
        searchUsersandRooms,
        isLoading
    }
}