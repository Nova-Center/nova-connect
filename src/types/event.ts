export interface EventParticipant {
  id: number
  username: string
  email: string
  avatar?: string
}

export interface EventItem {
  id: number
  user_id: number
  title: string
  image: string
  description: string
  location: string
  max_participants: number
  date: string
  participants: EventParticipant[]
  created_at: string
  updated_at: string
}
