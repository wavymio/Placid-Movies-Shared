import { useNavigate } from 'react-router-dom'
import { useCreateMyUser } from '../api/MyUserApi'
import LoginForm from '../components/LoginForm'
import React, { useState } from 'react'
import { useQueryClient } from 'react-query'

const SignUp = () => {
    const queryClient = useQueryClient()
    const { createUser, isLoading, isSuccess, isError, error } = useCreateMyUser() 
    const [response, setResponse] = useState({})
    const navigate = useNavigate()

    const handleSignUp = async (inputs) => {
        const res = await createUser(inputs)
        setResponse(res)
        if (res?.success) {
            await queryClient.invalidateQueries('validateUser')
            navigate('/')
        }
    }

    return (
        <LoginForm buttonText={"Sign Up"} bottomText={"Already have an account?"} bottomLinkText={"Sign In"} bottomLink={"/login"} handleLoginOrSignUp={handleSignUp} response={response} isLoading={isLoading} />
    )
}

export default SignUp
