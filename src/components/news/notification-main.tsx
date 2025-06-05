"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  Bell, Check, X, Heart, MessageCircle, UserPlus, Calendar, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Notification } from "@/types/news"
import axios from "axios"

const getNotificationIcon = (type?: string) => {
  switch (type) {
    case "like": return <Heart className="h-4 w-4 text-red-500" />
    case "comment": return <MessageCircle className="h-4 w-4 text-blue-500" />
    case "friend": return <UserPlus className="h-4 w-4 text-green-500" />
    case "event": return <Calendar className="h-4 w-4 text-purple-500" />
    case "system": return <Settings className="h-4 w-4 text-orange-500" />
    default: return <Bell className="h-4 w-4" />
  }
}

export function NotificationsList() {
  const { data: session } = useSession()
  const user = session?.user
  const [notifications, setNotifications] = useState<(Notification & { read?: boolean })[]>([])
  const [activeTab, setActiveTab] = useState("all")

const fetchNotifications = async () => {
  if (!user?.accessToken) return
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    })

    console.log("🔎 res.data =", res.data)

    const rawData = Array.isArray(res.data.data) ? res.data.data : []

    const mapped = rawData.map((notif: Notification) => ({
      ...notif,
      read: false, // temporairement local
    }))

    setNotifications(mapped)
  } catch (err) {
    console.error("Erreur récupération:", err)
    setNotifications([])
  }
}


  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  useEffect(() => {
    if (user?.accessToken) fetchNotifications()
  }, [user?.accessToken])

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications = notifications.filter((n) =>
    activeTab === "unread" ? !n.read : activeTab === "read" ? n.read : true
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Restez informé de toute l'activité</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200">
                {unreadCount} non lues
              </Badge>
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs">
                <Check className="h-3 w-3 mr-1" />
                Tout marquer comme lu
              </Button>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Lues ({notifications.length - unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucune notification</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {activeTab === "unread"
                        ? "Toutes vos notifications ont été lues !"
                        : "Vous n'avez pas encore de notifications."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card key={notification.id}
                    className={`transition-all duration-200 hover:shadow-md ${!notification.read
                      ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                      : "hover:bg-muted/50"
                      }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            {getNotificationIcon()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.excerpt || notification.content}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(notification.created_at).toLocaleString("fr-FR")}
                                </span>
                                {getNotificationIcon()}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
