// src/app/api/smhi/forecast/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPointForecast } from '@/lib/api'
import { WeatherParameter } from '@/types/SMHI/WeatherParameters'

const FORECAST_PARAMETERS: WeatherParameter[] = [
  WeatherParameter.AirTemperature,
  WeatherParameter.WindSpeed,
  WeatherParameter.ThunderstormProbability,
  WeatherParameter.ProbabilityOfPrecipitation,
]

export async function GET(req: NextRequest) {
  const latParam = req.nextUrl.searchParams.get('lat')
  const lonParam = req.nextUrl.searchParams.get('lon')
  const timeseriesParam = req.nextUrl.searchParams.get('timeseries')

  const lat = latParam ? Number(latParam) : NaN
  const lon = lonParam ? Number(lonParam) : NaN

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json(
      { error: 'lat och lon krävs och måste vara tal' },
      { status: 400 }
    )
  }

  const timeseries = timeseriesParam ? Number(timeseriesParam) : undefined

  try {
    const data = await getPointForecast(
      lat,
      lon,
      FORECAST_PARAMETERS,
      timeseries
    )
    return NextResponse.json(data)
  } catch (err) {
    console.error('Kunde inte hämta prognos från SMHI:', err)
    return NextResponse.json(
      { error: 'Kunde inte hämta prognos' },
      { status: 502 }
    )
  }
}
