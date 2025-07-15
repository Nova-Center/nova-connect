"use client"

import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, Users } from "lucide-react"

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

export default function ChatInterface() {
  const { data: session } = useSession()
  const user = session?.user
  const token = user?.accessToken
  const API = process.env.NEXT_PUBLIC_API_URL

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const endRef = useRef<HTMLDivElement>(null)

  // 1️⃣ Charger conversation + compteur non lus
  useEffect(() => {
    if (!token) return

    const loadChat = async () => {
      try {
        const [convRes, countRes] = await Promise.all([
          axios.get<Message[]>(
            `${API}/api/v1/messages/messages/conversation`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get<{ count: number }>(
            `${API}/api/v1/messages/messages/unread-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ])
        setMessages(convRes.data)
        setUnreadCount(countRes.data.count)
      } catch (err) {
        console.error("Erreur chargement chat:", err)
      }
    }

    loadChat()
  }, [API, token])

  // 📥 scroll auto en bas
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 2️⃣ Envoyer un message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading || !token) return

    setIsLoading(true)
    try {
      const res = await axios.post<Message>(
        `${API}/api/v1/messages/messages/conversation`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const sent = { ...res.data, isOwn: true }
      setMessages((m) => [...m, sent])
      setNewMessage("")
    } catch (err) {
      console.error("Erreur envoi message:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // 3️⃣ Marquer tout comme lu
  const markAllAsRead = async () => {
    if (!token) return
    try {
      await axios.post(
        `${API}/api/v1/messages/messages/mark-as-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages((m) => m.map((x) => ({ ...x, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error("Erreur mark-as-read:", err)
    }
  }

  const fmtTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5" />
            <CardTitle className="text-lg">Chat Nova Connect</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white cursor-pointer"
                onClick={markAllAsRead}
              >
                {unreadCount} non lu{unreadCount > 1 && "s"}
              </Badge>
            )}
            <Users className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.isOwn ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={m.sender.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-400 text-white text-xs">
                  {m.sender.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col max-w-[70%] ${
                  m.isOwn ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 font-medium">
                    {m.isOwn ? "Vous" : m.sender.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {fmtTime(m.timestamp)}
                  </span>
                  {!m.isOwn && !m.isRead && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    m.isOwn
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{m.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-300 animate-pulse" />
              </Avatar>
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              disabled={isLoading}
              className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
