'use client'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface Props {
  open: boolean
  gymId: string | null
  gymName: string
  user: User | null
  onClose: () => void
  onSuccess: (gymId: string) => void
}

export default function ReviewModal({ open, gymId, gymName, user, onClose, onSuccess }: Props) {
  const [belt, setBelt] = useState('white')
  const [overall, setOverall] = useState(0)
  const [hoverStar, setHoverStar] = useState(0)
  const [hygiene, setHygiene] = useState(3)
  const [level, setLevel] = useState(3)
  const [women, setWomen] = useState(3)
  const [instruction, setInstruction] = useState(3)
  const [rolling, setRolling] = useState(40)
  const [bbs, setBbs] = useState('')
  const [classSize, setClassSize] = useState('')
  const [womenPct, setWomenPct] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const sb = createClient()

  async function submit() {
    setError('')
    if (!overall) { setError('Please give an overall star rating.'); return }
    if (!text.trim()) { setError('Please write a short review.'); return }
    if (!user || !gymId) return
    setLoading(true)
    const { error: err } = await sb.from('reviews').insert([{
      gym_id: gymId,
      user_id: user.id,
      belt_at_time: belt,
      overall_rating: overall,
      hygiene,
      partner_level: level,
      women_friendly: women,
      instruction,
      rolling_pct: rolling,
      black_belts_on_mat: parseInt(bbs) || null,
      avg_class_size: parseInt(classSize) || null,
      women_pct: parseInt(womenPct) || null,
      review_text: text.trim(),
    }])
    setLoading(false)
    if (err) {
      setError(err.code === '23505' ? "You've already reviewed this gym." : err.message)
      return
    }
    setSuccess(true)
    setTimeout(() => { setSuccess(false); onClose(); onSuccess(gymId) }, 1500)
  }

  if (!open) return null

  return (
    <div className={`overlay${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="form-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <div className="form-title">Write a review</div>
            <div className="form-sub">{gymName || 'Share your experience'}</div>
          </div>
          <button className="mclose" style={{ position: 'static' }} onClick={onClose}>✕</button>
        </div>

        <div className="form-grid">
          <div className="form-sec-title">Your belt when you trained here</div>
          <div className="form-field full">
            <select value={belt} onChange={e => setBelt(e.target.value)}>
              <option value="white">⬜ White belt</option>
              <option value="blue">🔵 Blue belt</option>
              <option value="purple">🟣 Purple belt</option>
              <option value="brown">🟤 Brown belt</option>
              <option value="black">⬛ Black belt</option>
            </select>
          </div>

          <div className="form-sec-title">Overall rating</div>
          <div className="form-field full">
            <label>Overall</label>
            <div className="star-rating">
              {Array.from({ length: 5 }, (_, i) => i + 1).map(n => (
                <span
                  key={n}
                  className={n <= (hoverStar || overall) ? 'on' : ''}
                  onClick={() => setOverall(n)}
                  onMouseEnter={() => setHoverStar(n)}
                  onMouseLeave={() => setHoverStar(0)}
                >★</span>
              ))}
            </div>
          </div>

          <div className="form-sec-title">Rate the specifics (1–5)</div>
          {[
            { label: '🧹 Hygiene', val: hygiene, set: setHygiene, min: 1, max: 5, step: 1 },
            { label: '⚡ Partner level', val: level, set: setLevel, min: 1, max: 5, step: 1 },
            { label: '♀️ Women-friendly', val: women, set: setWomen, min: 1, max: 5, step: 1 },
            { label: '📚 Instruction quality', val: instruction, set: setInstruction, min: 1, max: 5, step: 1 },
          ].map(({ label, val, set: setter, min, max, step }) => (
            <div className="form-field full" key={label}>
              <label>{label}</label>
              <div className="slider-wrap">
                <input type="range" min={min} max={max} step={step} value={val} onChange={e => setter(Number(e.target.value))} />
                <span className="slider-val">{val}</span>
              </div>
            </div>
          ))}
          <div className="form-field full">
            <label>🥋 % of class time rolling</label>
            <div className="slider-wrap">
              <input type="range" min={0} max={100} step={5} value={rolling} onChange={e => setRolling(Number(e.target.value))} />
              <span className="slider-val">{rolling}%</span>
            </div>
          </div>

          <div className="form-sec-title">What you observed</div>
          <div className="form-field"><label>Black belts on mat</label><input type="number" placeholder="e.g. 3" min="0" value={bbs} onChange={e => setBbs(e.target.value)} /></div>
          <div className="form-field"><label>Avg class size</label><input type="number" placeholder="e.g. 20" min="0" value={classSize} onChange={e => setClassSize(e.target.value)} /></div>
          <div className="form-field full"><label>% women members (estimate)</label><input type="number" placeholder="e.g. 20" min="0" max="100" value={womenPct} onChange={e => setWomenPct(e.target.value)} /></div>

          <div className="form-sec-title">Your review</div>
          <div className="form-field full">
            <label>Tell people what it&apos;s really like</label>
            <textarea
              placeholder="Vibe, what surprised you, who it's good for, what to expect…"
              style={{ minHeight: 100 }}
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          {error && <div className="form-err">{error}</div>}
          {success && <div className="form-success">✅ Review submitted! Thank you.</div>}
          <div className="form-actions">
            <button className="nbtn" onClick={onClose}>Cancel</button>
            <button className="nbtn primary" onClick={submit} disabled={loading}>
              {loading ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
