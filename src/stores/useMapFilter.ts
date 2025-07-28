import { create } from 'zustand'

import { MunicipalityName } from '@/constants/municipalities'
import { BathingWater } from '@/types/BathingWaters'

export type MapFilterState = {
  municipality: MunicipalityName | null
  bathingWater: BathingWater | null
}

type MapFilterActions = {
  setMunicipality: (value: MunicipalityName | null) => void
  setBathingWater: (value: BathingWater | null) => void
  reset: () => void
}

type MapFilterStore = MapFilterState & MapFilterActions

const initialState: MapFilterState = {
  municipality: null,
  bathingWater: null,
}

export const useMapFilterStore = create<MapFilterStore>()((set) => ({
  ...initialState,
  setMunicipality: (value) => set({ municipality: value }),
  setBathingWater: (value) => set({ bathingWater: value }),
  reset: () => set(initialState),
}))
