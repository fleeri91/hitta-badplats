import type {
  BathingWaters,
  WatersAndAdvisory,
} from '@/types/HAV/BathingWaters'
import {
  DEFAULT_MUNICIPALITY,
  type MunicipalityName,
} from '@/constants/municipalities'
import { useQueries, useQuery } from '@tanstack/react-query'
import { EnrichedSite } from '@/types/EnrichedSite'
import { PointForecast } from '@/types/SMHI/PointForecast'
import { BathingWaterProfile } from '@/types/HAV/BathingWaterProfile'
import { computeConditionsScore } from '@/lib/conditions-score'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fel vid hämtning: ${url}`)
  return res.json()
}

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

export function useEnrichedSites(list: WatersAndAdvisory[] | undefined) {
  const results = useQueries({
    queries: (list ?? []).map((item) => ({
      queryKey: ['bathing-water', 'enriched', item.bathingWater.id],
      queryFn: async (): Promise<EnrichedSite> => {
        const { id, name, waterTypeIdText, euType, samplingPointPosition } =
          item.bathingWater
        const lat = parseFloat(samplingPointPosition.latitude)
        const lon = parseFloat(samplingPointPosition.longitude)

        const [forecast, profile] = await Promise.all([
          fetchJson<PointForecast>(
            `/api/smhi/forecast?lat=${lat}&lon=${lon}&timeseries=1`
          ).catch(() => null),
          fetchJson<BathingWaterProfile>(
            `/api/bathing-waters/${id}/profile`
          ).catch(() => null),
        ])

        const weatherNow = forecast?.timeSeries?.[0]?.data ?? null
        const { score, notes, hasAdvisory } = computeConditionsScore({
          profile,
          weatherNow,
          abnormalSituations: item.abnormalSituations,
          adviceAgainstBathing: item.adviceAgainstBathing,
        })

        return {
          id,
          name,
          waterType: waterTypeIdText,
          euType,
          lat,
          lon,
          weatherNow,
          profile,
          conditionsScore: score,
          notes,
          hasAdvisory,
        }
      },
      enabled: !!list,
      staleTime: 10 * 60 * 1000,
    })),
  })
  return {
    sites: results.map((r) => r.data).filter((s): s is EnrichedSite => !!s),
    isLoading: results.some((r) => r.isLoading),
  }
}
