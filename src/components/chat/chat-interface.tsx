"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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

interface ChatInterfaceProps {
  className?: string
}

export default function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simuler des messages pour la démo
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        content: "Salut ! Comment ça va ?",
        sender: { id: "2", name: "Barry Keoghan", avatar: "/placeholder.svg?height=32&width=32" },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
        isOwn: false,
      },
      {
        id: "2",
        content: "Ça va bien merci ! Et toi ?",
        sender: { id: "1", name: "Vous", avatar: "/placeholder.svg?height=32&width=32" },
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        isRead: true,
        isOwn: true,
      },
      {
        id: "3",
        content: "Super ! Tu as vu le nouveau projet de jardinage ?",
        sender: { id: "2", name: "Barry Keoghan", avatar: "/placeholder.svg?height=32&width=32" },
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isRead: false,
        isOwn: false,
      },
    ]
    setMessages(mockMessages)
    setUnreadCount(mockMessages.filter((m) => !m.isRead && !m.isOwn).length)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)

    // Ajouter le message localement
    const tempMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: { id: "1", name: "Vous", avatar: "/placeholder.svg?height=32&width=32" },
      timestamp: new Date().toISOString(),
      isRead: true,
      isOwn: true,
    }

    setMessages((prev) => [...prev, tempMessage])
    setNewMessage("")

    try {
      // Ici vous intégrerez votre API
      // const response = await fetch('/api/v1/messages/messages/conversation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newMessage })
      // })

      // Simuler une réponse après 1 seconde
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Message reçu ! 👍",
          sender: { id: "2", name: "Barry Keoghan", avatar: "/placeholder.svg?height=32&width=32" },
          timestamp: new Date().toISOString(),
          isRead: false,
          isOwn: false,
        }
        setMessages((prev) => [...prev, responseMessage])
        setUnreadCount((prev) => prev + 1)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      setIsLoading(false)
    }
  }

  const markAsRead = async () => {
    try {
      // Ici vous intégrerez votre API
      // await fetch('/api/v1/messages/messages/mark-as-read', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({})
      // })

      setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
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
                className="bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                onClick={markAsRead}
              >
                {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
              </Badge>
            )}
            <Users className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-400 text-white text-xs">
                  {message.sender.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className={`flex flex-col max-w-[70%] ${message.isOwn ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 font-medium">
                    {message.isOwn ? "Vous" : message.sender.name}
                  </span>
                  <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                  {!message.isRead && !message.isOwn && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                </div>

                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isOwn
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-300">
                  <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
