// event-list.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Users, CalendarDays, Plus, Trash2, Search, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { EventItem } from "@/types/event"
import Link from "next/link"
import CreateEvent from "./createEvent" // Notre nouveau composant

export default function ModernEventList() {
  const { data: session } = useSession()
  const user = session?.user
  const [events, setEvents] = useState<EventItem[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchEvents = async () => {
    if (!user?.accessToken) return
    setIsLoading(true)
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )
      const data = res.data?.data || []
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [user?.accessToken])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(
        events.filter((e) =>
          e.title.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
  }

  const deleteEvent = async (id: string) => {
    if (!user?.accessToken) return
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${id}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )
      toast({ title: "Succès", description: "Événement supprimé." })
      fetchEvents()
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      })
    }
  }

  const isEventCreator = (e: EventItem) =>
    e.creator_id === user?.id || e.created_by === user?.id

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r
                          from-violet-100 to-pink-100 rounded-full text-violet-700">
            <Sparkles className="h-4 w-4" />
            Découvrez nos événements
          </div>
          <h1 className="text-4xl font-bold">Événements à venir</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Rejoignez notre communauté...
          </p>
        </div>

        {/* Recherche */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-2xl shadow-lg"
            />
          </div>
          {searchQuery && (
            <p className="text-center text-gray-500 mt-3">
              {filteredEvents.length} événement
              {filteredEvents.length > 1 ? "s" : ""} pour "{searchQuery}"
            </p>
          )}
        </div>

        {/* Bouton de création */}
        <div className="flex justify-center">
          <CreateEvent onEventCreated={fetchEvents} />
        </div>

        {/* Liste */}
        {isLoading ? (
          <p>Chargement…</p>
        ) : filteredEvents.length === 0 ? (
          <Card className="text-center py-16 shadow-lg rounded-3xl">
            <CardContent>
              <CalendarDays className="h-10 w-10 text-violet-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery
                  ? "Aucun événement trouvé"
                  : "Aucun événement pour le moment"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `Aucun résultat pour "${searchQuery}"`
                  : "Soyez le premier à créer un événement"}
              </p>
              {!searchQuery && (
                <CreateEvent onEventCreated={fetchEvents}>
                  <Button
                    variant="outline"
                    className="border-violet-200 text-violet-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier événement
                  </Button>
                </CreateEvent>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="block group"
              >
                <Card className="shadow-lg rounded-3xl overflow-hidden">
                  <CardContent className="flex flex-col lg:flex-row gap-6">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full lg:w-64 h-40 object-cover rounded-2xl"
                    />
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-xl font-bold">
                            {event.title}
                          </h2>
                          <p className="text-gray-600">
                            {event.description}
                          </p>
                        </div>
                        {isEventCreator(event) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              if (
                                confirm(
                                  "Voulez-vous vraiment supprimer ?"
                                )
                              ) {
                                deleteEvent(event.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-violet-600" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          <span>
                            {new Date(event.date).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span>
                            {event.participants?.length || 0} /{" "}
                            {event.max_participants}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <Badge className="rounded-full px-3 py-1 text-xs">
                          Ajouté le{" "}
                          {new Date(event.created_at).toLocaleDateString(
                            "fr-FR"
                          )}
                        </Badge>
                        {!isEventCreator(event) && (
                          <Button size="sm">
                            Participer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
