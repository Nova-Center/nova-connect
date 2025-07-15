"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Search, Users, Crown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface User {
  id: number
  username: string
  email: string
  avatar?: string | null
  nova_points: number
  is_banned: boolean
}

export default function ModernRightSidebar() {
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
        setUsers(data.data)
      } catch (error) {
        console.error("Erreur chargement utilisateurs :", error)
      }
    }

    fetchUsers()
  }, [user?.accessToken])

  const filteredUsers = users.filter((u) => u.username.toLowerCase().includes(searchTerm.toLowerCase()))

  // Fonction pour déterminer le niveau de l'utilisateur
  const getUserLevel = (points: number) => {
    if (points >= 2000) return { level: "Expert", color: "from-purple-500 to-pink-500", icon: Crown }
    if (points >= 1000) return { level: "Avancé", color: "from-blue-500 to-cyan-500", icon: Star }
    if (points >= 500) return { level: "Intermédiaire", color: "from-green-500 to-emerald-500", icon: Users }
    return { level: "Débutant", color: "from-gray-500 to-slate-500", icon: Users }
  }

  // Trier les utilisateurs par points (ordre décroissant)
  const sortedUsers = [...filteredUsers].sort((a, b) => b.nova_points - a.nova_points)

  return (
    <aside className="hidden lg:block lg:w-80 xl:w-96 bg-gradient-to-b from-white via-slate-50 to-blue-50 border-l border-gray-200/60 shadow-xl fixed right-0 top-0 h-screen z-10">
      <div className="flex h-screen flex-col">
        {/* Header moderne avec logo */}
        <div className="p-6 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <Image
                src="/images/nova-connect-logo.png"
                alt="Logo Nova Connect"
                width={48}
                height={48}
                className="h-12 w-12 rounded-2xl shadow-lg ring-2 ring-white"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Nova Connect
              </h2>
              <p className="text-sm text-gray-500">Communauté active</p>
            </div>
          </div>

          {/* Barre de recherche moderne */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un membre..."
              className="pl-11 pr-4 py-3 bg-gray-50/80 border-gray-200/60 rounded-2xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all duration-300 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-pink-50 border-b border-gray-200/60">
          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <p className="font-bold text-violet-600">{users.length}</p>
              <p className="text-gray-600 text-xs">Membres</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-pink-600">{filteredUsers.length}</p>
              <p className="text-gray-600 text-xs">En ligne</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-blue-600">{users.reduce((sum, u) => sum + u.nova_points, 0)}</p>
              <p className="text-gray-600 text-xs">Points total</p>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            {sortedUsers.map((user, index) => {
              const userLevel = getUserLevel(user.nova_points)
              const IconComponent = userLevel.icon

              return (
                <div
                  key={user.id}
                  className="group relative flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/60 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100/60 hover:border-gray-200/80"
                >
                  {/* Indicateur de rang pour le top 3 */}
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {index + 1}
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        ) : (
                          <AvatarFallback
                            className={`bg-gradient-to-br ${userLevel.color} text-white font-semibold text-sm`}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {/* Indicateur de niveau */}
                      <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                        <IconComponent className="h-3 w-3 text-gray-600" />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm truncate">{user.username}</span>
                        {user.nova_points >= 1000 && (
                          <Badge
                            className={`bg-gradient-to-r ${userLevel.color} text-white text-xs px-2 py-0.5 border-0`}
                          >
                            {userLevel.level}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-600">
                          {user.nova_points.toLocaleString()} pts
                        </span>

                        {/* Barre de progression des points */}
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${userLevel.color} transition-all duration-500`}
                            style={{
                              width: `${Math.min((user.nova_points / 2000) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton message avec animation */}
                  <Link href={`/chat/${user.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-xl hover:bg-violet-50 hover:text-violet-600 transition-all duration-300 group-hover:scale-110"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )
            })}

            {/* Message si aucun utilisateur trouvé */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-1">Aucun membre trouvé</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm ? `Aucun résultat pour "${searchTerm}"` : "La communauté semble vide"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}
