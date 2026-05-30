'use client'
import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { Gym, Review, FilterState } from '@/types'
import Nav from '@/components/Nav'
import FilterBar from '@/components/FilterBar'
import GymCard from '@/components/GymCard'
import GymDetailModal from '@/components/GymDetailModal'
import AuthModal from '@/components/AuthModal'
import AddGymModal from '@/components/AddGymModal'
import ReviewModal from '@/components/ReviewModal'

const DEFAULT_FILTERS: FilterState = {
  search: '', country: 'all', style: 'all', vibe: 'all',
  openMat: false, dropIn: false, late: false, noContract: false, women: false, trial: false,
  sort: 'score',
}

function applyFilters(gyms: Gym[], f: FilterState): Gym[] {
  let list = [...gyms]
  const q = f.search.toLowerCase()
  if (q) list = list.filter(g => `${g.name}${g.city}${g.country}${g.affiliation ?? ''}`.toLowerCase().includes(q))
  if (f.country !== 'all') list = list.filter(g => g.country === f.country)
  if (f.style === 'gi') list = list.filter(g => g.has_gi && !g.has_nogi)
  if (f.style === 'nogi') list = list.filter(g => g.has_nogi && !g.has_gi)
  if (f.style === 'both') list = list.filter(g => g.has_gi && g.has_nogi)
  if (f.vibe !== 'all') list = list.filter(g => g.vibe === f.vibe)
  if (f.openMat) list = list.filter(g => g.open_mat)
  if (f.dropIn) list = list.filter(g => g.drop_in)
  if (f.late) list = list.filter(g => g.can_come_late)
  if (f.noContract) list = list.filter(g => g.no_contract)
  if (f.women) list = list.filter(g => g.womens_class)
  if (f.trial) list = list.filter(g => g.free_trial)
  if (f.sort === 'price-asc') list.sort((a, b) => (a.monthly_price ?? 999) - (b.monthly_price ?? 999))
  if (f.sort === 'price-desc') list.sort((a, b) => (b.monthly_price ?? 0) - (a.monthly_price ?? 0))
  return list
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const [detailGym, setDetailGym] = useState<Gym | null>(null)
  const [detailReviews, setDetailReviews] = useState<Review[]>([])
  const [showDetail, setShowDetail] = useState(false)

  const [showAuth, setShowAuth] = useState(false)
  const [showAddGym, setShowAddGym] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [reviewGymId, setReviewGymId] = useState<string | null>(null)

  const sb = createClient()

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadGyms = useCallback(async () => {
    setLoading(true)
    const { data } = await sb.from('gyms').select('*').order('created_at', { ascending: false })
    setGyms(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadGyms() }, [loadGyms])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setShowDetail(false); setShowAuth(false); setShowAddGym(false); setShowReview(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function openDetail(gym: Gym) {
    setDetailGym(gym)
    setShowDetail(true)
    const { data } = await sb.from('reviews').select('*').eq('gym_id', gym.id).order('created_at', { ascending: false })
    const reviews = data ?? []
    setDetailReviews(reviews)
    if (reviews.length) {
      const overallVals = reviews.map(r => r.overall_rating).filter(Boolean)
      const avg = overallVals.length ? overallVals.reduce((a: number, b: number) => a + b, 0) / overallVals.length : null
      setDetailGym(g => g ? { ...g, _avg_rating: avg } : g)
      setGyms(gs => gs.map(g => g.id === gym.id ? { ...g, _avg_rating: avg } : g))
    }
  }

  function handleAddGym() {
    if (!user) { setShowAuth(true); return }
    setShowAddGym(true)
  }

  function handleWriteReview() {
    if (!user) { setShowAuth(true); return }
    if (!detailGym) return
    setReviewGymId(detailGym.id)
    setShowDetail(false)
    setShowReview(true)
  }

  async function handleReviewSuccess(gymId: string) {
    setShowReview(false)
    await loadGyms()
    const gym = gyms.find(g => g.id === gymId)
    if (gym) openDetail(gym)
  }

  const displayed = applyFilters(gyms, filters)

  return (
    <>
      <Nav
        user={user}
        search={filters.search}
        onSearchChange={search => setFilters(f => ({ ...f, search }))}
        onSignIn={() => setShowAuth(true)}
        onAddGym={handleAddGym}
      />

      <FilterBar filters={filters} onChange={update => setFilters(f => ({ ...f, ...update }))} />

      <div className="sbar">
        <div className="gym-count"><b>{displayed.length}</b> gym{displayed.length !== 1 ? 's' : ''} found</div>
        <select
          className="sort-sel"
          value={filters.sort}
          onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
        >
          <option value="score">⭐ Top rated</option>
          <option value="reviews">💬 Most reviewed</option>
          <option value="price-asc">💰 Price: low to high</option>
          <option value="price-desc">💰 Price: high to low</option>
        </select>
      </div>

      <div className="grid">
        {loading ? (
          <div className="state-msg">
            <div className="spinner" />
            <p>Loading gyms…</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="state-msg">
            {gyms.length === 0
              ? <><h3>No gyms yet 🥋</h3><p>Be the first to add one!</p></>
              : <><h3>No gyms match your filters</h3><p>Try adjusting the filters above.</p></>}
          </div>
        ) : (
          displayed.map((gym, i) => (
            <GymCard key={gym.id} gym={gym} rank={i + 1} onClick={() => openDetail(gym)} />
          ))
        )}
      </div>

      <GymDetailModal
        gym={detailGym}
        reviews={detailReviews}
        user={user}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onWriteReview={handleWriteReview}
      />

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
      />

      <AddGymModal
        open={showAddGym}
        user={user}
        onClose={() => setShowAddGym(false)}
        onSuccess={loadGyms}
      />

      <ReviewModal
        open={showReview}
        gymId={reviewGymId}
        gymName={detailGym?.name ?? ''}
        user={user}
        onClose={() => setShowReview(false)}
        onSuccess={handleReviewSuccess}
      />
    </>
  )
}
