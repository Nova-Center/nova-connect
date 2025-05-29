"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import {
  Search,
  Home,
  Bell,
  Users,
  Calendar,
  Settings,
  User,
  LogOut,
  MessageCircle,
} from "lucide-react"

import { Input } from "@/components/ui/input"
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
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Users, label: "Amis", href: "/friends" },
  { icon: Calendar, label: "Événements", href: "/events" },
]

interface UserSuggestion {
  id: number
  username: string
  avatar?: string | null
  isOnline: boolean
}

export function MainSidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const [points, setPoints] = useState<number | null>(null)
  const [users, setUsers] = useState<UserSuggestion[]>([])

  useEffect(() => {
    if (!user?.accessToken) return

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me/nova-points`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => setPoints(res.data.points ?? null))
      .catch(() => setPoints(null))

    // TODO: remplacer par une vraie requête vers /api/v1/users plus tard
    setUsers([
      { id: 1, username: "Utilisateur 1", avatar: null, isOnline: true },
      { id: 2, username: "Utilisateur 2", avatar: null, isOnline: false },
      { id: 3, username: "Utilisateur 3", avatar: null, isOnline: true },
    ])
  }, [user?.accessToken])

  return (
    <Sidebar className="w-60">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/images/nova-connect-logo.png"
            alt="Logo Nova Connect"
            width={60}
            height={60}
            className="h-10 w-10 rounded-xl"
          />
          <span className="font-semibold text-xl">Nova Connect</span>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-9 bg-muted/50 border-none text-foreground" />
        </div>

        <div className="mt-4">
          <CreatePostButton />
        </div>
      </SidebarHeader>

      <SidebarContent className="space-y-4">
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

        <SidebarGroup>
          <SidebarGroupLabel>Suggestions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {users.map((u) => (
                <SidebarMenuItem key={u.id}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.avatar || `/placeholder.svg?text=${u.username[0]}`} />
                            <AvatarFallback>{u.username[0]}</AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white ${u.isOnline ? "bg-green-500" : "bg-gray-400"
                              }`}
                          />
                        </div>
                        <span className="text-sm text-foreground">{u.username}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:bg-muted">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar || "/placeholder-post.svg?height=40&width=40&text=ME"} />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.email || "Mon Profil"}</div>
              <div className="text-xs text-muted-foreground">
                ID: {user?.id || "inconnu"} <br />
                🎯 {points ?? "-"} pts
              </div>
            </div>
          </div>
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
