// src/app/api/hav/bathing-waters/route.ts
import { getBathingWaters } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'
import {
  DEFAULT_MUNICIPALITY,
  isMunicipalityName,
} from '@/constants/municipalities'

export async function GET(req: NextRequest) {
  const municipalityParam =
    req.nextUrl.searchParams.get('municipality') ?? DEFAULT_MUNICIPALITY
  const limit = Number(req.nextUrl.searchParams.get('limit') ?? '12')

  if (!isMunicipalityName(municipalityParam)) {
    return NextResponse.json(
      { error: `Okänd kommun: ${municipalityParam}` },
      { status: 400 }
    )
  }

  try {
    const data = await getBathingWaters()
    const filtered = data.watersAndAdvisories
      .filter(
        (item) => item.bathingWater.municipality.name === municipalityParam
      )
      .slice(0, limit)
    return NextResponse.json(filtered)
  } catch {
    return NextResponse.json(
      { error: 'Kunde inte hämta badplatser' },
      { status: 502 }
    )
  }
}
