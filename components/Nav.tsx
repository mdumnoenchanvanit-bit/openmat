'use client'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface Props {
  user: User | null
  search: string
  onSearchChange: (v: string) => void
  onSignIn: () => void
  onAddGym: () => void
}

export default function Nav({ user, search, onSearchChange, onSignIn, onAddGym }: Props) {
  const sb = createClient()

  async function signOut() {
    await sb.auth.signOut()
    window.location.reload()
  }

  const avatar = user?.user_metadata?.avatar_url as string | undefined
  const name = (user?.user_metadata?.full_name as string) || user?.email || 'You'
  const firstName = name.split(' ')[0]

  return (
    <nav>
      <div className="logo">OPEN<span>MAT</span></div>
      <div className="search-box">
        <span style={{ color: '#555', fontSize: 14 }}>🔍</span>
        <input
          type="text"
          placeholder="Search gym, city, country…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="nav-btns">
        {user ? (
          <>
            <button className="nbtn primary" onClick={onAddGym}>+ Add gym</button>
            <div className="user-menu">
              {avatar
                ? <img className="avatar" src={avatar} alt={name} />
                : <button className="nbtn">{firstName}</button>
              }
              <div className="user-dropdown">
                <div className="ud-item">{name}</div>
                <div className="ud-item danger" onClick={signOut}>Sign out</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="nbtn" onClick={onSignIn}>Sign in</button>
            <button className="nbtn primary" onClick={onSignIn}>+ Add gym</button>
          </>
        )}
      </div>
    </nav>
  )
}
