"use client"

import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle, Users } from "lucide-react"

export default function ChatInterface() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const token = session?.user?.accessToken
  const API = process.env.NEXT_PUBLIC_API_URL!
  const WS  = process.env.NEXT_PUBLIC_WS_URL!
  const { otherUserId } = useParams()

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const endRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)

  // Charger l’historique, fallback à [] si 404
  useEffect(() => {
    if (!token || !otherUserId) return
    axios
      .get<Message[]>(`${API}/api/v1/messages/conversation/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setMessages([])
        } else {
          console.error("Erreur GET conversation :", err)
        }
      })
  }, [API, token, otherUserId])

  // Récupérer le compteur non-lus
  useEffect(() => {
    if (!token) return
    axios
      .get<{ count: number }>(`${API}/api/v1/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setUnreadCount(r.data.count))
      .catch((err) => console.error("Erreur unread-count :", err))
  }, [API, token])

  // WebSocket pour la suite en real-time
  useEffect(() => {
    if (!userId) return
    const socket = io(WS, { auth: { userId: String(userId) } })
    socketRef.current = socket

    socket.on("private:message", (msg: Message) => {
      // si sender manquant, on skip
      if (msg.sender?.id !== otherUserId) return
      setMessages((m) => [...m, { ...msg, isOwn: false }])
      setUnreadCount((c) => c + 1)
    })

    socket.on("private:message:sent", (msg: Message) => {
      setMessages((m) => [...m, { ...msg, isOwn: true }])
    })

    socket.on("private:message:read", ({ readerId }: { readerId: string }) => {
      if (readerId !== otherUserId) return
      setMessages((m) => m.map((x) => ({ ...x, isRead: true })))
      setUnreadCount(0)
    })

    return () => {
      socket.disconnect()
    }
  }, [WS, userId, otherUserId])

  // scroll auto en bas
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Envoi de message via WS
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading || !socketRef.current || !otherUserId) return
    setIsLoading(true)
    socketRef.current.emit(
      "private:message",
      { receiverId: otherUserId, content: newMessage },
      () => {
        setIsLoading(false)
        setNewMessage("")
      }
    )
  }

  // Marquer comme lu
  const markAllAsRead = () => {
    if (!socketRef.current || !otherUserId) return
    socketRef.current.emit("private:message:read", { senderId: otherUserId })
  }

  const fmtTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <Card className="w-full h-full flex flex-col">
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
                className="bg-white/20 cursor-pointer"
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
        {/* liste des messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((m) => {
            const name = m.sender?.name ?? "Utilisateur"
            const avatar = m.sender?.avatar ?? "/placeholder.svg"
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.isOwn ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-400 text-white text-xs">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col max-w-[70%] ${
                    m.isOwn ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-medium">
                      {m.isOwn ? "Vous" : name}
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
                    {m.content}
                  </div>
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-300 animate-pulse" />
              </Avatar>
              <div className="bg-white border px-4 py-2 rounded-2xl">
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

        {/* zone de saisie */}
        <form
          onSubmit={handleSend}
          className="border-t bg-white p-4 flex items-center gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message…"
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
