import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { continents, updateDimensions } from './SocietyMap'
import { countryColour, countryColour2, handleZoomStop } from './Continent'

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
    const [timeFilter, setTimeFilter] = useState(0.5)

    // Land/Room Rendering 
    const totalRooms = 1000
    const gridWidth = 50 // Number of columns
    const gridHeight = Math.ceil(totalRooms / gridWidth)
    const centerX = Math.floor(gridWidth / 2);
    const centerY = Math.floor(gridHeight / 2);

    const existingRooms = [
        { id: 1, owner: "User123" },
        { id: 2, owner: "User123" },
        { id: 3, owner: "User123" },
        { id: 45, owner: "User123" },
    ]

    const [viewport, setViewport] = useState({
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height,
    })

    const [filteredRooms, setFilteredRooms] = useState([])

    const roomSlots = useRef(
        Array.from({ length: totalRooms }, (_, index) => ({
            id: index + 1,
            x: (index % gridWidth) * 61, // Increased from 60 to 70
            y: Math.floor(index / gridWidth) * 61, // Increased from 60 to 70
        }))
    )

    const userLocation = {
        exists: false,
        height: 60,
        id: 1000,
        owner: "Isy",
        width: 60,
        x: 3430,
        y: 1330
    }

    const waterPatchClusters = [
        // { startX: 5, startY: 5, size: 4 },  // Cluster at (5,5) covering 4x4 rooms
        // { startX: 20, startY: 10, size: 6 }, // Cluster at (20,10) covering 3x3 rooms
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
                waterPatch: !!withWater
            }
        })
    )


    const handlePanningStop = (ref) => {
        const { positionX, positionY, scale } = ref.state
        setScale(scale)

        setViewport((prev) => ({
            ...prev,
            x: -positionX / scale,
            y: -positionY / scale,
        }))
        console.log("panned")
    }
    
    const handleZoomStop = (transformRef) => {
        const {state: transformState} = transformRef
        const { scale: currentScale, positionX, positionY} = transformState
        setScale(currentScale)

        setViewport((prev) => ({
            ...prev,
            x: -positionX / currentScale,
            y: -positionY / currentScale,
        }))
        // console.log("Zoom detected, scale:", currentScale)
    }

    const handleTransform = (transformRef) => {
        // console.log("transforming")
        const {state: transformState} = transformRef
        const { scale: currentScale, positionX, positionY} = transformState
        setViewport((prev) => ({
            ...prev,
            x: -positionX / currentScale,
            y: -positionY / currentScale,
        }))
    }

    useEffect(() => {
        setViewport(prev => ({
            ...prev,
            width: dimensions.width * 2,
            height: dimensions.height * 2,
        }))
    }, [dimensions])

    useEffect(() => {
        if (!roomsWithStatus.current) return

        const buffer = 100 // Add buffer area
        const updatedFilteredRooms = roomsWithStatus.current.filter(
            (room) =>
                room.x >= viewport.x - buffer &&
                room.x <= viewport.x + viewport.width + buffer &&
                room.y >= viewport.y - buffer &&
                room.y <= viewport.y + viewport.height + buffer
        )
        // console.log(updatedFilteredRooms)
        setFilteredRooms(updatedFilteredRooms)
        // console.log(viewport)
    }, [viewport])

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
        const viewportWidthScale = 
            containerRef.current.clientWidth > 1280 ? 1.55 :
            containerRef.current.clientWidth > 1024 ? 1.5 :
            containerRef.current.clientWidth > 768 ? 1.4 :
            containerRef.current.clientWidth > 640 ? 1.35 :
            containerRef.current.clientWidth > 500 ? 1.3 :
            containerRef.current.clientWidth > 380 ? 1.23 :
            1.2
        // containerRef.current.clientWidth - (containerRef.current.clientWidth - 1.5)
        console.log("MY VIEWPORT: ", containerRef.current.clientWidth)
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
    const handleLandClick = (land, event, transformRef) => {
        if ((!transformRef.current) || (!containerRef.current)) return
        const targetElement = event.currentTarget

        if (selectedLand.id === land.id) {
            userLocation ? handleZoomToLocation(userLocation, containerRef, {x: 0, y: 0, width: 1600, height: 1200}, transformRef) : transformRef.current.resetTransform(1500, "easeOut")
            setOpenLandDetails(false)
            setSelectedLand({})
            return
        } else {
            setOpenLandDetails(true)
            setSelectedLand(land)
            transformRef.current.zoomToElement(targetElement, 3, 1000, "easeOut")
        }
    }
    
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
            <TransformWrapper ref={transformRef} minScale={0.7} maxScale={30} initialScale={1} onTransformed={(ref) => handleTransform(ref)}  onPanningStop={(ref) => handlePanningStop(ref)} onZoomStop={(ref) => handleZoomStop(ref)} centerOnInit limitToBounds={false}>
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
                        className={`${room.id === selectedLand.id ? 'border border-yellow-300' : null} absolute flex items-center justify-center text-white cursor-pointer`}
                        style={{
                            left: `${room.x}px`,
                            top: `${room.y}px`,
                            background: room.id === userLocation.id ? 'linear-gradient(to bottom, #efd090, #eebd78, #eebe74)':
                            room.waterPatch ? `rgba(33, 148, 183, ${1-timeFilter})`:
                            room.exists ? countryColour : countryColour2,
                            width: `${room.width}px`,
                            height: `${room.height}px`,
                            // margin: '50px'
                        }}
                        onMouseEnter={(e) => 
                            (e.currentTarget.style.background = 
                                room.id === userLocation.id 
                                ? 'linear-gradient(to bottom, #efd090, #eebd78, #eebe74)'
                                : room.waterPatch
                                ? countryColour
                                : room.exists
                                ? countryColour
                                : countryColour
                            )}
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                room.id === userLocation.id
                                    ? 'linear-gradient(to bottom, #efd090, #eebd78, #eebe74)'
                                    : room.waterPatch
                                    ? `rgba(33, 148, 183, ${1-timeFilter})`
                                    : room.exists
                                    ? countryColour
                                    : countryColour2)
                        }
                        onClick={(e) => handleLandClick(room, e, transformRef)}
                        onDoubleClick={() => null}
                        >
                        {room.exists ? "🏠" : ""}
                        </div>
                    ))}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}

export default City
