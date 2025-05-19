"use client"

import {
  Bell,
  Calendar,
  Home,
  LogOut,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"

const navigationItems = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Users, label: "Amis", href: "/friends" },
  { icon: Calendar, label: "Événements", href: "/events" },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession()
  const user = session?.user


  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/nova-connect-logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="h-10 w-10 rounded-xl"
          />
          <div className="font-semibold text-xl">Nova Connect</div>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 bg-muted/50 border-none"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <a href={item.href}>
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
              {[1, 2, 3].map((i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <a href="#" className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32&text=U${i}`}
                          alt={`Utilisateur ${i}`}
                        />
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
              <AvatarImage
                src="/placeholder.svg?height=40&width=40&text=ME"
                alt="Mon profil"
              />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user?.email ?? "Mon Profil"}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {user?.id ?? "inconnu"}
              </div>

            </div>
          </div>
          <div className="flex gap-1">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=> signOut({callbackUrl: "/"})}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
