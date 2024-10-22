import { useMutation, useQuery } from "react-query"
import { useToast } from "../contexts/ToastContext"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const useGetMyUser = () => {
    const { addToast } = useToast()

    const getMyUserRequest = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my/user/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json" 
                },
                credentials: "include",
            })

            if (!response.ok) {
                if (response.status === 500) {
                    const error = await response.json()
                    addToast("error", error.error)
                }
                throw new Error()
            }

            const data = await response.json()
            return data

        } catch (err) {
            console.log(err)
            if (err.message === "Failed to fetch") {
                addToast("error", "Network Error")
            }
        }
    }

    const { data:userInfo, isLoading, isError } = useQuery("validateUser", getMyUserRequest, {
        retry: false
    })

    return { userInfo, isLoading, isError }
}

export const useGetMyUserActivity = (userId) => {
    const { addToast } = useToast()

    const useGetMyUserActivityRequest = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my/user/activity`, {
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
            // addToast("error", (err.message === "Failed to fetch" ? "Network Error" : err.message))
        }
    }

    const { data: userActivity, isLoading: isGetMyActivityLoading } = useQuery(['getUserActivity', userId], useGetMyUserActivityRequest, {
        enabled: !!userId
    })

    return { userActivity, isGetMyActivityLoading }
}

export const useLogoutMyUser = () => {
    const { addToast } = useToast()

    const logoutMyUserRequest = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my/user/logout`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error()
            }

            const data = await response.json()
            addToast("success", data.success)
            return data
        } catch (err) {
            console.log(err)
            addToast("error", (err.message === "Failed to fetch" ? "Network Error" : err.message))
        }
    }

    const { mutateAsync:logoutUser, isLoading, isSuccess } = useMutation(logoutMyUserRequest)

    return { logoutUser, isLoading, isSuccess }
}

export const useCreateMyUser = () => {
    const { addToast } = useToast()

    const createMyUserRequest = async (user) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(user)
            })
    
            if (!response.ok) {
                const error = await response.json() 
                    if (response.status === 409) {
                        return error
                    }    
                throw new Error(error.error)
            }
            
            const data = await response.json()
            if (data.success) {
                addToast("success", data.success)
            }
            return data
        } catch (err)  {
            addToast("error", (err.message === "Failed to fetch" ? "Network Error" : err.message))
        }
        
    }

    const {mutateAsync: createUser, isSuccess, isError, isLoading, error} = useMutation(createMyUserRequest)   

    return {createUser, isLoading, isError, isSuccess, error}
}

export const usePatchEditMyUser = () => {
    const { addToast } = useToast()

    const patchEditMyUserRequest = async (inputs) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my/user/edit/username`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(inputs)
            })
    
            if (!response.ok) {
                const error = await response.json() 
                    if (response.status === 409) {
                        return error
                    }    
                throw new Error(error.error)
            }
            
            const data = await response.json()
            if (data.success) {
                addToast("success", data.success)
            }
            return data
        } catch (err) {
            addToast("error", (err.message === "Failed to fetch" ? "Network Error" : err.message))
        }
    }

    const { mutateAsync: patchEditUser, isLoading } = useMutation(patchEditMyUserRequest)

    return { patchEditUser, isLoading }
}

export const usePatchEditMyUserProfilePic = () => {
    const { addToast } = useToast()

    const patchEditMyUserProfilePicRequest = async (inputs) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my/user/edit/profile-picture`, {
                method: "PATCH",
                credentials: 'include',
                body: inputs
            })
    
            if (!response.ok) {  
                throw new Error()
            }
            
            const data = await response.json()
            if (data.success) {
                addToast("success", data.success)
            }
            return data
        } catch (err) {
            addToast("error", (err.message === "Failed to fetch" ? "Network Error" : err.message))
        }
    }

    const { mutateAsync: patchEditUserProfilePic, isLoading } = useMutation(patchEditMyUserProfilePicRequest)

    return { patchEditUserProfilePic, isLoading }
}

export const useLoginMyUser = () => {
    const { addToast } = useToast()

    const loginMyUserRequest = async (user) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(user)
            })
    
            if (!response.ok) {
                const error = await response.json() 
                    if (response.status === 400) {
                        return error
                    }    
                throw new Error(error.error)
            }
            
            const data = await response.json()
            if (data.success) {
                addToast("success", data.success)
            }
            return data
        } catch (err)  {
            addToast("error", (err.message === "Failed to fetch" ? "Network Error" : err.message))
        }
        
    }

    const {mutateAsync: loginUser, isSuccess, isError, isLoading, error} = useMutation(loginMyUserRequest)   

    return {loginUser, isLoading, isError, isSuccess, error}
}