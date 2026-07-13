import type { BathingWaterProfile } from './HAV/BathingWaterProfile'
import type { PointForecast } from './SMHI/PointForecast'

export interface EnrichedSite {
  id: string
  name: string
  waterType: string
  euType: boolean
  lat: number
  lon: number
  weatherNow: PointForecast['timeSeries'][number]['data'] | null
  profile: BathingWaterProfile | null
  conditionsScore: number
  notes: string[]
  hasAdvisory: boolean
}
