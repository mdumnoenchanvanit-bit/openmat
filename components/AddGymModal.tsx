'use client'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface Props {
  open: boolean
  user: User | null
  onClose: () => void
  onSuccess: () => void
}

const BOOLS = [
  { id: 'has_gi', label: '🥋 Gi classes' },
  { id: 'has_nogi', label: '👊 No-Gi classes' },
  { id: 'open_mat', label: '🤝 Open mats' },
  { id: 'drop_in', label: '🚪 Drop-in OK' },
  { id: 'can_come_late', label: '⏰ Late arrivals OK' },
  { id: 'no_contract', label: '📄 No contract' },
  { id: 'womens_class', label: '♀️ Women\'s class' },
  { id: 'free_trial', label: '🎁 Free trial class' },
] as const

type BoolKey = (typeof BOOLS)[number]['id']

export default function AddGymModal({ open, user, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: '', city: '', country: '', affiliation: '', instructor: '',
    address: '', website: '', instagram: '', vibe: '', price: '', dropinFee: '',
  })
  const [bools, setBools] = useState<Record<BoolKey, boolean>>({
    has_gi: false, has_nogi: false, open_mat: false, drop_in: false,
    can_come_late: false, no_contract: false, womens_class: false, free_trial: false,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const sb = createClient()

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function submit() {
    setError('')
    if (!form.name.trim() || !form.city.trim() || !form.country.trim()) {
      setError('Gym name, city, and country are required.'); return
    }
    if (!user) return
    setLoading(true)
    const { error: err } = await sb.from('gyms').insert([{
      name: form.name.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      affiliation: form.affiliation.trim() || null,
      instructor: form.instructor.trim() || null,
      address: form.address.trim() || null,
      website: form.website.trim() || null,
      instagram: form.instagram.trim() || null,
      vibe: form.vibe || null,
      monthly_price: parseFloat(form.price) || null,
      drop_in_fee: parseFloat(form.dropinFee) || null,
      ...bools,
      submitted_by: user.id,
    }])
    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    onSuccess()
    setTimeout(() => { setSuccess(false); onClose() }, 2000)
  }

  if (!open) return null

  return (
    <div className={`overlay${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="form-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <div className="form-title">Add a gym</div>
            <div className="form-sub">Help the BJJ community. Fill in what you know.</div>
          </div>
          <button className="mclose" style={{ position: 'static' }} onClick={onClose}>✕</button>
        </div>

        <div className="form-grid">
          <div className="form-sec-title">Basic info</div>
          <div className="form-field full">
            <label>Gym name *</label>
            <input placeholder="e.g. Atos Jiu-Jitsu" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-field"><label>City *</label><input placeholder="e.g. San Diego" value={form.city} onChange={e => set('city', e.target.value)} /></div>
          <div className="form-field"><label>Country *</label><input placeholder="e.g. USA" value={form.country} onChange={e => set('country', e.target.value)} /></div>
          <div className="form-field"><label>Affiliation</label><input placeholder="e.g. Gracie Barra" value={form.affiliation} onChange={e => set('affiliation', e.target.value)} /></div>
          <div className="form-field"><label>Head instructor</label><input placeholder="e.g. Roger Gracie" value={form.instructor} onChange={e => set('instructor', e.target.value)} /></div>
          <div className="form-field full"><label>Address</label><input placeholder="Street address" value={form.address} onChange={e => set('address', e.target.value)} /></div>
          <div className="form-field"><label>Website</label><input placeholder="https://..." value={form.website} onChange={e => set('website', e.target.value)} /></div>
          <div className="form-field"><label>Instagram</label><input placeholder="@handle" value={form.instagram} onChange={e => set('instagram', e.target.value)} /></div>

          <div className="form-sec-title">Style & vibe</div>
          <div className="form-field">
            <label>Vibe</label>
            <select value={form.vibe} onChange={e => set('vibe', e.target.value)}>
              <option value="">Select vibe…</option>
              <option value="competition">🏆 Competition</option>
              <option value="casual">😎 Casual</option>
              <option value="traditional">🎌 Traditional</option>
              <option value="mixed">⚖️ Mixed</option>
            </select>
          </div>
          <div className="form-field"><label>Monthly price (USD)</label><input type="number" placeholder="e.g. 150" value={form.price} onChange={e => set('price', e.target.value)} /></div>
          <div className="form-field"><label>Drop-in fee (USD)</label><input type="number" placeholder="e.g. 25" value={form.dropinFee} onChange={e => set('dropinFee', e.target.value)} /></div>

          <div className="form-sec-title">Features</div>
          <div className="bool-grid" style={{ gridColumn: '1/-1' }}>
            {BOOLS.map(b => (
              <label
                key={b.id}
                className={`bool-item${bools[b.id] ? ' checked' : ''}`}
                onClick={() => setBools(prev => ({ ...prev, [b.id]: !prev[b.id] }))}
              >
                <input type="checkbox" checked={bools[b.id]} readOnly style={{ pointerEvents: 'none' }} />
                <span>{b.label}</span>
              </label>
            ))}
          </div>

          {error && <div className="form-err">{error}</div>}
          {success && <div className="form-success">✅ Gym submitted! It will appear once verified.</div>}
          <div className="form-actions">
            <button className="nbtn" onClick={onClose}>Cancel</button>
            <button className="nbtn primary" onClick={submit} disabled={loading}>
              {loading ? 'Submitting…' : 'Submit gym'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
