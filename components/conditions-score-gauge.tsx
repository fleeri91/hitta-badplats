'use client'

import { conditionsScoreLabel, type Band } from '@/lib/conditions-score'
import type { CSSProperties } from 'react'

export type ConfidenceLevel = 'fresh' | 'stale' | 'estimate'

const BAND_STYLES: Record<
  Band,
  { c: string; d: string; t: string; dark: boolean }
> = {
  excellent: { c: '#12897a', d: '#0c6c60', t: '#d3ede9', dark: true },
  good: { c: '#2a86c9', d: '#1f6aa6', t: '#d6e9f7', dark: true },
  okay: { c: '#e0a12e', d: '#c4861a', t: '#faedcf', dark: false },
  wait: { c: '#d9634a', d: '#bd4a33', t: '#f7ddd6', dark: true },
}

export function ConditionsScoreGauge({
  score,
  size = 140,
  confidence = 'fresh',
}: {
  score: number
  size?: number
  confidence?: ConfidenceLevel
}) {
  const { text: label, band } = conditionsScoreLabel(score)
  const b = BAND_STYLES[band]
  const fill = Math.max(6, Math.min(97, score))
  const waveH = Math.max(6, size * 0.11)
  const showLabel = size >= 120
  const ringGap = Math.max(3, size * 0.045)
  const badgeSize = Math.max(18, size * 0.2)

  const wave = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='12' viewBox='0 0 44 12'><path d='M0 7 Q11 0 22 7 T44 7 V12 H0 Z' fill='${b.c}'/></svg>`
  )

  let ringStyle: CSSProperties = { display: 'none' }
  let prefix = ''
  let showBadge = false

  if (confidence === 'stale') {
    ringStyle = {
      position: 'absolute',
      inset: -ringGap,
      borderRadius: '50%',
      border: `2px dashed ${b.c}`,
      opacity: 0.55,
      pointerEvents: 'none',
    }
  } else if (confidence === 'estimate') {
    prefix = '~'
    ringStyle = {
      position: 'absolute',
      inset: -ringGap,
      borderRadius: '50%',
      border: '2px dotted #8a6a45',
      opacity: 0.7,
      pointerEvents: 'none',
    }
    showBadge = size >= 88
  }

  return (
    <div
      style={{ position: 'relative', width: size, height: size, flex: 'none' }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          background: b.t,
          boxShadow:
            'inset 0 0 0 2px rgba(20,40,60,0.06), 0 6px 16px -8px rgba(20,60,90,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: `${fill}%`,
            background: `linear-gradient(180deg, ${b.c}, ${b.d})`,
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 2,
            opacity: 0.95,
            bottom: `calc(${fill}% - ${waveH * 0.55}px)`,
            height: waveH,
            backgroundImage: `url("data:image/svg+xml,${wave}")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: `${waveH * 3.6}px ${waveH}px`,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            lineHeight: 0.9,
            color: b.dark ? '#fff' : '#3a2b06',
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: size * 0.36,
              letterSpacing: '-0.02em',
            }}
          >
            {prefix}
            {score}
          </div>
          {showLabel && (
            <div
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: size * 0.1,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: size * 0.04,
                opacity: 0.92,
              }}
            >
              {label}
            </div>
          )}
        </div>
      </div>
      <div style={ringStyle} />
      {showBadge && (
        <div
          style={{
            position: 'absolute',
            bottom: -badgeSize * 0.15,
            right: -badgeSize * 0.15,
            width: badgeSize,
            height: badgeSize,
            borderRadius: '50%',
            background: '#8a6a45',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: badgeSize * 0.62,
            boxShadow: '0 2px 6px -2px rgba(0,0,0,0.35)',
            zIndex: 4,
          }}
        >
          ~
        </div>
      )}
    </div>
  )
}
