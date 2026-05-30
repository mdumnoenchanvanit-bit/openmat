import type { Gym } from '@/types'

export function qc(val: number, max = 5) {
  const r = val / max
  if (r <= 0.2) return 'q1'
  if (r <= 0.4) return 'q2'
  if (r <= 0.6) return 'q3'
  if (r <= 0.8) return 'q4'
  return 'q5'
}

export function qColor(c: string) {
  const map: Record<string, string> = { q1: '#e8193c', q2: '#f97316', q3: '#eab308', q4: '#84cc16', q5: '#22c55e' }
  return map[c] || '#3b82f6'
}

export function vibeEmoji(v: string) {
  const map: Record<string, string> = { competition: '🏆', casual: '😎', traditional: '🎌', mixed: '⚖️' }
  return map[v] || '🥋'
}

export function beltCls(b: string) {
  const map: Record<string, string> = { white: 'bw', blue: 'bb', purple: 'bp', brown: 'br2', black: 'bk' }
  return map[b] || 'bw'
}

export function countryFlag(country: string) {
  const flags: Record<string, string> = {
    USA: '🇺🇸', UK: '🇬🇧', Brazil: '🇧🇷', Spain: '🇪🇸', Ireland: '🇮🇪',
    France: '🇫🇷', Japan: '🇯🇵', Australia: '🇦🇺', Canada: '🇨🇦',
    Germany: '🇩🇪', Netherlands: '🇳🇱', Portugal: '🇵🇹',
  }
  return flags[country] || '🌍'
}

export function gradientFor(gym: Gym) {
  const h = gym.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const hues = [0, 200, 140, 280, 30, 180, 320, 60]
  const hue = hues[h % hues.length]
  return `linear-gradient(135deg, hsl(${hue},60%,6%) 0%, hsl(${hue},50%,12%) 50%, hsl(${hue},60%,6%) 100%)`
}

export function scoreDisplay(gym: Gym) {
  return gym._avg_rating ? gym._avg_rating.toFixed(1) : '—'
}

export function starsHtml(n: number) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < n ? '#e8193c' : '#333'};font-size:12px">★</span>`
  ).join('')
}
