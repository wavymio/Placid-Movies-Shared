import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { continents, updateDimensions } from './SocietyMap'
import { countryColour, countryColour2, handleZoomStop } from './Continent'
import house1 from '../assets/house1.avif'
import house2 from '../assets/house2.avif'
import house3 from '../assets/house3.avif'
import house4 from '../assets/house4.avif'
import house5 from '../assets/house5.avif'
import house6 from '../assets/house6.avif'
import house7 from '../assets/house7.avif'
import house8 from '../assets/house8.avif'
import { debounce } from 'lodash'
import LandImage from '../components/LandImage'
import { FaSkullCrossbones, FaUser } from 'react-icons/fa'
import { useTimeFilter } from '../hooks/timeFilter'

const City = () => {
    const { continentId, countryId, cityId } = useParams()
    const navigate = useNavigate()
    const containerRef = useRef(null)
    const transformRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const [myContinent, setMyContinent] = useState({})
    const [myCountry, setMyCountry] = useState({})
    const [myCity, setMyCity] = useState({})
    const [scale, setScale] = useState(1)
    const [openLandDetails, setOpenLandDetails] = useState(false)
    const [selectedLand, setSelectedLand] = useState({})
    const [hasZoomedToUser, setHasZoomedToUser] = useState(false)
    const timeFilter = useTimeFilter(myCity?.timeZoneOffset ?? 0)


    // Land/Room Rendering 
    const totalRooms = 1000
    const gridWidth = 50 // Number of columns
    const gridHeight = Math.ceil(totalRooms / gridWidth)
    const centerX = Math.floor(gridWidth / 2);
    const centerY = Math.floor(gridHeight / 2);

    const existingRooms = [
        { id: 1, owner: "User123", building: house1, buildingType: "home", lights: true},
        { id: 2, owner: "User123", building: house2, buildingType: "school", lights: false},
        { id: 3, owner: "User123", building: house3, buildingType: "church", lights: false},
        { id: 5, owner: "User123", building: house4, buildingType: "hospital", lights: true},
        { id: 6, owner: "User123", building: house7, buildingType: "police station", lights: true},
        { id: 7, owner: "User123", building: house3, buildingType: "restaurant", lights: false},
        { id: 8, owner: "User123", building: house1, buildingType: "mall", lights: false},
        { id: 9, owner: "User123", building: house8, buildingType: "art gallery", lights: true},
        { id: 10, owner: "User123", building: house6, buildingType: "hiking resort", lights: false},
        { id: 11, owner: "User123", building: house5, buildingType: "supermarket", lights: true},
        { id: 12, owner: "User123", building: house5, buildingType: "government premises", lights: true},
        { id: 13, owner: "User123", building: house4, buildingType: "military base", lights: true},
        { id: 14, owner: "User123", building: house2, buildingType: "night club", lights: false},
        { id: 15, owner: "User123", building: house1, buildingType: "cinema", lights: true},
        { id: 16, owner: "User123", building: house8, buildingType: "bar", lights: false},
        { id: 4, owner: "User123", building: house7, buildingType: "city hall", lights: false},
        { id: 51, owner: "User123", building: house4, buildingType: "bus park", lights: false},
        { id: 52, owner: "User123", building: house2, buildingType: "musuem", lights: true},
        { id: 53, owner: "User123", building: house1, buildingType: "capital building", lights: true},
        { id: 54, owner: "User123", building: house1, buildingType: "recreational park", lights: false},
        { id: 55, owner: "User123", building: house6, buildingType: "hotel", lights: true},
        { id: 56, owner: "User123", building: house8, buildingType: "library", lights: true},
        { id: 57, owner: "User123", building: house5, buildingType: "gun store", lights: true},
        { id: 58, owner: "User123", building: house5, buildingType: "fire department", lights: false},
        { id: 59, owner: "User123", building: house3, buildingType: "home", lights: false},
        { id: 60, owner: "User123", building: house4, buildingType: "post office", lights: true},
        { id: 61, owner: "User123", building: house1, buildingType: "sports center", lights: false},
        { id: 62, owner: "User123", building: house8, buildingType: "coffee shop", lights: true},
        { id: 63, owner: "User123", building: house7, buildingType: "farmer's market", lights: false},
        { id: 64, owner: "User123", building: house6, buildingType: "butchery", lights: true},
        { id: 65, owner: "User123", building: house3, buildingType: "bank", lights: true},
        { id: 66, owner: "User123", building: house4, buildingType: "jail", lights: false},
        { id: 101, owner: "User123", building: house6, buildingType: "airport", lights: false},
        { id: 102, owner: "User123", building: house8, buildingType: "gym", lights: true},
        { id: 103, owner: "User123", building: house3, buildingType: "prison", lights: true},
        { id: 104, owner: "User123", building: house1, buildingType: "pharmacy", lights: false},
        { id: 105, owner: "User123", building: house5, buildingType: "spa", lights: true},
        { id: 106, owner: "User123", building: house7, buildingType: "zoo", lights: false},
    ]

    const [viewport, setViewport] = useState({
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height,
    })

    const debouncedSetViewport = useCallback(
        debounce((newViewport) => {
          setViewport(newViewport);
        }, 100), // Adjust delay as needed
        []
    );

    const [filteredRooms, setFilteredRooms] = useState([])

    const roomSlots = useRef(
        Array.from({ length: totalRooms }, (_, index) => ({
            id: index + 1,
            x: (index % gridWidth) * 61, // Increased from 60 to 70
            y: Math.floor(index / gridWidth) * 61, // Increased from 60 to 70
        }))
    )

    const userLocation = null

    const waterPatchClusters = [
        { startX: centerX - 3, startY: centerY - 3, size: 5 }
    ]
    
    const roomsWithStatus = useRef(
        roomSlots.current.map((slot) => {
            const room = existingRooms.find((r) => r.id === slot.id)
            const withWater = waterPatchClusters.some((cluster) => {
                const roomX = slot.x / 61;
                const roomY = slot.y / 61;
                return (
                    roomX >= cluster.startX &&
                    roomX < cluster.startX + cluster.size &&
                    roomY >= cluster.startY &&
                    roomY < cluster.startY + cluster.size
                );
            });
            return {
                ...slot,
                exists: !!room,
                owner: room ? room.owner : null,
                width: withWater ? 61 : 60,
                height: withWater ? 61 : 60,
                waterPatch: !!withWater,
                building: room ? room.building : null,
                lights: room ? !!room.lights : null,
                buildingType: room?.building ? room.buildingType : null
            }
        })
    )

    const handlePanningStop = (ref) => {
        const { positionX, positionY, scale } = ref.state
        setScale(scale)

        debouncedSetViewport((prev) => ({
            ...prev,
            x: -positionX / scale,
            y: -positionY / scale,
        }))
        // console.log("panned")
    }
    
    const handleZoomStop = (transformRef) => {
        const {state: transformState} = transformRef
        const { scale: currentScale, positionX, positionY} = transformState
        setScale(currentScale)

        debouncedSetViewport((prev) => ({
            ...prev,
            x: -positionX / scale,
            y: -positionY / scale,
        }))
        // console.log("Zoom detected, scale:", currentScale)
    }

    const handleTransform = (transformRef) => {
        // console.log("transforming")
        const {state: transformState} = transformRef
        const { scale: currentScale, positionX, positionY} = transformState
        debouncedSetViewport((prev) => ({
            ...prev,
            x: -positionX / scale,
            y: -positionY / scale,
        }))
    }

    useEffect(() => {
        setViewport(prev => ({
            ...prev,
            width: dimensions.width * 2,
            height: dimensions.height * 2,
        }))
        // console.log("dimensions: ", dimensions)
    }, [dimensions])

    const buffer = 100
    const updatedFilteredRooms = useMemo(() => {
        if (!roomsWithStatus.current) return []
    
        return roomsWithStatus.current.filter(
            (room) =>
                room.x >= viewport.x - buffer &&
                room.x <= viewport.x + viewport.width + buffer &&
                room.y >= viewport.y - buffer &&
                room.y <= viewport.y + viewport.height + buffer
        )
    }, [viewport, roomsWithStatus.current])

    useEffect(() => {
        // console.log(updatedFilteredRooms)
        setFilteredRooms(updatedFilteredRooms)
        // console.log(viewport)
    }, [updatedFilteredRooms])

    useEffect(() => {
        if (!containerRef?.current) return
        updateDimensions(containerRef, setDimensions) // Set initial size
        const handleResize = () => updateDimensions(containerRef, setDimensions)
        
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [containerRef.current])

    const handleZoomToLocation = (userLocation, containerRef, viewport, transformRef) => {
        const { x, y, width, height } = userLocation // User's LocuserLocation coordinates
        const zoomScale = 4
        setScale(zoomScale)
        const viewportWidthScale = 
            containerRef.current.clientWidth > 1280 ? 1.55 :
            containerRef.current.clientWidth > 1024 ? 1.5 :
            containerRef.current.clientWidth > 768 ? 1.4 :
            containerRef.current.clientWidth > 640 ? 1.35 :
            containerRef.current.clientWidth > 500 ? 1.3 :
            containerRef.current.clientWidth > 380 ? 1.23 :
            1.2
        // containerRef.current.clientWidth - (containerRef.current.clientWidth - 1.5)
        // console.log("MY VIEWPORT: ", containerRef.current.clientWidth)
        // const viewportHeightScale = viewport.height/2 > 


        // Center the LocuserLocation in the viewport
        // const centerX = ((x + width / 2) * zoomScale) 
        // const centerY = ((y + height / 2) * zoomScale) 
        const centerX = (x + width / 2) * zoomScale - viewport.width * viewportWidthScale
        const centerY = (y + height / 2) * zoomScale - viewport.height / 1.2
        console.log("dimensions: ", dimensions)
        
        // Set transform (negate values because it moves in the opposite direction)
        transformRef.current.setTransform(-centerX, -centerY, zoomScale, 2500, "easeOut")

        console.log("User Location:", userLocation)
        console.log("Viewport:", viewport)
        console.log("Calculated Offsets:", userLocation.x, userLocation.y)
        console.log("Scale:", scale)
    }

    useEffect(() => {
        if (transformRef.current && userLocation && !hasZoomedToUser && containerRef.current) {
            
            handleZoomToLocation(userLocation, containerRef, viewport, transformRef)
            
            setHasZoomedToUser(true)
        }
    }, [userLocation])

    // Land Matters
    const [surroundingCells, setSurroundingCells] = useState([])
    const getSurroundingCells = (clickedCellId, cols = 50, rows = 20) => {
        if (!clickedCellId) return [];
        const surroundingCells = new Set();

        // Get row and column of the clicked cell
        const row = Math.floor((clickedCellId - 1) / cols);
        const col = (clickedCellId - 1) % cols;

        // Loop through a 5x5 square around the clicked cell (distance of 2)
        for (let r = row - 2; r <= row + 2; r++) {
            for (let c = col - 2; c <= col + 2; c++) {
                // Check if it's within grid bounds
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    const cellId = r * cols + c + 1;
                    surroundingCells.add(cellId);
                }
            }
        }

        // surroundingCells.delete(clickedCellId); // Exclude the clicked cell itself
        return Array.from(surroundingCells)
    }

    const handleLandClick = (land, event, transformRef) => {
        if ((!transformRef.current) || (!containerRef.current)) return
        const targetElement = event.currentTarget

        if (selectedLand.id === land.id) {
            userLocation ? null : setScale(1)
            userLocation ? handleZoomToLocation(userLocation, containerRef, {x: 0, y: 0, width: 1600, height: 1200}, transformRef) : transformRef.current.resetTransform(1500, "easeOut")
            setOpenLandDetails(false)
            setSelectedLand({})
            return
        } else {
            setOpenLandDetails(true)
            setSelectedLand(land)
            setScale(3)
            transformRef.current.zoomToElement(targetElement, 3, 1000, "easeOut")
        }
    }

    useEffect(() => {
        if (selectedLand.id) {
            const timeoutId = setTimeout(() => {
                const requiredCells = getSurroundingCells(selectedLand.id)
                setSurroundingCells(requiredCells)
            }, 1500)
            return () => clearTimeout(timeoutId)
        } else {
            setSurroundingCells([])
        }
    }, [selectedLand])
    
    useEffect(() => {
        if(countryId && continentId && cityId) {
            const chosenContinent = continents.filter((continent) => parseInt(continent.id) === parseInt(continentId))[0]
            const chosenCountry = chosenContinent["countries"].filter((country) => parseInt(country.id) === parseInt(countryId))[0]
            const chosenCity = chosenCountry["cities"].filter((city) => parseInt(city.id) === parseInt(cityId))[0]
            console.log(chosenCity)
            console.log(chosenCountry)
            console.log(chosenContinent)
            setMyContinent(chosenContinent)
            setMyCountry(chosenCountry)
            setMyCity(chosenCity)
        }
    }, [countryId, continentId, cityId])
    
    if (!myContinent || !myContinent.path || !myCountry.path || !myCity.path) return (<></>)

    return (
        <div style={{background: myCity.surroundingColor}}
        className='w-[100%] h-[88vh] relative flex justify-center overflow-auto' ref={containerRef}>
            <TransformWrapper ref={transformRef} minScale={1} maxScale={30} initialScale={1} onTransformed={(ref) => handleTransform(ref)}  onPanningStop={(ref) => handlePanningStop(ref)} onZoomStop={(ref) => handleZoomStop(ref)} centerOnInit limitToBounds={false}>
                <TransformComponent wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    // background: 'red'
                    background: `rgba(0, 0, 0, ${timeFilter})`
                }}
                contentStyle={{ width: "100%", height: "100%" }}>
                    {filteredRooms.map((room) => (
                        <div
                        key={room.id}
                        className={`${room.id === selectedLand.id ? 'border border-yellow-300' :  
                        room.id === 1 ? 'border-t-2 border-l-2 border-yellow-900': 
                        room.id === 50 ? 'border-t-2 border-r-2 border-yellow-900' : 
                        room.id === 951 ? 'botder-b-2 border-l-2 border-yellow-900':
                        room.id === 1000 ? 'border-b-2 border-r-2 border-yellow-900':
                        room.id < 50 ? 'border-t-2 border-yellow-900' : room.id%50 === 0 ?  'border-r-2 border-yellow-900' :
                        room.id%50 === 1 ? 'border-l-2 border-yellow-900' : 
                        room.id > 950 ? 'border-b-2 border-yellow-900' : ''
                        }
                        absolute flex items-center justify-center text-white cursor-pointer`}
                        style={{
                            left: `${room.x}px`,
                            top: `${room.y}px`,
                            background: room.id === userLocation?.id ? 'linear-gradient(to bottom, #efd090, #eebd78, #eebe74)':
                            room.waterPatch ? `rgba(33, 148, 183, ${1-timeFilter})`:
                            room.exists ? countryColour2 : countryColour2,
                            width: `${room.width}px`,
                            height: `${room.height}px`,
                            // margin: '50px'
                        }}
                        onMouseEnter={(e) => 
                            (e.currentTarget.style.background = 
                                room.id === userLocation?.id 
                                ? 'linear-gradient(to bottom, #efd090, #eebd78, #eebe74)'
                                : room.waterPatch
                                ? countryColour
                                : room.exists
                                ? countryColour
                                : countryColour
                            )}
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                room.id === userLocation?.id
                                    ? 'linear-gradient(to bottom, #efd090, #eebd78, #eebe74)'
                                    : room.waterPatch
                                    ? `rgba(33, 148, 183, ${1-timeFilter})`
                                    : room.exists
                                    ? countryColour2
                                    : countryColour2)
                        }
                        onClick={(e) => handleLandClick(room, e, transformRef)}
                        onDoubleClick={() => null}
                        >
                        {scale > 1.5 && (selectedLand.id === room.id || surroundingCells?.includes(room.id)) && room.exists && (
                            <div className='h-full w-full flex items-center justify-center relative'>
                                <LandImage src={room.building} />
                                {/* <img src={room.building} className='h-[50%] w-[50%]' loading='lazy'/> */}
                                <div className='absolute z-10 h-full w-full'
                                style={{background: !room.lights ? `rgba(0, 0, 0, ${timeFilter})` : null}}></div>
                            </div>
                        )}
                        {room.exists && (selectedLand.id !== room.id && !surroundingCells?.includes(room.id)) && (
                            <div className='h-full w-full flex items-start justify-end p-2 relative'>
                                <div className='black-opacity h-[30%] w-[50%] flex items-center justify-center'><FaSkullCrossbones className='h-2 w-2' /></div>
                            </div>
                        )}
                        </div>
                    ))}
                </TransformComponent>
            </TransformWrapper>

            {openLandDetails && selectedLand && (
                <div className={`${myContinent?.name === "Eldoria" ? "black-opacity-card" : "white-opacity"} flex flex-col gap-4 room-event-animation w-[200px] lg:min-h-[300px] lg:h-fit lg:w-[300px] absolute
                top-10 right-10 lg:top-10 lg:left-10 rounded-3xl p-5 text-white`}>
                    <div className='text-md lg:text-xl font-normal h-[15%] text-end'>{myCity.name.slice(0, 3)}0{selectedLand.id}</div>
                    <div className='h-85% flex flex-col gap-6'>

                        <div className='flex flex-col gap-3 text-[10px] lg:text-xs items-start'>
                            {selectedLand.exists && (
                                <div className='flex w-full items-center gap-4 justify-between'>
                                    <div>Owner:</div>
                                    <div className=''>{selectedLand.owner}</div>
                                </div>
                            )}
                            {selectedLand.building && (
                                <div className='flex w-full items-center gap-4 justify-between'>
                                    <div>Type:</div>
                                    <div className='capitalize'>{selectedLand.buildingType}</div>
                                </div>
                            )}
                            {selectedLand.waterPatch ? (
                                <div className='flex w-full items-center gap-4 justify-between'>
                                    <div>Sealife:</div>
                                    <div>95</div>
                                </div>
                            ) : (
                                <>
                                    <div className='flex w-full items-center gap-4 justify-between'>
                                        <div>Animals:</div>
                                        <div>95</div>
                                    </div>
                                    <div className='flex w-full items-center gap-4 justify-between'>
                                        <div>Birds:</div>
                                        <div>1120</div>
                                    </div>
                                    <div className='flex w-full items-center gap-4 justify-between'>
                                    <div>Trees:</div>
                                        <div>10000</div>
                                    </div>
                                </>
                            )}
                            
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Resources:</div>
                                <div className='truncate'>Gold, Silver</div>
                            </div>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>People Present:</div>
                                <div>2</div>
                            </div>
                        </div>

                        <div className={`flex w-full items-center ${selectedLand.exists ? 'justify-end' : 'justify-between'} `}>
                            {!selectedLand.exists && (
                                <div onClick={() => null}
                                className='py-3 lg:py-4 border-2 border-white rounded-lg w-[40%] lg:w-[35%] text-center cursor-pointer text-[10px] lg:text-xs font-bold tracking-wide hover:bg-white hover:text-black transition-all ease-out duration-500'>
                                    Claim
                                </div>
                            )}
                            <div onClick={() => navigate(`/room/66fbe68beb3eb71e0c26fb8c`)}
                            className='py-3 lg:py-4 border-2 border-white rounded-lg w-[40%] lg:w-[35%] text-center cursor-pointer text-[10px] lg:text-xs font-bold tracking-wide hover:bg-white hover:text-black transition-all ease-out duration-500'>Explore</div>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default City
