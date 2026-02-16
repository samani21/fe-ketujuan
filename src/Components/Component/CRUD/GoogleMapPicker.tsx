'use client'

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
    data: any
    onChange?: (lat: number, lng: number) => void
}

const containerStyle = {
    width: '100%',
    height: '400px',
}

export default function GoogleMapPicker({ onChange, data }: Props) {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    })

    // Default center Banjarmasin
    const defaultCenter = {
        lat: -3.3186,
        lng: 114.5944,
    }

    const [position, setPosition] = useState<{
        lat: number
        lng: number
    } | null>(null)

    // 🔥 Kalau ada data → set pin otomatis
    useEffect(() => {
        if (data?.latitude && data?.longitude) {
            setPosition({
                lat: Number(data.latitude),
                lng: Number(data.longitude),
            })
        }
    }, [data])

    const handleClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return

        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        const newPosition = { lat, lng }

        setPosition(newPosition)

        if (onChange) {
            onChange(lat, lng)
        }
    }, [onChange])

    // 🔥 Center ikut pindah kalau ada position
    const center = useMemo(() => {
        return position ?? defaultCenter
    }, [position])

    if (!isLoaded) return <p>Loading Map...</p>

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={position ? 15 : 13}
            onClick={handleClick}
        >
            {position && <Marker position={position} />}
        </GoogleMap>
    )
}
