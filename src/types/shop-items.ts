export interface ShopItem {
  id: number
  owner_id: number
  name: string
  description: string
  price: number
  image: string // URL de l'image de l'article
  client_id?: number | null // ID de l'utilisateur qui a acheté l'article, null si non acheté
  date_purchase?: string | null // Date d'achat, null si non acheté
  created_at: string
  updated_at: string
}

export interface ShopItemsApiResponse {
  data: ShopItem[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}
