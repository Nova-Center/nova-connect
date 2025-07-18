"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateServiceForm from "./create-service"
import ServiceList from "./service-list"
import { Search, Plus, Users, Calendar, TrendingUp } from "lucide-react"

export default function ServiceMain() {
  const { data: session, status } = useSession()
  const token = session?.user?.accessToken
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [stats, setStats] = useState({ active: 0, thisWeek: 0, participants: 0 })

  // Pagination
  const [page, setPage] = useState(1)
  const perPage = 9
  const [total, setTotal] = useState(0)

  const reloadList = useCallback(() => {
    setRefreshKey((k) => k + 1)
    setPage(1)
    setOpen(false)
  }, [])

  const fetchStats = useCallback(async () => {
    if (!token) return
    try {
      const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`, { headers })
      const data = resp.data.data || []
      setTotal(resp.data.total || data.length)

      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const end = new Date(start)
      end.setDate(start.getDate() + 7)

      let countWeek = 0, totPart = 0
      data.forEach((s: any) => {
        totPart += s.participants?.length || 0
        const d = new Date(Number(s.date))
        if (d >= start && d < end) countWeek++
      })

      setStats({ active: data.length, thisWeek: countWeek, participants: totPart })
    } catch {
      /* ignore */
    }
  }, [token])

  useEffect(() => {
    fetchStats()
  }, [fetchStats, refreshKey])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header + dialog */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Services disponibles
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80">
                <Plus className="mr-2" /> Proposer un service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Nouveau service</DialogTitle>
              </DialogHeader>
              <CreateServiceForm onCreated={reloadList} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un service…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<Users />} value={stats.active} label="Actifs" color="blue" />
          <StatCard icon={<Calendar />} value={stats.thisWeek} label="Cette semaine" color="green" />
          <StatCard icon={<TrendingUp />} value={stats.participants} label="Participants" color="purple" />
        </div>

        {/* Liste */}
        <ServiceList
          searchQuery={searchQuery}
          refreshTrigger={refreshKey}
          currentPage={page}
          itemsPerPage={perPage}
          onPageChange={setPage}
          totalServices={total}
        />
      </div>
    </div>
  )
}

// Petit composant interne pour les stats
function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: number
  label: string
  color: "blue" | "green" | "purple"
}) {
  const bg = {
    blue: "from-blue-500/10 to-blue-600/5",
    green: "from-green-500/10 to-green-600/5",
    purple: "from-purple-500/10 to-purple-600/5",
  }[color]
  return (
    <div className={`bg-gradient-to-br ${bg} rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-500/20 rounded-lg`}>{icon}</div>
        <div>
          <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  )
}
