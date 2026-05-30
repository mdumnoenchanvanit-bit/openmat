'use client'
import type { Gym, Review } from '@/types'
import type { User } from '@supabase/supabase-js'
import { gradientFor, scoreDisplay, vibeEmoji, countryFlag, beltCls, qc, qColor } from '@/utils/helpers'

interface Props {
  gym: Gym | null
  reviews: Review[]
  user: User | null
  open: boolean
  onClose: () => void
  onWriteReview: () => void
}

function Stars({ n }: { n: number }) {
  return (
    <div className="rev-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < n ? '#e8193c' : '#333', fontSize: 12 }}>★</span>
      ))}
    </div>
  )
}

function MetricBox({ emoji, label, val, max = 5, neutral = false }: { emoji: string; label: string; val: number | null; max?: number; neutral?: boolean }) {
  if (!val) return null
  const cls = neutral ? 'qn' : qc(val, max)
  const color = neutral ? '#3b82f6' : qColor(cls)
  const display = max === 100 ? `${Math.round(val)}%` : `${val.toFixed(1)}/5`
  return (
    <div className="mm">
      <div className="mm-lbl">{emoji} {label}</div>
      <div className="mm-bar"><div className={`mm-fill ${cls}`} style={{ width: `${(val / max) * 100}%` }} /></div>
      <div className="mm-val" style={{ color }}>{display}</div>
    </div>
  )
}

function avg(reviews: Review[], key: keyof Review) {
  const vals = reviews.map(r => r[key]).filter((v): v is number => typeof v === 'number')
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
}

export default function GymDetailModal({ gym, reviews, user, open, onClose, onWriteReview }: Props) {
  if (!gym) return null

  const grad = gradientFor(gym)
  const score = scoreDisplay(gym)
  const avgHygiene = avg(reviews, 'hygiene')
  const avgLevel = avg(reviews, 'partner_level')
  const avgWomen = avg(reviews, 'women_friendly')
  const avgInstruction = avg(reviews, 'instruction')
  const avgRolling = avg(reviews, 'rolling_pct')

  return (
    <div className={`overlay${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="mphoto" style={{ background: grad }}>
          <div className="mphoto-overlay" />
          <button className="mclose" onClick={onClose}>✕</button>
          <div className="mhead-content">
            {gym.affiliation && <div className="m-affil">{gym.affiliation}</div>}
            <div className="m-name">{gym.name}</div>
            <div className="m-loc">
              {countryFlag(gym.country)} {gym.city}, {gym.country}
              {gym.vibe ? ` · ${vibeEmoji(gym.vibe)} ${gym.vibe}` : ''}
            </div>
          </div>
        </div>

        <div className="mstats">
          <div className="mstat"><div className="mstat-val">{score}</div><div className="mstat-lbl">⭐ Score</div></div>
          <div className="mstat"><div className="mstat-val">{reviews.length}</div><div className="mstat-lbl">💬 Reviews</div></div>
          <div className="mstat">
            <div className="mstat-val">{gym.instructor ? gym.instructor.split(' ').pop() : '—'}</div>
            <div className="mstat-lbl">👤 Instructor</div>
          </div>
          <div className="mstat">
            <div className="mstat-val">{gym.monthly_price ? `$${gym.monthly_price}` : '—'}</div>
            <div className="mstat-lbl">💳 /month</div>
          </div>
        </div>

        <div className="mbody">
          <div className="sec">
            <div className="sec-title">At a glance</div>
            <div className="mbools">
              {[
                { dot: gym.has_gi, label: '🥋 Gi classes' },
                { dot: gym.has_nogi, label: '👊 No-Gi classes' },
                { dot: gym.open_mat, label: '🤝 Open mats' },
                { dot: gym.drop_in, label: '🚪 Drop-in', val: gym.drop_in && gym.drop_in_fee ? `$${gym.drop_in_fee}` : '—' },
                { dot: gym.can_come_late, label: '⏰ Late arrivals OK' },
                { dot: gym.no_contract, label: '📄 No contract' },
                { dot: gym.womens_class, label: '♀️ Women\'s class' },
                { dot: gym.free_trial, label: '🎁 Free trial' },
              ].map(({ dot, label, val }) => (
                <div key={label} className="mbool">
                  <div className={`bdot ${dot ? 'y' : 'n'}`} />
                  <span className="mbool-lbl">{label}</span>
                  {val && <span className="mbool-val">{val}</span>}
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="sec">
              <div className="sec-title">Quality ratings (from {reviews.length} review{reviews.length !== 1 ? 's' : ''})</div>
              <div className="mmetrics">
                <MetricBox emoji="🧹" label="Hygiene" val={avgHygiene} />
                <MetricBox emoji="⚡" label="Partner level" val={avgLevel} />
                <MetricBox emoji="♀️" label="Women-friendly" val={avgWomen} />
                <MetricBox emoji="📚" label="Instruction" val={avgInstruction} />
                <MetricBox emoji="🥋" label="Rolling time" val={avgRolling} max={100} neutral />
              </div>
            </div>
          )}

          <div className="sec">
            <div className="sec-title">
              <span>Reviews ({reviews.length})</span>
              <button className="nbtn primary" style={{ padding: '4px 12px', fontSize: 12 }} onClick={onWriteReview}>
                + Write a review
              </button>
            </div>
            {reviews.length === 0
              ? <div className="no-reviews">No reviews yet — be the first! 🥋</div>
              : (
                <div className="reviews-list">
                  {reviews.map(r => (
                    <div key={r.id} className="rev">
                      <div className="rev-hd">
                        <span className={`belt-tag ${beltCls(r.belt_at_time || 'white')}`}>{r.belt_at_time || 'unknown'}</span>
                        <span className="rev-author">{r.user_id === user?.id ? 'You' : 'Member'}</span>
                        <Stars n={r.overall_rating || 0} />
                        <span className="rev-date">
                          {new Date(r.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {r.review_text && <div className="rev-text">{r.review_text}</div>}
                    </div>
                  ))}
                </div>
              )}
          </div>

          {(gym.website || gym.instagram) && (
            <div className="sec">
              <div className="sec-title">Links</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {gym.website && (
                  <a href={gym.website} target="_blank" rel="noreferrer" className="nbtn" style={{ textDecoration: 'none' }}>
                    🌐 Website
                  </a>
                )}
                {gym.instagram && (
                  <a
                    href={`https://instagram.com/${gym.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="nbtn"
                    style={{ textDecoration: 'none' }}
                  >
                    📸 Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
