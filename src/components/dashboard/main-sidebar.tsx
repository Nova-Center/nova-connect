"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Search, Home, Bell, Users, Calendar, Settings, User, LogOut } from "lucide-react"

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
import { CreatePostButton } from "@/components/dashboard/create-post-button"

const navigationItems = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Users, label: "Amis", href: "/friends" },
  { icon: Calendar, label: "Événements", href: "/events" },
]

export function MainSidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()

  return (
    <Sidebar>
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
          {/* Création de post invalide le cache SWR */}
          <CreatePostButton />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => (
                <SidebarMenuItem key={item.href}>
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
            {/* À remplacer par tes vraies suggestions */}
            <SidebarMenu>
              {[1, 2, 3].map(i => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <a href="#" className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=U${i}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <span>Utilisateur {i}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=ME" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.email || "Mon Profil"}</div>
              <div className="text-xs text-muted-foreground">ID: {user?.id || "inconnu"}</div>
            </div>
          </div>
          <div className="flex gap-1">
            <ThemeToggle />
            <div>
              <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
