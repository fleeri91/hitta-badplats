'use client'

import { useEffect } from 'react'

import { useMapFilterStore } from '@/stores/useMapFilter'

import GoogleMap from '@/components/GoogleMap'
import MunicipalitySearch from '@/components/MunicipalitySearch'

export default function Home() {
  const { municipality, setMunicipality } = useMapFilterStore()

  useEffect(() => {
    console.log(municipality)
  }, [municipality])

  return (
    <div className="p-4">
      <MunicipalitySearch
        value={municipality}
        onChange={(name) => setMunicipality(name)}
      />
      <GoogleMap />
    </div>
  )
}
