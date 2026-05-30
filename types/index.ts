export interface Gym {
  id: string
  name: string
  city: string
  country: string
  affiliation?: string | null
  instructor?: string | null
  address?: string | null
  website?: string | null
  instagram?: string | null
  vibe?: 'competition' | 'casual' | 'traditional' | 'mixed' | null
  monthly_price?: number | null
  drop_in_fee?: number | null
  has_gi: boolean
  has_nogi: boolean
  open_mat: boolean
  drop_in: boolean
  can_come_late: boolean
  no_contract: boolean
  womens_class: boolean
  free_trial: boolean
  submitted_by?: string | null
  created_at: string
  _avg_rating?: number | null
}

export interface Review {
  id: string
  gym_id: string
  user_id: string
  belt_at_time: string
  overall_rating: number
  hygiene?: number | null
  partner_level?: number | null
  women_friendly?: number | null
  instruction?: number | null
  rolling_pct?: number | null
  black_belts_on_mat?: number | null
  avg_class_size?: number | null
  women_pct?: number | null
  review_text: string
  created_at: string
}

export interface FilterState {
  search: string
  country: string
  style: string
  vibe: string
  openMat: boolean
  dropIn: boolean
  late: boolean
  noContract: boolean
  women: boolean
  trial: boolean
  sort: string
}
