'use client'

import { useState } from 'react'
import { useBathingWaters } from '@/lib/queries'
import { BathingWaterCard } from '@/components/bathing-water-card'
import { MunicipalityPicker } from '@/components/municipality-picker'
import {
  DEFAULT_MUNICIPALITY,
  type MunicipalityName,
} from '@/constants/municipalities'

export default function Home() {
  const [municipality, setMunicipality] =
    useState<MunicipalityName>(DEFAULT_MUNICIPALITY)
  const { data, isLoading } = useBathingWaters(municipality)

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Badbart</h1>
        <MunicipalityPicker value={municipality} onChange={setMunicipality} />
      </div>
      {isLoading ? (
        <p>Laddar…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.watersAndAdvisories.map((item) => (
            <BathingWaterCard key={item.bathingWater.id} item={item} />
          ))}
        </div>
      )}
    </main>
  )
}
