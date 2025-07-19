"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import axios from "axios"
import { Home, Bell, Users, Calendar, LogOut, ShoppingBag, Zap, Crown, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { CreatePostButton } from "@/components/posts/create-post-button"

const navigationItems = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: Bell, label: "Notifications", href: "/news" },
  { icon: Users, label: "Service", href: "/services" },
  { icon: Calendar, label: "Événements", href: "/event" },
  { icon: ShoppingBag, label: "Shop", href: "/shop" },
]

// Helper function pour déterminer le niveau
const getUserLevel = (points: number) => {
  if (points >= 2000) return { level: "Expert", color: "from-purple-500 to-pink-500", icon: Crown }
  if (points >= 1000) return { level: "Avancé", color: "from-blue-500 to-cyan-500", icon: Star }
  if (points >= 500) return { level: "Intermédiaire", color: "from-green-500 to-emerald-500", icon: Users }
  return { level: "Débutant", color: "from-gray-500 to-slate-500", icon: Users }
}

// Helper function pour calculer les points nécessaires pour le niveau suivant
const getPointsToNextLevel = (points: number) => {
  if (points < 500) return 500 - points
  if (points < 1000) return 1000 - points
  if (points < 2000) return 2000 - points
  return 0 // Niveau maximum atteint
}

// Helper function pour calculer le pourcentage de progression
const getLevelProgress = (points: number) => {
  if (points < 500) return (points / 500) * 100
  if (points < 1000) return ((points - 500) / 500) * 100
  if (points < 2000) return ((points - 1000) / 1000) * 100
  return 100 // Niveau maximum
}

export function MainSidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()

  const [points, setPoints] = useState<number | null>(null)
  const [todayPoints, setTodayPoints] = useState<number>(0)
  const [rank, setRank] = useState<string>("...")

  useEffect(() => {
    if (!user?.accessToken) return

    // Points totaux
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me/nova-points`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => setPoints(res.data.points ?? null))
      .catch(() => setPoints(null))

    // Points aujourd'hui
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/nova-points/history/${user.id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => {
        const today = new Date().toDateString()
        const todayTotal = res.data
          .filter((entry: any) => new Date(entry.created_at).toDateString() === today)
          .reduce((sum: number, entry: any) => sum + entry.points, 0)
        setTodayPoints(todayTotal)
      })
      .catch(() => setTodayPoints(0))

    // Classement
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/nova-points/leaderboard`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => {
        const index = res.data.findIndex((u: any) => u.id === user.id)
        setRank(index >= 0 ? `#${index + 1}` : "Non classé")
      })
      .catch(() => setRank("N/A"))
  }, [user?.accessToken])

  const currentPoints = points ?? 0
  const userLevel = getUserLevel(currentPoints)
  const pointsToNext = getPointsToNextLevel(currentPoints)
  const progressPercentage = getLevelProgress(currentPoints)
  const LevelIcon = userLevel.icon

  return (
    <Sidebar className="w-80 border-r border-border/40 bg-gradient-to-b from-background to-muted/20">
      <SidebarHeader className="p-6 border-b border-border/40">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={user?.avatar || "/placeholder.svg?height=56&width=56"} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                {user?.email?.[0]?.toUpperCase() || "ME"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-lg truncate">{user?.email?.split("@")[0] || "Mon Profil"}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Zap className="h-3 w-3 text-amber-500" />
              <span className="font-medium">{points ?? "-"} NovaPoints</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <CreatePostButton />
        </div>
      </SidebarHeader>

      <SidebarContent className="space-y-6 px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="h-11 rounded-xl transition-all duration-200 hover:bg-muted/60 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:border data-[active=true]:border-primary/20"
                  >
                    <a href={item.href} className="flex items-center gap-3 px-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-border/40" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            NovaPoints
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-4">
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-5 border border-primary/10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {points ?? "---"}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Points totaux</div>
                  </div>
                  <div className="text-4xl">🎯</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-4 text-center border border-green-500/10">
                  <div className="text-xl font-bold text-green-600">+{todayPoints}</div>
                  <div className="text-xs text-muted-foreground font-medium">Aujourd'hui</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-4 text-center border border-blue-500/10">
                  <div className="text-xl font-bold text-blue-600">{rank}</div>
                  <div className="text-xs text-muted-foreground font-medium">Classement</div>
                </div>
              </div>

              <div className="space-y-3 bg-muted/30 rounded-xl p-4 border border-border/40">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Niveau actuel</span>
                  <div className="flex items-center gap-2">
                    <LevelIcon className="h-4 w-4" />
                    <span className={`font-semibold bg-gradient-to-r ${userLevel.color} bg-clip-text text-transparent`}>
                      {userLevel.level}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${userLevel.color} h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center font-medium">
                  {pointsToNext > 0 ? `${pointsToNext} points pour le niveau suivant` : "Niveau maximum atteint ! 🎉"}
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/40">
        <div className="flex items-center justify-between gap-2 mt-3 px-2">
          <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
            ID: {user?.id || "inconnu"}
          </div>
          <div className="flex gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
