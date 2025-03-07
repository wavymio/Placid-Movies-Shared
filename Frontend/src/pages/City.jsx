import React, { useCallback, useEffect, useRef, useState } from 'react'
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
// import house9 from '../assets/house9.avif'
// import house10 from '../assets/house10.avif'
// import house11 from '../assets/house11.avif'
// import house12 from '../assets/house12.avif'
// import house13 from '../assets/house13.avif'
import { debounce } from 'lodash'

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
        { id: 1, owner: "User123", building: house1 },
        { id: 2, owner: "User123", building: house2 },
        { id: 3, owner: "User123", building: house3 },
        { id: 4, owner: "User123", building: house4 },
        { id: 51, owner: "User123", building: house5 },
        { id: 52, owner: "User123", building: house6 },
        { id: 53, owner: "User123", building: house7 },
        { id: 54, owner: "User123", building: house8 },
        { id: 101, owner: "User123", building: house9 },
        // { id: 102, owner: "User123", building: house10 },
        // { id: 103, owner: "User123", building: house11 },
        // { id: 104, owner: "User123", building: house12 },
        // { id: 105, owner: "User123", building: house13 },
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
    // const userLocation = {
    //     exists: false,
    //     height: 60,
    //     id: 1000,
    //     owner: "Isy",
    //     width: 60,
    //     x: 3430,
    //     y: 1330
    // }

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
                waterPatch: !!withWater,
                building: room ? room.building : null
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
        console.log("panned")
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
                        {scale > 1.5 && (
                            <>{room.exists ? (
                                <div className='h-full w-full flex items-center justify-center'>
                                    <img src={room.building} className='h-[50%] w-[50%]' loading='eager'/>
                                </div>
                            ) : (<></>)}
                            </>
                        )}
                        </div>
                    ))}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}

export default City
