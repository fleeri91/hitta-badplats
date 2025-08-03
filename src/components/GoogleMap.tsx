'use client'

import { useEffect, useRef } from 'react'
import { Map, useMap } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

import { useBathingWaters } from '@/lib/queries'
import { MAP_CONFIG } from '@/constants/map-config'
import { useFilteredBathingWaters } from '@/hooks/useFilteredBathingWaters'

const GoogleMap = () => {
  const { data, isLoading } = useBathingWaters()
  const map = useMap() // get current map instance from vis.gl context
  const markersRef = useRef<google.maps.marker[]>([])
  const clustererRef = useRef<MarkerClusterer | null>(null)

  const allWaters = data?.watersAndAdvisories.map((w) => w.bathingWater) || []
  const filteredBathingWaters = useFilteredBathingWaters(allWaters)

  useEffect(() => {
    if (!map || filteredBathingWaters.length === 0) return

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    // Create markers
    const markers = filteredBathingWaters.map((item) => {
      return new google.maps.Marker({
        position: {
          lat: parseFloat(item.samplingPointPosition.latitude),
          lng: parseFloat(item.samplingPointPosition.longitude),
        },
      })
    })

    markersRef.current = markers

    // Create new clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers()
    }

    clustererRef.current = new MarkerClusterer({ markers, map })

    // Cleanup on unmount
    return () => {
      clustererRef.current?.clearMarkers()
    }
  }, [map, filteredBathingWaters])

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
