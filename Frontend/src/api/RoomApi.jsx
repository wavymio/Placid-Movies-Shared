import { useMutation, useQuery } from "react-query"
import { useToast } from "../contexts/ToastContext"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const useGetRoom = (roomId) => {
    const { addToast } = useToast()

    const getRoomRequest = async () => {
        try {
            if (!roomId) {
                throw new Error("Cannot get Room")
            }

            const response = await fetch(`${API_BASE_URL}/api/room/${roomId}`, {
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

    // const { data: room, isLoading: isGetRoomLoading } = useQuery('getRoom', getRoomRequest)
    const { data: room, isLoading: isGetRoomLoading } = useQuery(
        ['getRoom', roomId], 
        getRoomRequest,
        { enabled: !!roomId } // only fetch if roomId is available
    )
    
    return { room, isGetRoomLoading }
}