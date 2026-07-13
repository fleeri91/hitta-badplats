'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WatersAndAdvisory } from '@/types/HAV/BathingWaters'

export function BathingWaterCard({ item }: { item: WatersAndAdvisory }) {
  const bw = item.bathingWater
  return (
    <Card className="p-4">
      <div className="font-semibold">{bw.name}</div>
      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
        {bw.waterTypeIdText}
        {bw.euType && <Badge variant="secondary">EU-bad</Badge>}
      </div>
    </Card>
  )
}
