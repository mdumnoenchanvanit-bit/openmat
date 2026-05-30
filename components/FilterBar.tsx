'use client'
import type { FilterState } from '@/types'

interface Props {
  filters: FilterState
  onChange: (update: Partial<FilterState>) => void
}

const COUNTRIES = [
  { key: 'all', label: '🌍 All' },
  { key: 'USA', label: '🇺🇸 USA' },
  { key: 'UK', label: '🇬🇧 UK' },
  { key: 'Brazil', label: '🇧🇷 Brazil' },
  { key: 'Spain', label: '🇪🇸 Spain' },
  { key: 'Ireland', label: '🇮🇪 Ireland' },
]
const STYLES = [
  { key: 'all', label: 'All styles' },
  { key: 'gi', label: '🥋 Gi' },
  { key: 'nogi', label: '👊 No-Gi' },
  { key: 'both', label: 'Both' },
]
const VIBES = [
  { key: 'all', label: 'All vibes' },
  { key: 'competition', label: '🏆 Competition' },
  { key: 'casual', label: '😎 Casual' },
  { key: 'traditional', label: '🎌 Traditional' },
  { key: 'mixed', label: '⚖️ Mixed' },
]

export default function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="fbar">
      {COUNTRIES.map(c => (
        <button
          key={c.key}
          className={`fpill${filters.country === c.key ? ' on' : ''}`}
          onClick={() => onChange({ country: c.key })}
        >{c.label}</button>
      ))}
      <div className="fbar-sep" />
      {STYLES.map(s => (
        <button
          key={s.key}
          className={`fpill${filters.style === s.key ? ' on' : ''}`}
          onClick={() => onChange({ style: s.key })}
        >{s.label}</button>
      ))}
      <div className="fbar-sep" />
      {VIBES.map(v => (
        <button
          key={v.key}
          className={`fpill${filters.vibe === v.key ? ' on' : ''}`}
          onClick={() => onChange({ vibe: v.key })}
        >{v.label}</button>
      ))}
      <div className="fbar-sep" />
      <button className={`fpill${filters.openMat ? ' on' : ''}`} onClick={() => onChange({ openMat: !filters.openMat })}>Open mats</button>
      <button className={`fpill${filters.dropIn ? ' on' : ''}`} onClick={() => onChange({ dropIn: !filters.dropIn })}>Drop-in OK</button>
      <button className={`fpill${filters.late ? ' on' : ''}`} onClick={() => onChange({ late: !filters.late })}>Late arrivals OK</button>
      <button className={`fpill${filters.noContract ? ' on' : ''}`} onClick={() => onChange({ noContract: !filters.noContract })}>No contract</button>
      <button className={`fpill${filters.women ? ' on' : ''}`} onClick={() => onChange({ women: !filters.women })}>Women&apos;s class</button>
      <button className={`fpill${filters.trial ? ' on' : ''}`} onClick={() => onChange({ trial: !filters.trial })}>Free trial</button>
    </div>
  )
}
