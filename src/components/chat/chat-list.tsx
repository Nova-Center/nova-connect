"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface Conv {
  otherUserId: string
  name: string
  avatar?: string
  lastMessage: string
  unreadCount: number
}

export default function ChatList() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const API = process.env.NEXT_PUBLIC_API_URL

  const [conversations, setConversations] = useState<Conv[]>([])

  useEffect(() => {
    if (!token) return
    axios
      .get<Conv[]>(
        `${API}/api/v1/messages/last-messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => setConversations(res.data))
      .catch(err => {
        console.error("Erreur chargement conversations :", err)
        setConversations([])
      })
  }, [token, API])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vos conversations</h1>
      <ul className="space-y-3">
        {conversations.map(conv => (
          <li
            key={conv.otherUserId}
            className="flex items-center justify-between p-3 border rounded-lg bg-white"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{conv.name}</div>
                <div className="text-sm text-gray-500 truncate w-48">
                  {conv.lastMessage}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {conv.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {conv.unreadCount}
                </span>
              )}
              <Link href={`/chat/${conv.otherUserId}`}>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
