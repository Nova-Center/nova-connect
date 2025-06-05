"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Notification } from "@/types/news"
import { useSession } from "next-auth/react"
import axios from "axios"

export function NotificationBell() {
  const { data: session } = useSession()
  const user = session?.user
  const [notifications, setNotifications] = useState<(Notification & { read?: boolean })[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    if (!user?.accessToken) return
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

     const raw = Array.isArray(res.data.data) ? res.data.data : []

      const mapped = raw.map((notif: Notification) => ({
        ...notif,
        read: false,
      }))

      setNotifications(mapped)
    } catch (err) {
      console.error("Erreur API notifications:", err)
      setNotifications([])
    }
  }


  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  useEffect(() => {
    if (user?.accessToken) {
      fetchNotifications()
    }
  }, [user?.accessToken])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} nouvelles
              </Badge>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                      }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                        <AvatarFallback>{notification.title[0]}</AvatarFallback>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{notification.title}</p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.excerpt || notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t">
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={() => {
              setIsOpen(false)
              window.location.href = "/news"
            }}
          >
            Voir toutes les notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
