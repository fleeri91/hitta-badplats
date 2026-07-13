export type ConfidenceLevel = 'hög' | 'medel' | 'låg'

export function confidenceLevel(
  sampleAgeDays: number | null,
  rainRisk: boolean
): ConfidenceLevel {
  if (sampleAgeDays == null) return 'låg'
  if (sampleAgeDays <= 5 && !rainRisk) return 'hög'
  if (sampleAgeDays <= 14) return 'medel'
  return 'låg'
}
