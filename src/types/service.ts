export interface Service {
  id: number
  title: string
  description: string
  date: string // API returns date as a string (e.g., "2025-07-08T00:00:00.000Z")
  owner_id: number
  owner_name?: string // Assuming API might provide owner's name/username
  volunteer_id?: number | null // Null if no volunteer, ID if volunteered
  exchange_service_id?: number | null // ID of the service offered in exchange, if applicable
  desired_service_description?: string | null // Description of desired exchange service
  is_exchange_only: boolean
  created_at: string
  updated_at: string
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
