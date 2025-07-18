"use client"

import useSWR from "swr"
import axios from "axios"
import { useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"
import type { ShopItemsApiResponse } from "@/types/shop-items"

interface UseShopItemsProps {
  page: number
  perPage: number
  searchQuery?: string
  refreshTrigger?: number
}

const fetcher = async (url: string, token: string) => {
  try {
    const response = await axios.get<ShopItemsApiResponse>(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors du chargement des articles de la boutique:", error.response?.data || error.message)
    toast({
      title: "Erreur de chargement",
      description: error.response?.data?.message || "Impossible de charger les articles de la boutique.",
      variant: "destructive",
    })
    throw error
  }
}

export function useShopItems({ page, perPage, searchQuery = "", refreshTrigger }: UseShopItemsProps) {
  const { data: session, status } = useSession()
  const token = session?.user.accessToken

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shop-items?page=${page}&per_page=${perPage}&search=${searchQuery}`

  const { data, error, isLoading, mutate } = useSWR(
    status === "authenticated" && token ? [apiUrl, token, refreshTrigger] : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    shopItems: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  }
}
