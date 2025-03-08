import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { countryColour, handleZoomStop } from './Continent'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { continents, scaleAndMovePath, updateDimensions } from './SocietyMap'
import { useTimeFilter } from '../hooks/timeFilter'

const Country = () => {
    const { continentId, countryId } = useParams()
    const navigate = useNavigate()
    const containerRef = useRef(null)
    const transformRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const [myContinent, setMyContinent] = useState({})
    const [myCountry, setMyCountry] = useState({})
    const [scale, setScale] = useState(1)
    const [openCityDetails, setOpenCityDetails] = useState(false)
    const [selectedCity, setSelectedCity] = useState({})
    const timeFilter = useTimeFilter(myCountry?.timeZoneOffset ?? 0)

    const handleCityClick = (city, event) => {
        if (!transformRef.current) return
        const targetElement = event.currentTarget

        if (selectedCity.name === city.name) {
            transformRef.current.resetTransform(1000, "easeOut")
            setOpenCityDetails(false)
            setSelectedCity({})
            return
        } else {
            setOpenCityDetails(true)
            setSelectedCity(city)
            transformRef.current.zoomToElement(targetElement, city.zoomScale, 1000, "easeOut")
        }
    }
    
    useEffect(() => {
        if(countryId && continentId) {
            const chosenContinent = continents.filter((continent) => parseInt(continent.id) === parseInt(continentId))[0]
            const chosenCountry = chosenContinent["countries"].filter((country) => parseInt(country.id) === parseInt(countryId))[0]
            console.log(chosenCountry)
            console.log(chosenContinent)
            setMyContinent(chosenContinent)
            setMyCountry(chosenCountry)
        }
    }, [countryId, continentId])

    useEffect(() => {
        if (!containerRef?.current) return
        updateDimensions(containerRef, setDimensions) // Set initial size
        const handleResize = () => updateDimensions(containerRef, setDimensions)
        
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [containerRef.current])

    useEffect(() => {
        console.log(dimensions, "Changed")
    }, [dimensions])
    
    if (!myContinent || !myContinent.path || !myCountry.path) return (<></>)

    return (
        <div className='w-[100%] h-[88vh] relative flex justify-center' ref={containerRef}>
            <TransformWrapper ref={transformRef} minScale={0.1} maxScale={30} initialScale={1} 
            onZoomStop={(ref) => handleZoomStop(setScale, navigate, `/map/continent/${myContinent.id}`, ref, "countryZoomOut")} 
            centerOnInit limitToBounds={true}>
                <TransformComponent wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    background: myCountry.surroundingColor
                }}
                contentStyle={{ width: "100%", height: "100%" }}>
                    <svg width="100%" height="100%" 
                    className="relative w-[100%] h-[100%] "
                    viewBox={`-3500 -3500 ${dimensions.width + 8000} ${dimensions.height + 8000}`}
                    style={{ background: `rgba(0, 0, 0, ${timeFilter})` }}
                    >
                        <g key={myCountry.id}
                        className='cursor-pointer'>
                            <path d={scaleAndMovePath(myCountry.path, myCountry.largeScale, myCountry.largeDx, myCountry.largeDy)}  
                            fill={countryColour} stroke={myContinent.sand} strokeWidth="5" />

                            {myCountry.cities?.map(city => (
                                <path 
                                key={city.id} 
                                d={scaleAndMovePath(city.path, city.scale, city.dx, city.dy)}
                                fill={countryColour} 
                                stroke={city.island ? '#A68A64' : selectedCity.name === city.name ? myContinent.sand : ''} 
                                strokeWidth="3"
                                className="hover:opacity-75 cursor-pointer" 
                                onClick={(e) => handleCityClick(city, e)}
                            />
                            ))}
                        </g>
                    </svg>
                </TransformComponent>
            </TransformWrapper>

            {openCityDetails && (
                <div className={`${myContinent?.name === "Eldoria" ? "black-opacity-card" : "white-opacity"} flex flex-col gap-4 room-event-animation w-[200px] lg:min-h-[300px] lg:h-fit lg:w-[300px] absolute
                top-10 right-10 lg:top-10 lg:left-10 rounded-3xl p-5 text-white`}>
                    <div className='text-md lg:text-xl font-normal h-[15%] text-end'>{selectedCity.name}</div>
                    <div className='h-85% flex flex-col gap-6'>

                        <div className='flex flex-col gap-3 text-[10px] lg:text-xs items-start'>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Cities:</div>
                                <div className=''>53</div>
                            </div>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Population:</div>
                                <div>95</div>
                            </div>
                            <div className='hidden lg:flex w-full items-center gap-4 justify-between'>
                                <div>Fatality Rate:</div>
                                <div>43%</div>
                            </div>
                            <div className='hidden lg:flex w-full items-center gap-4 justify-between'>
                                <div>Natural Resources:</div>
                                <div>Gold, Silver</div>
                            </div>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Major Race:</div>
                                <div>Zentarian</div>
                            </div>
                            {/* <div className='hidden lg:flex w-full items-center gap-4 justify-between'>
                                <div>Rank:</div>
                                <div>1</div>
                            </div> */}
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Average Temp:</div>
                                <div>35°C</div>
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className='flex w-full items-center justify-end'>
                            <div onClick={() => navigate(`/map/city/${myContinent.id}/${myCountry.id}/${selectedCity.id}`)}
                            className='py-3 lg:py-4 border-2 border-white rounded-lg w-[50%] lg:w-[35%] text-center cursor-pointer text-[10px] lg:text-xs font-bold tracking-wide hover:bg-white hover:text-black transition-all ease-out duration-500'>Explore</div>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default Country
