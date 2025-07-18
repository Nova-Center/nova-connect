"use client"

import { useCallback } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"

interface UseShopActionsProps {
  onActionSuccess: () => void
}

export function useShopActions({ onActionSuccess }: UseShopActionsProps) {
  const session = useSession()
  const user = session?.data?.user

  const handlePurchase = useCallback(
    async (itemId: number) => {
      if (!user?.accessToken) {
        toast({ title: "Vous devez être connecté pour acheter un article", variant: "destructive" })
        return
      }
      if (!confirm("Êtes-vous sûr de vouloir acheter cet article ?")) return

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shop-items/${itemId}/purchase`,
          {},
          { headers: { Authorization: `Bearer ${user.accessToken}` } },
        )
        toast({ title: "Article acheté avec succès ! 🎉", description: "Votre achat a été enregistré." })
        onActionSuccess()
      } catch (error: any) {
        console.error("Erreur lors de l'achat de l'article:", error.response?.data || error.message)
        toast({
          title: "Erreur lors de l'achat",
          description: error.response?.data?.message || "Une erreur est survenue lors de l'achat.",
          variant: "destructive",
        })
      }
    },
    [user?.accessToken, onActionSuccess],
  )

  return {
    handlePurchase,
  }
}
