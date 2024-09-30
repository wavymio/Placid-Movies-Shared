import { useSocket } from '../contexts/SocketContext'
import React, { useEffect, useRef, useState } from 'react'
import { FaDownload, FaEdit, FaExpand, FaPause, FaPlay, FaUsers, FaVideo, FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa"
import { useNavigate, useParams } from 'react-router-dom'
import { FaGear, FaMessage } from 'react-icons/fa6'
import RoomSettingsPanel from '../components/RoomSettingsPanel'
import { useGetRoom } from '../api/RoomApi'
import { useQueryClient } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { useLoading } from '../contexts/LoadingContext'
import ChatBox from '../components/ChatBox'


const MyRoom = ({ scrollToTop }) => {
    const queryClient = useQueryClient()
    const { loggedInUser, isLoading: isAuthLoading } = useAuth()
    const { isRedirectLoading, setIsRedirectLoading } = useLoading()
    const { roomId } = useParams()
    const { room, isGetRoomLoading } = useGetRoom(roomId)
    const { socket, isSocketLoading } = useSocket()
    const [isVideoNotPlaying, setIsVideoNotPlaying] = useState(true)
    const [toggleVolume, setToggleVolume] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [bufferedRanges, setBufferedRanges] = useState([])
    const [isVideoHovered, setIsVideoHovered] = useState(false)
    const [isSeekbarHovered, setIsSeekbarHovered] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const videoRef = useRef(null) 
    const seekbarRef = useRef(null)
    const [openRoomSettingsBar, setOpenRoomSettingsBar] = useState(false)
    const navigate = useNavigate()
    const [isUseEffectLoading, setIsUseEffectLoading] = useState(true)
    const roomPageEndRef = useRef(null)
    const roomPageStartRef = useRef(null)

    const handlePlay = () => {
        setIsVideoNotPlaying(false)
        videoRef.current.play()
    }

    const handlePause = () => {
        setIsVideoNotPlaying(true)
        videoRef.current.pause()
    }

    const handleVolumeOn = () => {
        setToggleVolume(false)
        videoRef.current.muted = true
    }

    const handleVolumeMute = () => {
        setToggleVolume(true)
        videoRef.current.muted = false
    }

    const handleTimeUpdate = () => {
        const current = videoRef.current.currentTime
        const percent = (current / duration) * 100
        setCurrentTime(current)
        updateSeekbarGradient(percent, percent)
    }

    const handleMetaData = () => {
        setDuration(videoRef.current.duration)
    }

    const handleWaiting = () => {
        setIsLoading(true)
    }

    const handleCanPlay = () => {
        setIsLoading(false)
    }

    const handlePlaying = () => {
        setIsLoading(false)
    }

    const handleVideoClick = () => {
        if (isVideoNotPlaying) {
            handlePlay()
        } else {
            handlePause()
        }
        setTimeout(() => {
            setIsVideoHovered(false)
        }, 5000)
    }

    const handleSeek = (ev) => {
        const seekTime = (ev.target.value / 100) * duration
        videoRef.current.currentTime = seekTime
        setCurrentTime(seekTime)
        updateSeekbarGradient(ev.target.value, ev.target.value)
    }

    const handleSeekbarHover = (ev) => {
        const seekbarWidth = seekbarRef.current.offsetWidth
        const hoverPosition = ev.nativeEvent.offsetX
        const hoverPercent = (hoverPosition / seekbarWidth) * 100
        updateSeekbarGradient((currentTime / duration) * 100, hoverPercent)
    }

    const handleSeekbarLeave = () => {
        updateSeekbarGradient((currentTime / duration) * 100, (currentTime / duration) * 100)
    }

    const handleProgress = () => {
        const buffered = videoRef.current.buffered;
        const ranges = [];
        for (let i = 0; i < buffered.length; i++) {
            ranges.push({
                start: buffered.start(i),
                end: buffered.end(i)
            });
        }
        setBufferedRanges(ranges);
    }

    const handleContextMenu = (event) => {
        event.preventDefault()

        // Set the custom menu position
        // setMenuPosition({ x: event.pageX, y: event.pageY })
        // setIsMenuVisible(true)
    }

    const updateSeekbarGradient = (currentPercent, hoverPercent) => {
        const playedColor = 'rgba(255, 255, 255, 1)';  // Played part (solid white)
        const bufferedColor = 'rgba(255, 255, 255, 0.5)'; // Buffered part (semi-transparent white)
        const unplayedColor = 'rgba(255, 255, 255, 0.1)'; // Unplayed part (transparent white)
        const hoverColor = 'rgba(255, 255, 255, 0.5)'; // Hover part (slightly opaque white)
    
        // Start with the played part
        let gradient = `${playedColor} 0%, ${playedColor} ${currentPercent}%, `;
    
        // Add buffered ranges to the gradient
        bufferedRanges.forEach((range) => {
            const startPercent = (range.start / duration) * 100;
            const endPercent = (range.end / duration) * 100;
            if (endPercent > currentPercent) {
                const bufferStart = Math.max(currentPercent, startPercent);
                gradient += `${bufferedColor} ${bufferStart}%, ${bufferedColor} ${endPercent}%, `;
            }
        });
    
        // Add the hover effect
        if (hoverPercent >= currentPercent) {
            gradient += `${hoverColor} ${currentPercent}%, ${hoverColor} ${hoverPercent}%, `;
        }
    
        // Add the unplayed part
        gradient += `${unplayedColor} ${Math.max(currentPercent, hoverPercent)}%, ${unplayedColor} 100%`;
    
        // Apply the gradient to the seek bar
        seekbarRef.current.style.background = `linear-gradient(90deg, ${gradient})`;
    } 

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600)
        const minutes = Math.floor((time % 3600) / 60)
        const seconds = Math.floor(time % 60)
        return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    const userIsRejoining = sessionStorage.getItem(`userIsRejoining-${roomId}`)

    const handleRejoinRoom = () => {
        console.log("user rejoining")
        console.log(socket, " 2")
        sessionStorage.setItem(`userIsRejoining-${roomId}`, 'false')
        socket.emit('joinRoom', { roomId })
        setIsRedirectLoading(true)
    }

    const toggleRoomSettingsBar = () => {
        setOpenRoomSettingsBar(!openRoomSettingsBar)
    }

    const scrollToBottom = () => {
        roomPageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    
    useEffect(() => {  
        console.log("emitting...")

        console.log(socket, " 1")
        setTimeout(() => {            
            if (userIsRejoining) {
                if (socket && socket.connected && !isSocketLoading) {
                    handleRejoinRoom()
                    setIsUseEffectLoading(false)
                } else {
                    const intervalId = setInterval(() => {
                        if (socket && socket.connected && !isSocketLoading) {
                            handleRejoinRoom()
                            clearInterval(intervalId)
                            setIsUseEffectLoading(false)
                        }
                    }, 1000)
                }
            } else {
                setIsUseEffectLoading(false)
            }
        }, 1000)

        sessionStorage.setItem(`userIsRejoining-${roomId}`, 'true')

        return () => {    
            if (socket && sessionStorage.getItem(`userIsRejoining-${roomId}`)) {
                console.log("removing...")
                // sessionStorage.removeItem(`userIsRejoining-${roomId}`)
                socket.emit('leaveRoom')
            }
        }
    }, [socket, socket?.connected, roomId, isSocketLoading])

    useEffect(() => {
        if (videoRef.current && room?.video.videoUrl) {
            handlePlay()
        }
    }, [room?.video?.videoUrl])

    useEffect(() => {
        if (videoRef.current) {
            handleVolumeOn()
            handlePlay()
        }
    }, [isUseEffectLoading, isRedirectLoading, videoRef])

    if (isUseEffectLoading || !room || isSocketLoading || isAuthLoading || !socket) {
        return (
            <div className='overflow-y-hidden w-full h-[80vh] flex flex-col gap-7 items-center pt-[145px] lg:pt-[200px]'>
                <div className='big-loader'></div>
                <div className='text-xs font-bold'>LOADING ROOM...</div>
            </div>
        )
    }

    if (isRedirectLoading) {
        return (
            <div className='overflow-y-hidden w-full h-[80vh] flex flex-col gap-7 items-center pt-[145px] lg:pt-[200px]'>
                <div className='big-loader'></div>
                <div className='text-xs font-bold'>REDIRECTING TO ROOM...</div>
            </div>
        )
    }

    return (
        <>
            <div className='sm:block hidden' ref={roomPageStartRef}></div>
            <RoomSettingsPanel room={room} toggleRoomSettingsBar={toggleRoomSettingsBar} openRoomSettingsBar={openRoomSettingsBar} loggedInUser={loggedInUser} formatTime={formatTime} />
            <div onClick={toggleRoomSettingsBar} className='h-12 w-12 left-1 top-1/2 sm:left-0 sm:h-16 sm:w-16 animate-spin cursor-pointer flex items-center justify-center rounded-full  absolute z-10 transition-transform duration-300 ease-in-out hover:scale-105 bg-transparent backdrop-filter backdrop-blur-lg shadow-lg'>
                <FaGear
                    // style={{ fontSize: '20px' }}
                    className='h-[16px] w-[16px] sm:h-[20px] sm:w-[20px]'
                />
            </div>
            <div onClick={scrollToBottom} className='hidden lg:hidden cursor-pointer sm:flex items-center justify-center rounded-full h-16 w-16 absolute z-10 top-20 right-5 transition-transform duration-300 ease-in-out hover:scale-105 bg-transparent backdrop-filter backdrop-blur-lg shadow-lg'>
                <FaMessage
                    style={{ fontSize: '20px' }}
                />
            </div>

            <div className='-mt-6 xs:gap-0 sm:mt-0 flex flex-col sm:gap-5 w-full lg:flex lg:flex-row lg:items-center lg:gap-10 lg:h-[490px]'>
                <div 
                onMouseEnter={() => setIsVideoHovered(true)} 
                onMouseMove={() => setIsVideoHovered(true)} 
                onMouseLeave={() => setIsVideoHovered(false)} 
                className='h-[26vh] w-full xs:h-[31vh] sm:w-full sm:h-[80vh] sm:rounded-xl lg:w-2/3 lg:h-full lg:rounded-xl relative bg-neutral-900'>
                    <video 
                    ref={videoRef} 
                    onChange={handlePlay}
                    onClick={handleVideoClick} 
                    onLoadedMetadata={handleMetaData} 
                    onTimeUpdate={handleTimeUpdate} 
                    onProgress={handleProgress}
                    onContextMenu={handleContextMenu}
                    onWaiting={handleWaiting}
                    onCanPlay={handleCanPlay}
                    onPlaying={handlePlaying}
                    className='sm:rounded-xl lg:rounded-xl object-cover w-full h-full cursor-pointer' 
                    src={room?.video?.videoUrl}
                    controls={false}>
                    </video>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-50 sm:rounded-xl">
                            <div className='big-loader'></div>
                        </div>
                    )}
                    <div className={`absolute bottom-0 w-full px-2 pb-5 flex flex-col gap-4 ${isVideoHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                        <input ref={seekbarRef} type="range" className={`video-seekbar ${isSeekbarHovered ? 'thumb-visible' : 'thumb-hidden'}`}  
                            min={0} 
                            max={100} 
                            value={(currentTime/duration) * 100 || 0} 
                            onChange={handleSeek}
                            onMouseMove={(ev) => {
                                handleSeekbarHover(ev)
                                setIsSeekbarHovered(true) 
                            }}
                            onMouseLeave={() => {
                                handleSeekbarLeave()
                                setIsSeekbarHovered(false)
                            }}
                            step={0.1} />
                        <div className='flex items-center justify-between px-5 opacity-100'>
                            <div className='flex items-center gap-4'>
                                <div onClick={handlePlay} className={`${isVideoNotPlaying ? 'flex' : 'hidden'} items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out`}>
                                    <FaPlay className='h-[16px] w-[16px] xs:h-[25px] xs:w-[25px]' />
                                </div>   
                                <div onClick={handlePause} className={`${!isVideoNotPlaying ? 'flex' : 'hidden'} items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out`}>
                                    <FaPause className='h-[16px] w-[16px] xs:h-[25px] xs:w-[25px]' />
                                </div>
                                <div onClick={handleVolumeOn} className={`${toggleVolume ? 'flex' : 'hidden'} scale-110 items-center justify-center cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out`}>
                                    <FaVolumeDown className='h-[16px] w-[16px] xs:h-[25px] xs:w-[25px]' />
                                </div>
                                <div onClick={handleVolumeMute} className={`${!toggleVolume ? 'flex' : 'hidden'} scale-110 items-center justify-center cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out`}>
                                    <FaVolumeMute className='h-[16px] w-[16px] xs:h-[25px] xs:w-[25px]' />
                                </div>
                                <div  className={`flex items-center justify-center gap-1 font-semibold`}>
                                    <div className='text-xs xs:text-base w-6 xs:w-8'>{formatTime(currentTime)}</div><div className='text-xs xs:text-base'>/</div><div className='text-xs xs:text-base w-6 xs:w-8'>{formatTime(duration)}</div>
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out'>
                                    <FaDownload className='h-[16px] w-[16px] xs:h-[25px] xs:w-[25px]' />
                                </div>
                                <div className='flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out'>
                                    <FaExpand className='h-[16px] w-[16px] xs:h-[25px] xs:w-[25px]' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ChatBox room={room} loggedInUser={loggedInUser} socket={socket} scrollToTop={scrollToTop} />
            </div>
            <div ref={roomPageEndRef}></div>
        </>
    )
}

export default MyRoom
