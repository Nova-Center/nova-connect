"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Search, Users, Crown, Star, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    if (!user?.accessToken) return

    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/all`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      const data = await res.json()
      // Exclure l'utilisateur connecté de la liste
      const filteredData = data.data.filter((u: User) => u.id !== user.id)
      setUsers(filteredData)
    } catch (error) {
      console.error("Erreur chargement utilisateurs :", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [user?.accessToken, user?.id])

  const filteredUsers = users.filter((u) => u.username.toLowerCase().includes(searchTerm.toLowerCase()) && !u.is_banned)

  // Fonction pour déterminer le niveau de l'utilisateur
  const getUserLevel = (points: number) => {
    if (points >= 2000)
      return {
        level: "Expert",
        color: "from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400",
        icon: Crown,
      }
    if (points >= 1000)
      return {
        level: "Avancé",
        color: "from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400",
        icon: Star,
      }
    if (points >= 500)
      return {
        level: "Intermédiaire",
        color: "from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400",
        icon: Users,
      }
    return {
      level: "Débutant",
      color: "from-gray-500 to-slate-500 dark:from-gray-400 dark:to-slate-400",
      icon: Users,
    }
  }

  // Trier les utilisateurs par points (ordre décroissant)
  const sortedUsers = [...filteredUsers].sort((a, b) => b.nova_points - a.nova_points)

  return (
    <aside className="hidden lg:block lg:w-80 xl:w-96 bg-gradient-to-b from-background via-background/95 to-muted/20 dark:from-background dark:via-background/95 dark:to-muted/10 border-l border-border shadow-xl fixed right-0 top-0 h-screen z-10 backdrop-blur-sm">
      <div className="flex h-screen flex-col">
        {/* Header moderne avec logo */}
        <div className="p-6 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl shadow-lg ring-2 ring-background bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-background animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Nova Connect
                </h2>
                <p className="text-sm text-muted-foreground">Communauté active</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchUsers}
              disabled={isLoading}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {/* Barre de recherche moderne */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un membre..."
              className="pl-11 pr-4 py-3 bg-muted/50 border-border rounded-2xl focus:bg-background focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Statistiques rapides */}
        <Card className="mx-6 my-4 p-4 bg-gradient-to-r from-violet-50/80 to-pink-50/80 dark:from-violet-950/30 dark:to-pink-950/30 border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <p className="font-bold text-violet-600 dark:text-violet-400 text-lg">{users.length}</p>
              <p className="text-muted-foreground text-xs">Membres</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-pink-600 dark:text-pink-400 text-lg">{filteredUsers.length}</p>
              <p className="text-muted-foreground text-xs">Actifs</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                {Math.round(users.reduce((sum, u) => sum + u.nova_points, 0) / 1000)}k
              </p>
              <p className="text-muted-foreground text-xs">Points total</p>
            </div>
          </div>
        </Card>

        {/* Liste des utilisateurs */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                <span className="ml-3 text-muted-foreground">Chargement...</span>
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium mb-1">Aucun membre trouvé</p>
                <p className="text-muted-foreground/70 text-sm">
                  {searchTerm ? `Aucun résultat pour "${searchTerm}"` : "La communauté semble vide"}
                </p>
              </div>
            ) : (
              sortedUsers.map((user, index) => {
                const userLevel = getUserLevel(user.nova_points)
                const IconComponent = userLevel.icon

                return (
                  <Card
                    key={user.id}
                    className="group relative flex items-center justify-between gap-3 p-4 bg-card/60 hover:bg-card hover:shadow-lg transition-all duration-300 border-border hover:border-violet-200 dark:hover:border-violet-800 hover:scale-[1.02]"
                  >
                    {/* Indicateur de rang pour le top 3 */}
                    {index < 3 && (
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {index + 1}
                      </div>
                    )}

                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
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
                        <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full shadow-sm border border-border">
                          <IconComponent className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground text-sm truncate">{user.username}</span>
                          {user.nova_points >= 1000 && (
                            <Badge
                              className={`bg-gradient-to-r ${userLevel.color} text-white text-xs px-2 py-0.5 border-0 shadow-sm`}
                            >
                              {userLevel.level}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {user.nova_points.toLocaleString()} pts
                          </span>
                          {/* Barre de progression des points */}
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
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
                        className="h-10 w-10 p-0 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 group-hover:scale-110"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </Link>
                  </Card>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}
