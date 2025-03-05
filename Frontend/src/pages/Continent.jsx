import React, { useEffect, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { useNavigate, useParams } from 'react-router-dom'
import { continents, scaleAndMovePath, updateDimensions } from './SocietyMap'
import ContinentsGradients from '../components/ContinentsGradients'

export const handleZoomStop = (setScale, navigate, location, transformRef, zoomType, continentScale=0) => {
    const {state: transformState} = transformRef
    const currentScale = transformState.scale
    setScale(currentScale)
    console.log("Current scale:", currentScale)

    if (zoomType === "continentZoom" && currentScale <= 0.8) {
        navigate(location)
    }

    if (zoomType === "worldZoom" && currentScale >= continentScale + 0.5) {
        navigate(location)
    }
}
export const countryColour = "rgba(255, 255, 255, 0.15)"

const Continent = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const containerRef = useRef(null)
    const transformRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const [myContinent, setMyContinent] = useState({})
    const [scale, setScale] = useState(1)
    const [openCountryDetails, setOpenCountryDetails] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState({})

    const getContinentScale = (continent) => {
        if (!continent.name) return
        const continentScaleMap = {
            "Oceania": scaleAndMovePath(continent.path, 35, continent.dx-16200, continent.dy-8000),
            "Titanis": scaleAndMovePath(continent.path, 50, continent.dx-2800, continent.dy-15000),
            "Zentara": scaleAndMovePath(continent.path, 72, continent.dx-8000, continent.dy-35800),
            "Eldoria": scaleAndMovePath(continent.path, 100, continent.dx-13000, continent.dy-35000),
            "Lunaria": scaleAndMovePath(continent.path, 70, continent.dx-15300, continent.dy-16800),
            "Vastara": scaleAndMovePath(continent.path, 35, continent.dx-12800, continent.dy-3500),
            "Mythos": scaleAndMovePath(continent.path, 40, continent.dx-23700, continent.dy-22900),
        }

        return continentScaleMap[continent.name]
    }

    const handleCountryClick = (country, event) => {
        if (!transformRef.current) return
        const targetElement = event.currentTarget

        if (selectedCountry.name === country.name) {
            transformRef.current.resetTransform(1000, "easeOut")
            setOpenCountryDetails(false)
            setSelectedCountry({})
            return
        } else {
            setOpenCountryDetails(true)
            setSelectedCountry(country)
            transformRef.current.zoomToElement(targetElement, country.zoomScale, 1000, "easeOut")
        }
    }

    useEffect(() => {
        if(id) {
            const chosenContinent = continents.filter((continent) => parseInt(continent.id) === parseInt(id))[0]
            console.log(chosenContinent)
            setMyContinent(chosenContinent)
        }
    }, [id])

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
    
    if (!myContinent || !myContinent.path) return (<></>)
    return (
        <div className='w-[100%] h-[88vh] relative flex justify-center' ref={containerRef}>
            <TransformWrapper ref={transformRef} minScale={0.1} maxScale={30} initialScale={1} onZoomStop={(ref) => handleZoomStop(setScale, navigate, '/map', ref, "continentZoom")} centerOnInit limitToBounds={true}>
                <TransformComponent wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    // background: 'red'
                    background: myContinent.seaColor
                }}
                contentStyle={{ width: "100%", height: "100%" }}>
                    <svg width="100%" height="100%" 
                    className="relative w-[100%] h-[100%] "
                    viewBox={`-3500 -3500 ${dimensions.width + 8000} ${dimensions.height + 8000}`}
                    style={{ background: myContinent.seaColor }}
                    >
                        <ContinentsGradients />
                        <g key={myContinent.name}
                        // onClick={(e) => handleContinentClick(continent, e)} 
                        className='cursor-pointer'>
                            <path d={getContinentScale(myContinent)}  
                            fill={`url(#${myContinent.gradientId})`} stroke={myContinent.sand} strokeWidth="5" />

                            {myContinent.countries?.map(country => (
                                <path 
                                key={country.id} 
                                d={scaleAndMovePath(country.path, country.scale, country.dx, country.dy)}
                                fill={country.fill} 
                                stroke={selectedCountry.name === country.name ? myContinent.sand : ''} 
                                strokeWidth="3"
                                className="hover:opacity-75 cursor-pointer" 
                                onClick={(e) => handleCountryClick(country, e)}
                            />
                            ))}
                        </g>
                    </svg>
                </TransformComponent>
            </TransformWrapper>

            {openCountryDetails && (
                <div className={`white-opacity flex flex-col gap-4 room-event-animation w-[200px] lg:min-h-[300px] lg:h-fit lg:w-[300px] absolute
                top-10 right-10 lg:top-10 lg:left-10 rounded-3xl p-5 text-white`}>
                    <div className='text-md lg:text-xl font-normal h-[15%] text-end'>{selectedCountry.name}</div>
                    <div className='h-85% flex flex-col gap-6'>

                        <div className='flex flex-col gap-3 text-[10px] lg:text-xs items-start'>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Countries:</div>
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
                                <div>Minerals:</div>
                                <div>Gold, Silver</div>
                            </div>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Major Race:</div>
                                <div>Zentarian</div>
                            </div>
                            <div className='hidden lg:flex w-full items-center gap-4 justify-between'>
                                <div>Rank:</div>
                                <div>1</div>
                            </div>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Average Temp:</div>
                                <div>35°C</div>
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className='flex w-full items-center justify-end'>
                            <div onClick={() => navigate(`/map/country/${selectedCountry.id}`)}
                            className='py-3 lg:py-4 border-2 border-white rounded-lg w-[50%] lg:w-[35%] text-center cursor-pointer text-[10px] lg:text-xs font-bold tracking-wide hover:bg-white hover:text-black transition-all ease-out duration-500'>Explore</div>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default Continent
