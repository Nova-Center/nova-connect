"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: number
  title: string
  excerpt?: string
  created_at: string
  read: boolean
  type?: string
}

export function NotificationBell() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const API = process.env.NEXT_PUBLIC_API_URL!

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // 1️⃣ Charger toutes les notifs (no pagination)
  const fetchNotifications = async () => {
    if (!token) return
    try {
      const res = await axios.get<Notification[]>(
        `${API}/api/v1/notifications/no-pagination`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNotifications(res.data)
      setUnreadCount(res.data.filter((n) => !n.read).length)
    } catch (err) {
      console.error("Erreur fetch notifications:", err)
    }
  }

  // 2️⃣ Marquer une notif comme lue
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
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch (err) {
      console.error("Erreur mark-as-read:", err)
    }
  }

  // 3️⃣ Marquer toutes comme lues
  const markAllAsRead = async () => {
    if (!token) return
    try {
      await axios.post(
        `${API}/api/v1/notifications/read-all`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error("Erreur read-all:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [token])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="font-medium">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:underline"
            >
              Tout marquer lu
            </button>
          )}
        </div>
        {notifications.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            Aucune notification
          </div>
        )}
        {notifications.map((n) => (
          <DropdownMenuItem
            key={n.id}
            className="flex flex-col gap-1 px-4 py-2 hover:bg-gray-50"
            onClick={() => markAsRead(n.id)}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  !n.read ? "font-semibold" : "font-normal"
                }`}
              >
                {n.title}
              </span>
              {!n.read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
            <span className="text-xs text-gray-500">
              {n.excerpt || ""}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
