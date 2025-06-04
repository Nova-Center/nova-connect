import { useEffect, useState } from "react"

export interface Notification {
  id: string
  type: "like" | "comment" | "friend" | "event" | "system"
  title: string
  message: string
  time: string
  read: boolean
  avatar?: string
  userName?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:3333/api/notifications")
      const data = await res.json()
      setNotifications(data)
    } catch (err) {
      console.error("Erreur fetch:", err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    await fetch(`http://localhost:3333/api/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    })
    fetchNotifications()
  }

  const deleteNotification = async (id: string) => {
    await fetch(`http://localhost:3333/api/notifications/${id}`, {
      method: "DELETE",
    })
    fetchNotifications()
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return {
    notifications,
    loading,
    markAsRead,
    deleteNotification,
  }
}
