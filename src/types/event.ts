// Type définition pour les événements
export interface EventParticipant {
    id: string
    username: string
    avatar? : string
}

export interface EventItem {
    id: string
    title: string
    description: string
    location: string
    date: string
    max_participants: number
    participants: EventParticipant[]
    image?: string
    created_at: string
    updated_at: string
    creator_id?: string
    created_by?: string
}