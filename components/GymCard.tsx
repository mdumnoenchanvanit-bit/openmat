'use client'
import type { Gym } from '@/types'
import { gradientFor, scoreDisplay, vibeEmoji, countryFlag } from '@/utils/helpers'

interface Props {
  gym: Gym
  rank: number
  onClick: () => void
}

export default function GymCard({ gym, rank, onClick }: Props) {
  const grad = gradientFor(gym)
  const score = scoreDisplay(gym)

  return (
    <div className="card" onClick={onClick}>
      <div className="card-photo" style={{ background: grad }}>
        <div className="photo-overlay" />
        <div className="card-rank">{rank}</div>
        <div className="card-score">
          <div className="score-n">{score}</div>
          <div className="score-sub">{score === '—' ? 'new' : '/5.0'}</div>
        </div>
        <div className="card-name-block">
          <div className="card-gym-name">{gym.name}</div>
          <div className="card-loc">
            {gym.country ? countryFlag(gym.country) : ''} {gym.city}, {gym.country}
            {gym.affiliation ? ` · ${gym.affiliation}` : ''}
          </div>
        </div>
        {gym.vibe && (
          <div className="card-vibe-tag">{vibeEmoji(gym.vibe)} {gym.vibe}</div>
        )}
      </div>
      <div className="card-body">
        <div className="bools">
          {gym.has_gi && gym.has_nogi
            ? <span className="badge b-info">🥋 Gi + No-Gi</span>
            : gym.has_gi
              ? <span className="badge b-info">🥋 Gi only</span>
              : gym.has_nogi
                ? <span className="badge b-warn">👊 No-Gi only</span>
                : null}
          {gym.open_mat && <span className="badge b-yes">✅ Open mat</span>}
          {gym.drop_in && <span className="badge b-yes">✅ Drop-in{gym.drop_in_fee ? ` $${gym.drop_in_fee}` : ''}</span>}
          {gym.no_contract && <span className="badge b-yes">✅ No contract</span>}
          {gym.womens_class && <span className="badge b-yes">✅ Women&apos;s class</span>}
          {gym.free_trial && <span className="badge b-yes">✅ Free trial</span>}
          {gym.can_come_late && <span className="badge b-yes">✅ Late arrivals</span>}
        </div>
        <div className="card-foot">
          <div>
            {gym.monthly_price
              ? <div className="price-main">${gym.monthly_price}<span style={{ font: '400 11px Inter', color: '#555' }}>/mo</span></div>
              : <div className="price-main"><span style={{ color: '#555', fontSize: 13 }}>Price unknown</span></div>}
            <div className="price-sub">
              {gym.drop_in ? (gym.drop_in_fee ? `Drop-in $${gym.drop_in_fee}` : 'Drop-in available') : 'No drop-in'}
            </div>
          </div>
          <div style={{ font: '600 11px Inter', color: '#555' }}>
            {gym.instructor ? `👤 ${gym.instructor}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
