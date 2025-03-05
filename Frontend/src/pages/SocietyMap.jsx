import ContinentsGradients from '../components/ContinentsGradients'
import Birds from '../components/Birds'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { countryColour, handleZoomStop } from './Continent'

export const continents = [
    { 
        id: 1,
        name: "Eldoria", gradientId: "eldoriaGradient", sand: "#E5C07B", 
        path: "M160,440 L180,445 L200,430 L210,450 L205,470 L180,490 L160,485 L140,470 L135,455 L150,445 Z",
        scale: 5,
        seaColor: "#0169a4",
        dx: -3800, dy: -10450 
    },
    { 
        id: 2,
        name: "Vastara", gradientId: "vastaraGradient", sand: "#D2B48C",
        path: "M320,90 L390,110 L430,160 L440,220 L410,270 L350,280 L290,240 L300,150 Z", // Irregular Octagon
        scale: 2.5,
        seaColor: "#036298",
        dx: 800, dy: -2250 
    },
    { 
        id: 3,
        name: "Oceania", gradientId: "oceaniaGradient", sand: "#CDAA6D",
        path: "M580,210 L630,240 L680,280 L700,340 L680,390 L630,420 L570,400 L530,340 L550,270 Z", // Irregular Nonagon
        scale: 5,
        seaColor: "#036093",
        dx: -4750, dy: -2000,
        countries: [{ 
            id: 1, name: "Tavros", 
            path: "M180,380 L210,390 L230,410 L240,430 L230,450 L210,470 L190,480 L160,470 L140,450 L150,420 L160,400 Z",
            dx: -2250, dy: -3700, scale: 17, 
            fill: countryColour, stroke: ""
        },
        { 
            id: 2, name: "Borith", 
            path: "M250,460 L270,470 L300,480 L320,500 L310,520 L290,530 L260,540 L240,530 L230,500 L240,480 L245,470 Z",
            dx: -8490, dy: -14000, scale: 29,
            fill: countryColour, stroke: ""
        },
        { 
            id: 3, name: "Geldar", 
            path: "M100,520 L130,530 L160,540 L180,560 L170,580 L150,590 L120,580 L90,570 L80,550 L85,530 L95,525 Z",
            dx: -1820, dy: -14300, scale: 29,
            fill: countryColour, stroke: ""
        },
        { 
            id: 4, name: "Zephyria", 
            path: "M290,410 L320,420 L340,440 L350,460 L340,480 L320,500 L300,510 L280,500 L260,480 L270,450 L280,430 Z",
            dx: -6450, dy: -10650, scale: 20, 
            fill: countryColour, stroke: ""
        },
        { 
            id: 5, name: "Morvath", 
            path: "M140,580 L170,590 L200,600 L210,620 L190,640 L160,650 L130,640 L100,620 L110,600 L120,590 L130,585 Z",
            dx: -3850, dy: -10400, scale: 21,
            fill: countryColour, stroke: ""
        },
        { 
            id: 6, name: "Vexora", 
            path: "M220,350 L250,360 L270,380 L280,400 L270,420 L250,440 L230,450 L200,440 L180,420 L190,390 L200,370 Z",
            dx: -2150, dy: -6600, scale: 16, 
            fill: countryColour, stroke: ""
        }]
    },
    { 
        id: 4,
        name: "Zentara", gradientId: "zentaraGradient", sand: "#A68A64", 
        path: "M120,660 L150,670 L180,680 L200,700 L190,720 L160,730 L130,720 L100,710 L90,690 L100,670 L110,665 Z",
        scale: 3.5,
        seaColor: "#045a87",
        dx: -1800, dy: -13500  
    },
    { 
        id: 5,
        name: "Mythos", gradientId: "mythosGradient", sand: "#E5C07B",
        path: "M490,420 L560,450 L590,500 L600,550 L580,580 L530,600 L480,580 L450,530 L460,470 Z", // Jagged Nonagon
        scale: 5,
        seaColor: "#093848",
        dx: 3350, dy: 3350 
    },
    { 
        id: 6,
        name: "Titanis", gradientId: "titanisGradient", sand: "#D2B48C",
        path: "M110,410 L160,440 L210,460 L250,500 L240,540 L190,570 L130,550 L90,510 L100,470 Z", // Different Nonagon
        scale: 2.0,
        seaColor: "linear-gradient(to bottom, #034B72, #0A2E36)",
        dx: -5050, dy: -8500,
        countries: [
            { 
                id: 1, name: "Eldan", 
                path: "M120,420 L140,425 L180,440 L200,455 L210,470 L190,485 L170,500 L140,495 L110,480 L115,450 L120,435 Z",
                dx: -2750, dy: -5450, scale: 20, 
                fill: countryColour, stroke: "",
                zoomScale: 4
            },
            { 
                id: 2, name: "Vornar", 
                path: "M200,430 L225,440 L250,460 L265,470 L270,490 L250,500 L220,510 L200,505 L180,490 L185,460 L195,445 Z",
                dx: -8100, dy: -15600, scale: 30,
                fill: countryColour, stroke: "",
                zoomScale: 3
            },
            { 
                id: 3, name: "Zeroth", 
                path: "M300,450 L320,460 L340,470 L350,490 L330,510 L310,520 L290,530 L270,515 L260,495 L270,490 L280,470 Z",
                dx: -5950, dy: -13000, scale: 30,
                fill: countryColour, stroke: "",
                zoomScale: 3
            },
            { 
                id: 4, name: "Mythara", 
                path: "M220,510 L250,505 L270,490 L290,505 L290,530 L270,540 L250,550 L230,545 L210,530 L215,520 L220,515 Z",
                dx: -8850, dy: -15200, scale: 30, 
                fill: countryColour, stroke: "",
                zoomScale: 4
            },
            { 
                id: 5, name: "Xendar", 
                path: "M130,550 L150,560 L190,570 L210,580 L220,600 L200,610 L170,620 L140,610 L120,600 L125,575 L130,560 Z",
                dx: -2450, dy: -12400, scale: 20,
                fill: countryColour, stroke: "",
                zoomScale: 4
            },
            { 
                id: 6, name: "Thalios", 
                path: "M240,540 L260,545 L280,550 L300,565 L310,580 L300,595 L280,600 L260,595 L250,590 L245,570 L240,550 Z",
                dx: -5350, dy: -12000, scale: 22,
                fill: countryColour, stroke: "",
                zoomScale: 5
            },
            { 
                id: 7, name: "Kryth", 
                path: "M90,510 L110,520 L130,550 L125,570 L120,600 L100,590 L80,570 L75,550 L70,530 L80,520 Z",
                dx: -2050, dy: -9350, scale: 20,
                fill: countryColour, stroke: "",
                zoomScale: 4
            },
            { 
                id: 8, name: "Norath", 
                path: "M100,470 L110,485 L90,510 L80,520 L70,530 L60,520 L50,500 L55,480 L60,490 L80,460 L90,455 Z",
                dx: -3750, dy: -12400, scale: 30, 
                fill: countryColour, stroke: "",
                zoomScale: 3
            },
            { 
                id: 9, name: "Solmara", 
                path: "M160,440 L180,445 L200,430 L210,450 L205,470 L180,490 L160,485 L140,470 L135,455 L150,445 Z",
                dx: -1450, dy: -5800, scale: 20.2,
                fill: countryColour, stroke: "",
                zoomScale: 5
            },
            { 
                id: 10, name: "Drakar", 
                path: "M250,500 L270,510 L290,530 L285,540 L270,550 L250,560 L230,550 L220,530 L225,520 L240,510 Z",
                dx: -3850, dy: -8400, scale: 20,
                fill: countryColour, stroke: "",
                zoomScale: 5
            },
            { 
                id: 11, name: "Velmora", 
                path: "M280,420 L310,430 L330,450 L340,470 L330,490 L310,500 L290,510 L270,500 L250,480 L260,450 L270,430 Z",
                dx: -450, dy: 1200, scale: 7, 
                fill: countryColour, stroke: "",
                zoomScale: 6
            },
            { 
                id: 12, name: "Durnak", 
                path: "M150,480 L170,490 L190,500 L210,520 L220,540 L200,550 L180,560 L160,550 L140,530 L135,500 L140,490 Z",
                dx: -5050, dy: -6200, scale: 14.5,
                fill: countryColour, stroke: "",
                zoomScale: 6
            },
            { 
                id: 13, name: "Zaldris", 
                path: "M350,500 L380,510 L400,530 L390,550 L370,570 L350,580 L330,570 L310,550 L300,530 L320,510 L330,500 Z",
                dx: -2450, dy: -6750, scale: 13,
                fill: countryColour, stroke: "",
                zoomScale: 5
            }
        ] 
    }, 
    {
        id: 7,
        name: "Lunaria", gradientId: "lunariaGradient", sand: "#CDAA6D",
        path: "M260,320 L290,330 L310,350 L320,370 L310,390 L290,410 L270,420 L240,410 L220,390 L230,360 L240,340 Z",
        scale: 3.5,
        seaColor: "#016faf",
        dx: -2900, dy: -8250
    },
    
]

