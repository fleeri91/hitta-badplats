'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { EnrichedSite } from '@/types/EnrichedSite'

export function BathingWaterCard({ site }: { site: EnrichedSite }) {
  return (
    <Card className="p-4">
      <div className="font-semibold">{site.name}</div>
      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
        {site.waterType}
        {site.euType && <Badge variant="secondary">EU-bad</Badge>}
      </div>
      <div className="text-xs text-muted-foreground mt-2 flex gap-3">
        <span>{site.weatherNow?.air_temperature ?? '–'}°</span>
        <span>{site.weatherNow?.wind_speed ?? '–'} m/s</span>
        <span>
          {site.weatherNow?.probability_of_precipitation ?? '–'}% regn
        </span>
      </div>
    </Card>
  )
}
