"use client"

import { useState, useCallback } from "react"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
  isRead: boolean
  isOwn: boolean
}

interface UseChatApiReturn {
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  markAsRead: () => Promise<void>
  getUnreadCount: () => Promise<number>
  isLoading: boolean
  error: string | null
}

export function useChatApi(): UseChatApiReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Remplacez par votre endpoint réel
      const response = await fetch("/api/v1/messages/messages/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Ajoutez vos headers d'authentification ici
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const newMessage = await response.json()
      setMessages((prev) => [...prev, newMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
      console.error("Erreur lors de l'envoi du message:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/messages/messages/mark-as-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Ajoutez vos headers d'authentification ici
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
      console.error("Erreur lors du marquage comme lu:", err)
    }
  }, [])

  const getUnreadCount = useCallback(async (): Promise<number> => {
    try {
      const response = await fetch("/api/v1/messages/messages/unread-count", {
        headers: {
          // Ajoutez vos headers d'authentification ici
        },
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.count || 0
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
      console.error("Erreur lors de la récupération du nombre de messages non lus:", err)
      return 0
    }
  }, [])

  return {
    messages,
    sendMessage,
    markAsRead,
    getUnreadCount,
    isLoading,
    error,
  }
}