export const scaleAndMovePath = (path, scaleFactor, dx, dy) => {
    return path.replace(/([ML])([0-9.-]+),([0-9.-]+)/g, (match, command, x, y) => {
      const newX = parseFloat(x) * scaleFactor + dx
      const newY = parseFloat(y) * scaleFactor + dy
      return `${command}${newX},${newY}`
    })
}

export const updateDimensions = (ref, setDimensions) => {
    if (ref.current) {
        return setDimensions({
            width: ref.current.clientWidth,
            height: ref.current.clientHeight,
        })
    }
}

const SocietyMap = () => {
    const navigate = useNavigate()
    const containerRef = useRef(null)
    const transformRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const [openContinentDetails, setOpenContinentDetails] = useState(false)
    const [selectedContinent, setSelectedContinent] = useState({})
    const [scale, setScale] = useState(1)

    const handleContinentClick = (continent, event) => {
        if (!transformRef.current) return
        const targetElement = event.currentTarget

        if (selectedContinent.name === continent.name) {
            transformRef.current.resetTransform(1000, "easeOut")
            setOpenContinentDetails(false)
            setSelectedContinent({})
            return
        } else {
            setOpenContinentDetails(true)
            setSelectedContinent(continent)
            transformRef.current.zoomToElement(targetElement, continent.scale, 1000, "easeOut")
        }
    }

    const getCardPosition = (name) => {
        const cardPositionMap = {
            "Oceania": "top-5 right-5",
            "Titanis": "top-5 right-5",
            "Zentara": "bottom-5 right-5",
            "Eldoria": "top-5 left-5",
            "Lunaria": "bottom-5 right-5",
            "Vastara": "bottom-5 left-5",
            "Mythos": "top-5 left-5",
        }

        return cardPositionMap[name]
    }

    useEffect(() => {
        if (!containerRef?.current) return
        updateDimensions(containerRef, setDimensions) // Set initial size
        window.addEventListener("resize", updateDimensions(containerRef, setDimensions))
        return () => window.removeEventListener("resize", updateDimensions(containerRef, setDimensions))
    }, [containerRef.current])

    return (
        <div className='w-[100%] h-[88vh] relative flex justify-center'>
            <TransformWrapper ref={transformRef} minScale={0.1} maxScale={30} initialScale={1} centerOnInit limitToBounds={true}
            onZoomStop={(ref) => selectedContinent?.id ? handleZoomStop(setScale, navigate, `/map/continent/${selectedContinent.id}`, ref, "worldZoom", selectedContinent.scale) : null}>
                <TransformComponent wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to bottom, #0077BE, #0A2E36)"
                }}
                contentStyle={{ width: "100%", height: "100%" }}>
                    <svg width="100%" height="100%" 
                        className="relative w-[100%] h-[100%] "
                        viewBox={`-3500 -3500 ${dimensions.width + 8000} ${dimensions.height + 8000}`}
                        style={{ background: "linear-gradient(to bottom, #0077BE, #0A2E36)" }}
                        // style={{ background: "linear-gradient(to bottom, #0A2E36, #74C0FC, #0077BE,  #0077BE, #74C0FC, #0A2E36)" }}
                    >
                        <ContinentsGradients />

                        {/* Continents */}
                        {continents.map((continent) => (
                            <g key={continent.name} onClick={(e) => handleContinentClick(continent, e)} className='cursor-pointer'>
                                <path d={scaleAndMovePath(continent.path, 
                                    continent.name === "Titanis" ? 22 
                                    : continent.name === "Lunaria" ? 17 
                                    : continent.name === "Vastara" ? 9
                                    : continent.name === "Zentara" ? 19.5
                                    : continent.name === "Oceania" ? 4.5
                                    : continent.name === "Mythos" ? 2.5
                                    : 20, continent.dx, continent.dy)}  fill={`url(#${continent.gradientId})`} stroke={continent.sand} strokeWidth="5" />
                            </g>
                        ))}

                        {/* Birds */}
                        <Birds />
                    </svg>
                </TransformComponent>
            </TransformWrapper>
            {openContinentDetails && (
                <div className={`white-opacity flex flex-col gap-4 room-event-animation w-[200px] lg:min-h-[300px] lg:h-fit lg:w-[300px] absolute
                ${getCardPosition(selectedContinent.name)} lg:top-10 lg:left-10 rounded-3xl p-5 text-white`}>
                    <div className='text-md lg:text-xl font-normal h-[15%] text-end'>{selectedContinent.name}</div>
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
                            <div onClick={() => navigate(`/map/continent/${selectedContinent.id}`)}
                            className='py-3 lg:py-4 border-2 border-white rounded-lg w-[50%] lg:w-[35%] text-center cursor-pointer text-[10px] lg:text-xs font-bold tracking-wide hover:bg-white hover:text-black transition-all ease-out duration-500'>Explore</div>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default SocietyMap
