"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Plus, Users, Calendar, TrendingUp } from "lucide-react"
import CreateServiceForm from "@/components/services/create-service"
import ServiceList from "@/components/services/service-list"
import axios from "axios"
import { useSession } from "next-auth/react"
import type { ServicesApiResponse } from "@/types/service"

export default function ServiceMain() {
  const session = useSession()
  const user = session?.data?.user

  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [stats, setStats] = useState({ activeServices: 0, servicesThisWeek: 0, totalParticipants: 0 })

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9 // You can adjust this number
  const [totalServices, setTotalServices] = useState(0) // State to hold total services from API meta

  const handleServiceCreated = useCallback(() => {
    setDialogOpen(false)
    setRefreshTrigger((prev) => prev + 1)
    setCurrentPage(1) // Reset to first page after creation
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const fetchStats = useCallback(async () => {
    if (session.status !== "authenticated" || !user?.accessToken) {
      setStats({ activeServices: 0, servicesThisWeek: 0, totalParticipants: 0 })
      return
    }

    try {
      // Fetch all services to calculate accurate stats (without pagination)
      const response = await axios.get<ServicesApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      const servicesData = response.data.data || []

      const activeServices = servicesData.length
      let totalParticipants = 0
      const now = new Date()
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7)
      endOfWeek.setHours(0, 0, 0, 0)

      let servicesThisWeek = 0

      servicesData.forEach((service: any) => {
        // Only count if volunteerId is present and not null
        if (typeof service.volunteerId === "number" && service.volunteerId !== null) {
          totalParticipants++
        }
        const serviceDate = new Date(service.date)

        if (serviceDate >= startOfWeek && serviceDate < endOfWeek) {
          servicesThisWeek++
        }
      })

      setStats({ activeServices, servicesThisWeek, totalParticipants })
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    }
  }, [user?.accessToken, session.status])

  useEffect(() => {
    fetchStats()
  }, [refreshTrigger, user?.accessToken, session.status, fetchStats])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-slate-950 dark:to-slate-800/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Services disponibles
            </h1>
            <p className="text-muted-foreground text-lg">Découvrez et proposez des services à la communauté</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Proposer un service
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700"
              aria-describedby="new-service-form-description"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground">Nouveau service</DialogTitle>
              </DialogHeader>
              <div id="new-service-form-description" className="sr-only">
                Formulaire pour créer un nouveau service.
              </div>
              <CreateServiceForm onCreated={handleServiceCreated} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="bg-background/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un service, un organisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {searchQuery && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>
                Recherche pour : <strong>"{searchQuery}"</strong>
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="h-6 px-2 text-xs">
                Effacer
              </Button>
            </div>
          )}
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-4 border border-blue-500/10 dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg dark:bg-blue-900/40">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.activeServices}</div>
                <div className="text-sm text-muted-foreground">Services actifs</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-4 border border-green-500/10 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg dark:bg-green-900/40">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.servicesThisWeek}</div>
                <div className="text-sm text-muted-foreground">Cette semaine</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-4 border border-purple-500/10 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg dark:bg-purple-900/40">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalParticipants}</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </div>
            </div>
          </div>
        </div>

        {/* Service List */}
        <ServiceList
          searchQuery={searchQuery}
          refreshTrigger={refreshTrigger}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          setTotalServices={setTotalServices}
        />
      </div>
    </div>
  )
}
