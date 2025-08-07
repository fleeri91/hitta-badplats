'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Map, useMap } from '@vis.gl/react-google-maps'
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer'

import { useBathingWaters } from '@/lib/queries'
import { MAP_CONFIG } from '@/constants/map-config'
import { useFilteredBathingWaters } from '@/hooks/useFilteredBathingWaters'

const GoogleMap = () => {
  const { data, isLoading } = useBathingWaters()
  const map = useMap()
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const clustererRef = useRef<MarkerClusterer | null>(null)

  const allWaters = data?.watersAndAdvisories.map((w) => w.bathingWater) || []
  const filteredBathingWaters = useFilteredBathingWaters(allWaters)

  const updateMarkersInView = useCallback(() => {
    if (!map || filteredBathingWaters.length === 0) return

    const bounds = map.getBounds()
    if (!bounds) return

    const visibleWaters = filteredBathingWaters.filter((item) => {
      const lat = parseFloat(item.samplingPointPosition.latitude)
      const lng = parseFloat(item.samplingPointPosition.longitude)
      return bounds.contains(new google.maps.LatLng(lat, lng))
    })

    markersRef.current.forEach((marker) => (marker.map = null))
    markersRef.current = []

    const markers = visibleWaters.map((item) => {
      return new google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: parseFloat(item.samplingPointPosition.latitude),
          lng: parseFloat(item.samplingPointPosition.longitude),
        },
        map,
      })
    })

    markersRef.current = markers

    if (clustererRef.current) {
      clustererRef.current.clearMarkers()
    }

    clustererRef.current = new MarkerClusterer({
      map,
      markers,
      algorithm: new SuperClusterAlgorithm({
        maxZoom: 18,
        radius: 200,
      }),
    })
  }, [filteredBathingWaters, map])

  const debouncedUpdateMarkers = useCallback(() => {
    let timeout: NodeJS.Timeout
    return (...args: []) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => updateMarkersInView(...args), 300)
    }
  }, [updateMarkersInView])()

  useEffect(() => {
    if (!map) return

    const listener = map.addListener('idle', debouncedUpdateMarkers)

    updateMarkersInView()

    return () => {
      google.maps.event.removeListener(listener)
    }
  }, [map, debouncedUpdateMarkers, updateMarkersInView])

  if (isLoading) return <>Loading...</>
  if (!data) return <>No data</>

  return (
    <div className="h-screen w-full">
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        defaultZoom={MAP_CONFIG.zoom}
        defaultCenter={{
          lat: MAP_CONFIG.center.lat,
          lng: MAP_CONFIG.center.lng,
        }}
        gestureHandling="cooperative"
        disableDefaultUI={MAP_CONFIG.disableUI}
      />
    </div>
  )
}

export default GoogleMap
