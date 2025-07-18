export interface Service {
  id: number
  title: string
  description: string
  date: string // API returns date as a string (e.g., "2025-07-08T00:00:00.000Z")
  ownerId: number // Changed from owner_id to ownerId
  owner_name?: string // Assuming API might provide owner's name/username
  volunteerId?: number | null // Changed from volunteer_id to volunteerId
  exchangeServiceId?: number | null // Changed from exchange_service_id to exchangeServiceId
  desiredServiceDescription?: string | null // Already camelCase, keeping as is
  isExchangeOnly: boolean // Changed from is_exchange_only to isExchangeOnly
  createdAt: string // Changed from created_at to createdAt
  updatedAt: string // Changed from updated_at to updatedAt
  // exchange_proposals might be part of detailed service fetch, not list
  exchange_proposals?: Array<{ id: number; proposer_id: number; proposer_name?: string; status: string }>
}

export interface ServicesApiResponse {
  data: Service[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}
