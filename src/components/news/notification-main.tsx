// components/notification-main.tsx
"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import {
  Bell,
  Check,
  Calendar,
  Heart,
  MessageCircle,
  UserPlus,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

interface Notification {
  id: number
  title: string
  excerpt?: string
  content?: string
  created_at: string
  read: boolean
  type?: string
}

const getNotificationIcon = (type?: string) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case "friend":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "event":
      return <Calendar className="h-4 w-4 text-purple-500" />
    case "system":
      return <Settings className="h-4 w-4 text-orange-500" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export default function NotificationsMain() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const API = process.env.NEXT_PUBLIC_API_URL!

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all")

  // 1️⃣ fetch sans pagination
  const fetchAll = async () => {
    if (!token) return
    try {
      const res = await axios.get<Notification[]>(
        `${API}/api/v1/notifications/no-pagination`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNotifications(res.data)
    } catch (err) {
      console.error("Erreur fetch notifications:", err)
      setNotifications([])
    }
  }

  // 2️⃣ mark-as-read individuel
  const markAsRead = async (id: number) => {
    if (!token) return
    try {
      await axios.post(
        `${API}/api/v1/notifications/${id}/read`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                read: true,
              }
            : n
        )
      )
    } catch (err) {
      console.error("Erreur mark-as-read:", err)
    }
  }

  // 3️⃣ mark-all-as-read
  const markAllAsRead = async () => {
    if (!token) return
    try {
      await axios.post(
        `${API}/api/v1/notifications/read-all`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error("Erreur read-all:", err)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [token])

  const unreadCount = notifications.filter((n) => !n.read).length
  const filtered = notifications.filter((n) =>
    activeTab === "unread"
      ? !n.read
      : activeTab === "read"
      ? n.read
      : true
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                Restez informé de toute l’activité
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-600 border-blue-200"
              >
                {unreadCount} non lues
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Tout marquer comme lu
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all">
              Toutes ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Non lues ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read">
              Lues ({notifications.length - unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Aucune notification
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {activeTab === "unread"
                      ? "Toutes vos notifications sont lues !"
                      : "Vous n’avez pas encore de notifications."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filtered.map((n) => (
                <Card
                  key={n.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    !n.read
                      ? "border-l-4 border-l-blue-500 bg-blue-50/50"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {getNotificationIcon(n.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">
                            {n.title}
                          </h4>
                          {!n.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {n.excerpt || n.content}
                        </p>
                        <div className="flex items-center gap-2">
                          {getNotificationIcon(n.type)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!n.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(n.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
