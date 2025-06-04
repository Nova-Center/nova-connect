// RightSidebar.tsx
"use client"

import Image from "next/image"
import { Search, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number
  username: string
  avatar?: string | null
  isOnline: boolean
  points: number
}

export function RightSidebar() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // Mocked user data until API is ready
    setUsers([
      { id: 1, username: "Alex", avatar: null, isOnline: true, points: 350 },
      { id: 2, username: "Claire", avatar: null, isOnline: false, points: 125 },
      { id: 3, username: "Moussa", avatar: null, isOnline: true, points: 490 },
    ])
  }, [])

  return (
   <aside className="fixed right-0 top-0 h-screen w-80 bg-background border-l border-muted px-5 py-6 overflow-y-auto space-y-6">
      {/* Logo + titre */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/nova-connect-logo.png"
          alt="Logo Nova Connect"
          width={60}
          height={60}
          className="h-10 w-10 rounded-xl"
        />
        <span className="font-semibold text-xl">Nova Connect</span>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-9 bg-muted/50 border-none text-foreground"
        />
      </div>

      {/* Liste des utilisateurs */}
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar || `/placeholder-post.svg?text=${user.username[0]}`} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white ${
                    user.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.username}</span>
                <span className="text-xs text-muted-foreground">{user.points} pts</span>
              </div>
            </div>
            <button className="hover:text-foreground text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  )
}
