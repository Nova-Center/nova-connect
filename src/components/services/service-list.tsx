"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { CalendarDays, Users, Star, Trash2, UserPlus, UserMinus, Crown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Service {
  id: number
  title: string
  description: string
  date: string
  owner_id: number
  owner_name?: string
  participants?: Array<{ id: number; username?: string }>
}

interface ServiceListProps {
  searchQuery?: string
  refreshTrigger?: number
}

export default function ServiceList({ searchQuery = "", refreshTrigger = 0 }: ServiceListProps) {
  const session = useSession()
  const user = session?.data?.user

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [userParticipations, setUserParticipations] = useState<Set<number>>(new Set())

  const fetchServices = async () => {
    if (!user?.accessToken) return

    setLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })

      const servicesData = response.data.data || []
      setServices(servicesData)

      // Vérifier les participations de l'utilisateur
      const participations = new Set<number>()
      servicesData.forEach((service: Service) => {
        if (service.participants?.some((p) => p.id === user.id)) {
          participations.add(service.id)
        }
      })
      setUserParticipations(participations)
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error)
      toast({ title: "Erreur lors du chargement des services", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleParticipate = async (serviceId: number) => {
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

      setUserParticipations((prev) => new Set([...prev, serviceId]))
      toast({ title: "Participation confirmée ! 🎉" })
      fetchServices()
    } catch (error: any) {
      toast({
        title: "Erreur lors de l'inscription",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const handleCancelParticipation = async (serviceId: number) => {
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

      setUserParticipations((prev) => {
        const newSet = new Set(prev)
        newSet.delete(serviceId)
        return newSet
      })
      toast({ title: "Participation annulée" })
      fetchServices()
    } catch (error) {
      toast({ title: "Erreur lors de l'annulation", variant: "destructive" })
    }
  }

  const handleDeleteService = async (serviceId: number) => {
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
      fetchServices()
    } catch (error) {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    }
  }

  useEffect(() => {
    if (user?.accessToken) {
      fetchServices()
    }
  }, [user?.accessToken, refreshTrigger])

  // Gestion des états de session
  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (session.status === "unauthenticated" || !user?.accessToken) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-3">
          <div className="text-4xl">🔒</div>
          <p className="text-muted-foreground">Connectez-vous pour voir les services</p>
        </div>
      </div>
    )
  }

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.owner_name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredServices.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold">{searchQuery ? "Aucun service trouvé" : "Aucun service disponible"}</h3>
          <p className="text-muted-foreground">
            {searchQuery ? `Aucun résultat pour "${searchQuery}"` : "Soyez le premier à proposer un service !"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => {
        const isOwner = service.owner_id === user.id
        const isParticipant = userParticipations.has(service.id)
        const participantCount = service.participants?.length || 0

        return (
          <Card
            key={service.id}
            className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/20"
          >
            <CardContent className="p-6 space-y-5">
              {/* En-tête */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {service.title}
                  </h3>
                  {isOwner && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 shrink-0">
                      <Crown className="h-3 w-3 mr-1" />
                      Propriétaire
                    </Badge>
                  )}
                  {isParticipant && !isOwner && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 shrink-0">✓ Inscrit</Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {(service.owner_name || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{service.owner_name || "Utilisateur inconnu"}</div>
                    <div className="text-xs text-muted-foreground">Organisateur</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{service.description}</p>
              </div>

              {/* Informations */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                  <CalendarDays className="w-4 h-4" />
                  <span className="font-medium">{new Date(service.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    {participantCount} participant{participantCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {isOwner ? (
                  <>
                    <Button disabled className="flex-1" variant="secondary">
                      <Star className="mr-2 h-4 w-4" />
                      Votre service
                    </Button>
                    <Button
                      onClick={() => handleDeleteService(service.id)}
                      variant="destructive"
                      size="icon"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : isParticipant ? (
                  <Button
                    onClick={() => handleCancelParticipation(service.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    Annuler participation
                  </Button>
                ) : (
                  <Button onClick={() => handleParticipate(service.id)} className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Participer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
