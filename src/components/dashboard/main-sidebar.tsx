"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import axios from "axios"
import { Home, Bell, Users, Calendar, Settings, LogOut } from "lucide-react"

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
  { icon: Users, label: "Amis", href: "/friends" },
  { icon: Calendar, label: "Événements", href: "/event" },
]

export function MainSidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const [points, setPoints] = useState<number | null>(null)

  useEffect(() => {
    if (!user?.accessToken) return

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me/nova-points`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => setPoints(res.data.points ?? null))
      .catch(() => setPoints(null))
  }, [user?.accessToken])

  return (
    <Sidebar className="w-80">
      <SidebarHeader className="p-4">
        {/* Section Profil */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar || "/placeholder-post.svg?height=48&width=48&text=ME"} />
            <AvatarFallback className="text-lg">{user?.email?.[0]?.toUpperCase() || "ME"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-base">{user?.email?.split("@")[0] || "Mon Profil"}</div>
            <div className="text-sm text-muted-foreground">🎯 {points ?? "-"} NovaPoints</div>
          </div>
        </div>

        {/* Bouton Nouveau Post */}
        <div className="mb-4">
          <CreatePostButton />
        </div>
      </SidebarHeader>

      <SidebarContent className="space-y-4">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href} className="py-1">
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <a href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Section NovaPoints stylée */}
        <SidebarGroup>
          <SidebarGroupLabel>NovaPoints</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {/* Affichage principal des points */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-200/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{points ?? "---"}</div>
                    <div className="text-sm text-muted-foreground">Points totaux</div>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-green-600">+12</div>
                  <div className="text-xs text-muted-foreground">Aujourd'hui</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-blue-600">#51</div>
                  <div className="text-xs text-muted-foreground">Classement</div>
                </div>
              </div>

              {/* Progression vers le prochain niveau */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Niveau actuel</span>
                  <span className="font-medium">Niveau 1</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(points ?? 0) % 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {100 - ((points ?? 0) % 100)} points pour le niveau suivant
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer avec paramètres */}
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Paramètres</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="text-xs text-muted-foreground">ID: {user?.id || "inconnu"}</div>
          <div className="flex gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
