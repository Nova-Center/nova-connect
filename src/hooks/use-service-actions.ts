"use client"

import { useCallback } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"

interface UseServiceActionsProps {
  onActionSuccess: () => void
}

export function useServiceActions({ onActionSuccess }: UseServiceActionsProps) {
  const session = useSession()
  const user = session?.data?.user

  const handleParticipate = useCallback(
    async (serviceId: number) => {
      if (!user?.accessToken) {
        toast({ title: "Vous devez être connecté", variant: "destructive" })
        return
      }
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}/volunteer`,
          {},
          { headers: { Authorization: `Bearer ${user.accessToken}` } },
        )
        toast({ title: "Participation confirmée ! 🎉" })
        onActionSuccess()
      } catch (error: any) {
        console.error("Erreur participation:", error.response?.data || error.message)
        toast({
          title: "Erreur lors de l'inscription",
          description: error.response?.data?.message || "Une erreur est survenue",
          variant: "destructive",
        })
      }
    },
    [user?.accessToken, onActionSuccess],
  )

  const handleUnvolunteer = useCallback(
    async (serviceId: number) => {
      if (!user?.accessToken) {
        toast({ title: "Vous devez être connecté", variant: "destructive" })
        return
      }
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}/unvolunteer`,
          {},
          { headers: { Authorization: `Bearer ${user.accessToken}` } },
        )
        toast({ title: "Participation annulée" })
        onActionSuccess()
      } catch (error: any) {
        console.error("Erreur annulation participation:", error.response?.data || error.message)
        toast({ title: "Erreur lors de l'annulation", variant: "destructive" })
      }
    },
    [user?.accessToken, onActionSuccess],
  )

  const handleDeleteService = useCallback(
    async (serviceId: number) => {
      if (!user?.accessToken) {
        toast({ title: "Vous devez être connecté", variant: "destructive" })
        return
      }
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return

      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        })
        toast({ title: "Service supprimé avec succès" })
        onActionSuccess()
      } catch (error: any) {
        console.error("Erreur suppression:", error.response?.data || error.message)
        toast({ title: "Erreur lors de la suppression", variant: "destructive" })
      }
    },
    [user?.accessToken, onActionSuccess],
  )

  const handleProposeExchange = useCallback(
    async (serviceId: number, desiredServiceDescription: string) => {
      if (!user?.accessToken) {
        toast({ title: "Vous devez être connecté pour proposer un échange", variant: "destructive" })
        return
      }
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}/propose-exchange`,
          {
            exchangeServiceId: serviceId, // As per API documentation
            desiredServiceDescription: desiredServiceDescription,
          },
          { headers: { Authorization: `Bearer ${user.accessToken}` } },
        )
        toast({ title: "Proposition d'échange envoyée ! 🎉", description: "L'organisateur sera notifié." })
        onActionSuccess()
      } catch (error: any) {
        console.error("Erreur lors de la proposition d'échange:", error.response?.data || error.message)
        toast({
          title: "Erreur lors de la proposition d'échange",
          description: error.response?.data?.message || "Une erreur est survenue",
          variant: "destructive",
        })
        throw error // Re-throw error for modal to handle loading state
      }
    },
    [user?.accessToken, onActionSuccess],
  )

  const handleAcceptExchange = useCallback(
    async (serviceId: number, proposalId: number) => {
      if (!user?.accessToken) {
        toast({ title: "Vous devez être connecté", variant: "destructive" })
        return
      }
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}/accept-exchange`,
          { proposal_id: proposalId },
          { headers: { Authorization: `Bearer ${user.accessToken}` } },
        )
        toast({ title: "Échange accepté ! 🎉" })
        onActionSuccess()
      } catch (error: any) {
        console.error("Erreur lors de l'acceptation de l'échange:", error.response?.data || error.message)
        toast({
          title: "Erreur lors de l'acceptation de l'échange",
          description: error.response?.data?.message || "Une erreur est survenue",
          variant: "destructive",
        })
      }
    },
    [user?.accessToken, onActionSuccess],
  )

  const handleCancelExchange = useCallback(
    async (serviceId: number, proposalId: number) => {
      if (!user?.accessToken) {
        toast({ title: "Vous devez être connecté", variant: "destructive" })
        return
      }
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}/cancel-exchange`,
          { proposal_id: proposalId },
          { headers: { Authorization: `Bearer ${user.accessToken}` } },
        )
        toast({ title: "Proposition d'échange annulée." })
        onActionSuccess()
      } catch (error: any) {
        console.error("Erreur lors de l'annulation de l'échange:", error.response?.data || error.message)
        toast({
          title: "Erreur lors de l'annulation de l'échange",
          description: error.response?.data?.message || "Une erreur est survenue",
          variant: "destructive",
        })
      }
    },
    [user?.accessToken, onActionSuccess],
  )

  return {
    handleParticipate,
    handleUnvolunteer,
    handleDeleteService,
    handleProposeExchange,
    handleAcceptExchange,
    handleCancelExchange,
  }
}
