// components/chat/chat-list.tsx
"use client"

import React, { useEffect, useState } from "react"
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

  const [convs, setConvs] = useState<Conv[]>([])

  useEffect(() => {
    if (!token) return
    axios
      .get<Conv[]>(`${API}/api/v1/messages/last-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setConvs(r.data))
      .catch(() => setConvs([]))
  }, [token, API])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vos conversations</h1>
      <ul className="space-y-3">
        {convs.map(c => (
          <li key={c.otherUserId} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={c.avatar || "/placeholder.svg"} />
                <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500 truncate w-48">{c.lastMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {c.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {c.unreadCount}
                </span>
              )}
              <Link href={`/chat/${c.otherUserId}`}>
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
