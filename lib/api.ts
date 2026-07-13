import { BathingWaterProfile } from '@/types/HAV/BathingWaterProfile'
import { BathingWaterResult } from '@/types/HAV/BathingWaterResult'
import { BathingWaters } from '@/types/HAV/BathingWaters'
import { PointForecast } from '@/types/SMHI/PointForecast'
import { WeatherParameter } from '@/types/SMHI/WeatherParameters'

const SMHI_BASE =
  'https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point'

const HAVVATTEN_BASE =
  'https://gw.havochvatten.se/external-public/bathing-waters/v2'

export const getPointForecast = async (
  lat: number,
  lon: number,
  parameters?: WeatherParameter[],
  timeseries?: number
): Promise<PointForecast> => {
  const queryParams = new URLSearchParams()

  if (timeseries !== undefined) {
    queryParams.append('timeseries', timeseries.toString())
  }

  if (parameters && parameters.length > 0) {
    queryParams.append('parameters', parameters.join(','))
  }

  const queryString = queryParams.toString()
  const url = `${SMHI_BASE}/lon/${lon.toFixed(6)}/lat/${lat.toFixed(6)}/data.json${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`SMHI response was not ok: ${response.statusText}`)
  }

  const data: PointForecast = await response.json()
  return data
}

export const getBathingWaters = async (): Promise<BathingWaters> => {
  const res = await fetch(`${HAVVATTEN_BASE}/bathing-waters`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Kunde inte hämta badplatser (${res.status})`)
  return res.json()
}

export async function getBathingWaterProfile(
  id: string
): Promise<BathingWaterProfile> {
  const res = await fetch(`${HAVVATTEN_BASE}/${id}/profiles`)
  if (!res.ok) throw new Error(`HaV svarade ${res.status} ${res.statusText}`)
  return res.json()
}

export const getResults = async (id: string): Promise<BathingWaterResult> => {
  const response = await fetch(`${HAVVATTEN_BASE}/bathing-waters/${id}/results`)

  if (!response.ok) {
    throw new Error(`HaV response was not ok: ${response.statusText}`)
  }

  const data: BathingWaterResult = await response.json()
  return data
}
