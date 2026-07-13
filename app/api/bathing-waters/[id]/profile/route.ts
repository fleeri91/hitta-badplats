import { NextRequest, NextResponse } from 'next/server'
import { getBathingWaterProfile } from '@/lib/api'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getBathingWaterProfile(params.id)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Kunde inte hämta profil:', err)
    return NextResponse.json(
      { error: 'Kunde inte hämta profil' },
      { status: 502 }
    )
  }
}
