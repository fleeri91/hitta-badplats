'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConditionsScoreGauge } from './conditions-score-gauge'
import type { EnrichedSite } from '@/types/EnrichedSite'

export function BathingWaterCard({ site }: { site: EnrichedSite }) {
  return (
    <Card className="p-4 flex gap-3 items-center">
      <ConditionsScoreGauge score={site.conditionsScore} size={76} />
      <div className="min-w-0 flex-1">
        <div className="font-semibold truncate">{site.name}</div>
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
        {site.hasAdvisory && (
          <div className="mt-2">
            <span className="text-[11.5px] font-bold rounded-[7px] px-2.25 py-0.75 bg-[#fbf1dd] text-[#8a6218] border border-[#efd8a3]">
              ⚠ Avvikelse rapporterad
            </span>
            {site.advisoryText && (
              <div className="text-[11px] text-muted-foreground mt-1">
                {site.advisoryText}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
