'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const sb = createClient()

  async function handleGoogle() {
    setLoading(true)
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) { setError(error.message) } else { setSent(true) }
  }

  if (!open) return null

  return (
    <div className={`overlay${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) { onClose(); setSent(false); setError('') } }}>
      <div className="auth-modal">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button className="mclose" style={{ position: 'static' }} onClick={() => { onClose(); setSent(false); setError('') }}>✕</button>
        </div>
        <h2>Join OpenMat</h2>
        <p>Sign in to add gyms, write reviews,<br />and help the BJJ community.</p>

        {sent ? (
          <div className="auth-success">
            ✅ Check your inbox — we sent a magic link to <strong>{email}</strong>
          </div>
        ) : (
          <>
            <button className="oauth-btn" onClick={handleGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            <div className="auth-divider">or</div>

            <form onSubmit={handleMagicLink}>
              <input
                className="magic-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button className="oauth-btn" type="submit" disabled={loading || !email.trim()}>
                ✉️ Send magic link
              </button>
            </form>

            {error && <p style={{ color: '#e8193c', fontSize: 12, marginTop: 8 }}>{error}</p>}
          </>
        )}

        <div className="auth-note">By signing in you agree to our terms of service.<br />We&apos;ll never post without your permission.</div>
      </div>
    </div>
  )
}
