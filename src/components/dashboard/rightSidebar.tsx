"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number
  username: string
  email: string
  avatar?: string | null
  nova_points: number
  is_banned: boolean
}

export default function RightSidebar() {
  const { data: session } = useSession()
  const user = session?.user

  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.accessToken) return
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/all`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })

        const data = await res.json()
        //console.log("sideBar DATA =>"+ JSON.stringify(data))
        setUsers(data.data)
      } catch (error) {
        console.error("Erreur chargement utilisateurs :", error)
      }
    }

    fetchUsers()
  }, [user?.accessToken])

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <aside className="hidden lg:block lg:w-80 xl:w-96 border-l border-border bg-muted/40">
      <div className="flex h-full max-h-screen flex-col gap-2 p-4">
        {/* Champ de recherche */}
        <div className="relative">
          <Input
            placeholder="Rechercher..."
            className="pl-9 bg-muted/50 border-none text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Liste des utilisateurs */}
        <ScrollArea className="flex-1">
          <div className="space-y-3 mt-2">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-4 p-2 rounded-lg bg-background hover:bg-muted transition">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} />
                    ) : (
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.username}</span>
                    <span className="text-xs text-muted-foreground">{user.nova_points} pts</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <p className="text-center text-muted-foreground text-sm mt-4">Aucun utilisateur trouvé</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}
