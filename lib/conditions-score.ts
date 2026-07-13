import type { BathingWaterProfile } from '@/types/HAV/BathingWaterProfile'
import type {
  AbnormalSituation,
  AdviceAgainstBathing,
} from '@/types/HAV/BathingWaters'

type WeatherNow = {
  air_temperature?: number
  wind_speed?: number
  probability_of_precipitation?: number
  thunderstorm_probability?: number
} | null

export interface ConditionsScoreResult {
  score: number
  notes: string[]
  hasAdvisory: boolean
  advisoryText: string | null
}

export function comfortScore(
  temp?: number,
  wind?: number,
  rain?: number,
  thunder?: number
): number {
  let score = 50
  if (temp != null)
    score +=
      temp >= 24 ? 20 : temp >= 20 ? 14 : temp >= 17 ? 6 : temp >= 13 ? -2 : -10
  if (wind != null)
    score += wind <= 3 ? 6 : wind <= 6 ? 2 : wind <= 10 ? -4 : -10
  if (rain != null)
    score += rain <= 10 ? 4 : rain <= 30 ? 0 : rain <= 60 ? -6 : -12
  if (thunder != null && thunder >= 40) score -= 15
  return Math.max(0, Math.min(100, Math.round(score)))
}

const ANNUAL_POINTS: Record<string, number> = {
  Utmärkt: 22,
  Bra: 14,
  Tjänligt: 8,
  'Tjänligt med anmärkning': -4,
  Otjänligt: -30,
  'Ej klassificerad': 4,
}

export function computeConditionsScore(params: {
  profile?: BathingWaterProfile | null
  weatherNow?: WeatherNow
  abnormalSituations?: AbnormalSituation[]
  adviceAgainstBathing?: AdviceAgainstBathing[]
}): ConditionsScoreResult {
  const {
    profile,
    weatherNow,
    abnormalSituations = [],
    adviceAgainstBathing = [],
  } = params
  const notes: string[] = []

  let score = weatherNow
    ? comfortScore(
        weatherNow.air_temperature,
        weatherNow.wind_speed,
        weatherNow.probability_of_precipitation,
        weatherNow.thunderstorm_probability
      )
    : 50

  if ((weatherNow?.thunderstorm_probability ?? 0) >= 40)
    notes.push('Risk för åska enligt SMHI')

  const qClass = profile?.lastFourClassifications?.[0]?.qualityClassIdText
  if (qClass) score += ANNUAL_POINTS[qClass] ?? 4

  if (profile?.algae || profile?.cyano) {
    score -= 12
    notes.push('Känd risk för algblomning')
  }

  let advisoryText: string | null = null
  const hasAdvisory =
    abnormalSituations.length > 0 || adviceAgainstBathing.length > 0
  if (hasAdvisory) {
    score = Math.min(score, 18)
    advisoryText =
      abnormalSituations[0]?.description ??
      adviceAgainstBathing[0]?.description ??
      'Kommunen har rapporterat en avvikelse'
    notes.push(advisoryText)
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    notes,
    hasAdvisory,
    advisoryText,
  }
}

export type Band = 'excellent' | 'good' | 'okay' | 'wait'

export function conditionsScoreLabel(score: number): {
  text: string
  band: Band
} {
  if (score >= 80) return { text: 'Utmärkt', band: 'excellent' }
  if (score >= 60) return { text: 'Bra', band: 'good' }
  if (score >= 40) return { text: 'Okej', band: 'okay' }
  return { text: 'Avvakta', band: 'wait' }
}
