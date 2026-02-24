'use client'

import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete
} from '@react-google-maps/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
    libraries: ['places'],
  })

  const defaultCenter = {
    lat: -3.3186,
    lng: 114.5944,
  }

  const [position, setPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (data?.latitude && data?.longitude) {
      setPosition({
        lat: Number(data.latitude),
        lng: Number(data.longitude),
      })
    }
  }, [data])

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map
  }

  const handleClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return

    const lat = e.latLng.lat()
    const lng = e.latLng.lng()

    const newPosition = { lat, lng }

    setPosition(newPosition)

    onChange?.(lat, lng)

  }, [onChange])

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return

    const lat = e.latLng.lat()
    const lng = e.latLng.lng()

    setPosition({ lat, lng })
    onChange?.(lat, lng)
  }

  const onPlaceChanged = () => {
    const place = autoCompleteRef.current?.getPlace()

    if (!place?.geometry?.location) return

    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()

    const newPosition = { lat, lng }

    setPosition(newPosition)

    mapRef.current?.panTo(newPosition)

    onChange?.(lat, lng)
  }

  const center = useMemo(() => {
    return position ?? defaultCenter
  }, [position])

  if (!isLoaded) return <p>Loading Map...</p>

  return (
    <div className="space-y-3">

      <Autocomplete
        onLoad={(ref) => (autoCompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Cari lokasi..."
          className="w-full border p-2 rounded"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={position ? 15 : 13}
        onClick={handleClick}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {position && (
          <Marker
            position={position}
            draggable
            onDragEnd={handleDragEnd}
          />
        )}
      </GoogleMap>

    </div>
  )
}