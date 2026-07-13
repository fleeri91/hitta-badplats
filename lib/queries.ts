import type { BathingWaters } from '@/types/HAV/BathingWaters'
import {
  DEFAULT_MUNICIPALITY,
  type MunicipalityName,
} from '@/constants/municipalities'
import { useQuery } from '@tanstack/react-query'

export const queryKeys = {
  bathingWaters: (municipality: MunicipalityName) =>
    ['bathingWaters', municipality] as const,
}

export const useBathingWaters = (
  municipality: MunicipalityName = DEFAULT_MUNICIPALITY
) => {
  return useQuery({
    queryKey: queryKeys.bathingWaters(municipality),
    queryFn: async () => {
      const res = await fetch(
        `/api/bathing-waters?municipality=${encodeURIComponent(municipality)}`
      )
      if (!res.ok) throw new Error('Failed to fetch bathing waters')
      return res.json() as Promise<BathingWaters>
    },
    staleTime: 1000 * 60 * 60 * 24,
  })
}
