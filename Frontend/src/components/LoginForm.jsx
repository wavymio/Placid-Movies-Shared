import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LoginForm = ({ buttonText, bottomText, bottomLinkText, bottomLink, handleLoginOrSignUp, response, isLoading }) => {
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    })
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const { pathname: location } = useLocation()

    useEffect(() => {
        if (response?.error) {
            setUsernameError(response.error)
            if (location === "/login") {
                setPasswordError(response.error)
            }
        }
    }, [response])

    const onSubmit = (e) => {
        e.preventDefault()
        if (location === "/signup") {
            if (!inputs.username && !inputs.password) {
                setUsernameError("Please choose a username")
                setPasswordError("Please choose a password")
                return
            } else if (!inputs.username && inputs.password) {
                setUsernameError("Please choose a username")
                if (inputs.password.length < 8) {
                    setPasswordError("Your password must be at least 8 characters long")
                    return
                }
                setPasswordError("")
                return 
            } else if (inputs.username > 28) {
                setUsernameError("Username is too Long")
                setPasswordError("")
                return
            } else if (inputs.username && !inputs.password) {
                setUsernameError("")
                setPasswordError("Please choose a password")
                return
            } else if (inputs.username && inputs.password && inputs.password.length < 8) {
                setUsernameError('')
                setPasswordError("Your password must be at least 8 characters long")
                return
            } else {
                setUsernameError('')
                setPasswordError('')
                handleLoginOrSignUp(inputs)            
            }
        } else if (location === "/login") {
            handleLoginOrSignUp(inputs)
        }
    }

    return (
        <div className='mt-14 sm:mt-20 text-white flex items-center justify-center'>
            <div className='border-neutral-800 border bg-neutral-800 bg-opacity-40 backdrop-blur-lg flex flex-col items-center gap-6 sm:p-10 p-8 sm:min-w-96 w-64 rounded-lg'>
                <form className='w-full' onSubmit={onSubmit}>
                    <div className=' flex flex-col w-full gap-6'>
                        <div className='w-full flex flex-col items-left'>
                            <input value={inputs.username} onChange={(e) => setInputs({...inputs, username: e.target.value.toLowerCase()})} className='w-full p-3 rounded-lg border border-neutral-800 bg-inherit focus:outline-none focus:ring-1 focus:ring-neutral-800 placeholder-neutral-200 placeholder:text-sm' placeholder='Username' />
                            {usernameError && (<span className='text-xs ml-1 mt-1 text-red-500'>{usernameError}</span>)}
                        </div>
                        <div className='w-full flex flex-col items-left'>
                            <input value={inputs.password} onChange={(e) => setInputs({...inputs, password: e.target.value})} className='w-full p-3 rounded-lg border border-neutral-800 bg-inherit focus:outline-none focus:ring-1 focus:ring-neutral-800 placeholder-neutral-200 placeholder:text-sm' placeholder='Password' type='password' />
                            {passwordError && (<span className='text-xs ml-1 mt-1 text-red-500'>{passwordError}</span>)}
                        </div>
                        <button className={`p-3 rounded-lg font-bold bg-neutral-800 tracking-tightest hover:bg-neutral-900 border-white border-1 transition-colors ease-in-out duration-300`} type='submit' disabled={isLoading}>{isLoading ? (
                            <span className='loader'></span>
                        ) : (
                            buttonText
                        )}</button>
                    </div>
                </form>
                <div className='text-xs hidden xs:block'>{bottomText} <Link className='text-neutral-400 hover:text-neutral-500' to={`${bottomLink}`}>{bottomLinkText}</Link></div>
                <div className='text-xs flex justify-center items-center gap-1 whitespace-nowrap xs:hidden'>{bottomText}<Link className='text-neutral-400 hover:text-neutral-500' to={`${bottomLink}`}> {bottomLinkText}</Link></div>
            </div>
        </div>
    )
}

export default LoginForm
