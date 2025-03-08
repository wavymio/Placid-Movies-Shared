import { DateTime } from "luxon"
import { useState, useEffect } from "react"

const getTimeOpacity = (utcOffset = 0) => {
    const now = DateTime.utc().plus({ hours: utcOffset })
    const hour = now.hour

    if (hour >= 5 && hour < 6) return 0.7  // Early Dawn (Thicker)
    if (hour >= 6 && hour < 7) return 0.6  // Sunrise
    if (hour >= 7 && hour < 9) return 0.5  // Morning
    if (hour >= 9 && hour < 12) return 0.4  // Late Morning
    if (hour >= 12 && hour < 15) return 0.2  // Noon (Thinnest)
    if (hour >= 15 && hour < 17) return 0.3  // Afternoon
    if (hour >= 17 && hour < 18) return 0.5  // Early Evening
    if (hour >= 18 && hour < 19) return 0.6  // Sunset
    if (hour >= 19 && hour < 20) return 0.7  // Dusk
    if (hour >= 20 && hour < 22) return 0.8  // Night Begins
    if (hour >= 22 || hour < 3) return 0.9   // Late Night (Thickest)
    if (hour >= 3 && hour < 5) return 0.85   // Deepest Night

    return 0.2 // Default fallback (Thinner)
}

export const useTimeFilter = (utcOffset = 0) => {
    if (utcOffset === undefined || utcOffset === null) return 0.3 // Ensure hook always returns something

    const [timeFilter, setTimeFilter] = useState(() => getTimeOpacity(utcOffset || 0))

    useEffect(() => {
        if (utcOffset === undefined || utcOffset === null) return

        setTimeFilter(getTimeOpacity(utcOffset || 0))
        const interval = setInterval(() => {
            setTimeFilter(getTimeOpacity(utcOffset || 0))
            console.log("setting...")
        }, 60000) // Updates every 1 minute

        return () => clearInterval(interval)
    }, [utcOffset])

    return timeFilter
}
