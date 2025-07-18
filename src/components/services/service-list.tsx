"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { CalendarDays, Star, Trash2, UserPlus, UserMinus, Crown, Repeat, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import ProposeExchangeDialog from "@/components/services/propose-exchange-dialog"
import { useServiceActions } from "@/hooks/use-service-actions"
import { Service, ServicesApiResponse } from "@/types/service"

interface ServiceListProps {
  searchQuery?: string
  refreshTrigger?: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  setTotalServices: (total: number) => void // Callback to update total services in parent
}

export default function ServiceList({
  searchQuery = "",
  refreshTrigger = 0,
  currentPage,
  itemsPerPage,
  onPageChange,
  setTotalServices,
}: ServiceListProps) {
  const session = useSession()
  const user = session?.data?.user

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedServiceForExchange, setSelectedServiceForExchange] = useState<Service | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  const handleActionSuccess = useCallback(() => {
    fetchServices() // Refresh services after any action
  }, [])

  const {
    handleParticipate,
    handleUnvolunteer,
    handleDeleteService,
    handleProposeExchange,
    handleAcceptExchange,
    handleCancelExchange,
  } = useServiceActions({ onActionSuccess: handleActionSuccess })

  const fetchServices = useCallback(async () => {
    if (session.status !== "authenticated" || !user?.accessToken) {
      setServices([])
      setTotalServices(0)
      setTotalPages(1)
      return
    }

    setLoading(true)
    try {
      const response = await axios.get<ServicesApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services?page=${currentPage}&per_page=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        },
      )

      const servicesData = response.data.data || []
      const meta = response.data.meta
      setServices(servicesData)
      setTotalServices(meta.total)
      setTotalPages(meta.lastPage)
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error)
      toast({ title: "Erreur lors du chargement des services", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [user?.accessToken, session.status, currentPage, itemsPerPage, setTotalServices])

  useEffect(() => {
    fetchServices()
  }, [user?.accessToken, refreshTrigger, session.status, fetchServices, currentPage])

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
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white dark:bg-slate-800">
            <CardContent className="p-6 space-y-4">
              <div className="h-4 bg-muted dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-muted dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-16 bg-muted dark:bg-slate-700 rounded"></div>
              <div className="h-10 bg-muted dark:bg-slate-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredServices.length === 0 && !searchQuery) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="text-6xl">✨</div>
          <h3 className="text-xl font-semibold text-foreground">Aucun service disponible</h3>
          <p className="text-muted-foreground">Soyez le premier à proposer un service !</p>
        </div>
      </div>
    )
  }

  if (filteredServices.length === 0 && searchQuery) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold text-foreground">Aucun service trouvé</h3>
          <p className="text-muted-foreground">Aucun résultat pour "{searchQuery}"</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const isOwner = service.owner_id === user?.id
          const isVolunteeredBySomeoneElse = service.volunteer_id !== null && service.volunteer_id !== user?.id
          const isVolunteeredByMe = service.volunteer_id === user?.id

          const serviceDate = new Date(service.date).toLocaleDateString("fr-FR")

          return (
            <Card
              key={service.id}
              className={cn(
                "group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/50 bg-white dark:bg-slate-800",
                {
                  "opacity-70 grayscale pointer-events-none": isVolunteeredBySomeoneElse, // Visually disable if taken by someone else
                  "border-purple-400 dark:border-purple-600 ring-2 ring-purple-200 dark:ring-purple-800":
                    service.is_exchange_only, // Emphasize exchange services
                },
              )}
            >
              <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                      {service.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {isOwner && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700 shrink-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Propriétaire
                        </Badge>
                      )}
                      {isVolunteeredBySomeoneElse && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700 shrink-0">
                          ✓ Déjà réservé
                        </Badge>
                      )}
                      {isVolunteeredByMe && !isOwner && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700 shrink-0">
                          ✓ Votre participation
                        </Badge>
                      )}
                      {service.is_exchange_only && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700 shrink-0">
                          <Repeat className="h-3 w-3 mr-1" />
                          Échange
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {(service.owner_name || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm text-foreground">
                        {service.owner_name || "Utilisateur inconnu"}
                      </div>
                      <div className="text-xs text-muted-foreground">Organisateur</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-muted/30 dark:bg-slate-700/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{service.description}</p>
                  {service.is_exchange_only && service.desired_service_description && (
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-2 italic">
                      Recherche en échange : {service.desired_service_description}
                    </p>
                  )}
                </div>

                {/* Information */}
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md dark:bg-blue-900/20 dark:text-blue-300 w-fit">
                  <CalendarDays className="w-4 h-4" />
                  <span className="font-medium">{serviceDate}</span>
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
                  ) : isVolunteeredBySomeoneElse ? (
                    <Button variant="destructive" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Déjà réservé
                    </Button>
                  ) : isVolunteeredByMe ? (
                    <Button onClick={() => handleUnvolunteer(service.id)} variant="destructive" className="w-full">
                      <UserMinus className="mr-2 h-4 w-4" />
                      Annuler participation
                    </Button>
                  ) : service.is_exchange_only ? (
                    <Button onClick={() => setSelectedServiceForExchange(service)} className="w-full">
                      <Repeat className="mr-2 h-4 w-4" />
                      Proposer un échange
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Page précédente</span>
          </Button>
          <span className="text-sm font-medium text-foreground">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Page suivante</span>
          </Button>
        </div>
      )}

      {selectedServiceForExchange && (
        <ProposeExchangeDialog
          open={!!selectedServiceForExchange}
          onClose={() => setSelectedServiceForExchange(null)}
          serviceId={selectedServiceForExchange.id}
          onPropose={handleProposeExchange}
        />
      )}
    </>
  )
}
