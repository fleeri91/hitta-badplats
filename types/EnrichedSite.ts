import { PointForecast } from './SMHI/PointForecast'

export interface EnrichedSite {
  id: string
  name: string
  waterType: string
  euType: boolean
  lat: number
  lon: number
  weatherNow: PointForecast['timeSeries'][number]['data'] | null
}
