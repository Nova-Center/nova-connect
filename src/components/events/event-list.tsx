"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Users, CalendarDays, Plus, Trash2, Upload, X, Search, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { EventItem } from "@/types/event"
import Link from "next/link"

export default function ModernEventList() {
  const { data: session } = useSession()
  const user = session?.user
  const [events, setEvents] = useState<EventItem[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    max_participants: 0,
    image: "",
  })

  const fetchEvents = async () => {
    if (!user?.accessToken) return
    setIsLoading(true)
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      const data = res.data?.data || []
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      console.error("Erreur chargement événements :", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter((event) => event.title.toLowerCase().includes(query.toLowerCase()))
      setFilteredEvents(filtered)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return ""

    const formData = new FormData()
    formData.append("image", imageFile)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`, formData, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.url || ""
    } catch (error) {
      console.error("Erreur upload image:", error)
      return imagePreview
    }
  }

  const createEvent = async () => {
    if (!user?.accessToken) return

    try {
      const formData = new FormData()

      formData.append("title", newEvent.title)
      formData.append("description", newEvent.description)
      formData.append("location", newEvent.location)
      formData.append("date", newEvent.date)
      formData.append("maxParticipants", String(newEvent.max_participants))

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`, formData, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

      toast({
        title: "✨ Événement créé",
        description: `L'événement "${response.data.title}" a été ajouté avec succès.`,
      })

      setNewEvent({
        title: "",
        description: "",
        location: "",
        date: "",
        max_participants: 0,
        image: "",
      })
      setImagePreview("")
      setImageFile(null)
      setIsCreateDialogOpen(false)
      fetchEvents()
    } catch (error: any) {
      console.error("❌ Erreur lors de la création :", error)
      const msg = error?.response?.data?.errors?.[0]?.message || "Erreur inconnue"
      toast({
        title: "Erreur",
        description: msg,
        variant: "destructive",
      })
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!user?.accessToken) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      toast({
        title: "Succès",
        description: "Événement supprimé avec succès !",
      })

      fetchEvents()
    } catch (error) {
      console.error("Erreur suppression événement :", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      })
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setNewEvent({ ...newEvent, image: "" })
  }

  const isEventCreator = (event: EventItem) => {
    return event.creator_id === user?.id || event.created_by === user?.id
  }

  useEffect(() => {
    fetchEvents()
  }, [user?.accessToken])

  return (
    <div className="min-h-screen  from-slate-50 via-white to-blue-50">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header moderne avec gradient */}
        <div className="text-center space-y-4 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-pink-100 rounded-full text-sm font-medium text-violet-700 mb-4">
            <Sparkles className="h-4 w-4" />
            Découvrez nos événements
          </div>
          <h1 className="text-4xl font-bold">
            Événements à venir
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Rejoignez notre communauté et participez aux événements qui vous passionnent
          </p>
        </div>

        {/* Barre de recherche moderne */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher un événement par titre..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:shadow-xl transition-all duration-300"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""} trouvé
              {filteredEvents.length > 1 ? "s" : ""} pour "{searchQuery}"
            </p>
          )}
        </div>

        {/* Bouton de création flottant */}
        <div className="flex justify-center">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-6 text-lg rounded-2xl">
                <Plus className="h-5 w-5 mr-3" />
                Créer un événement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-3xl border-0 shadow-2xl">
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                  Créer un nouvel événement
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                    Titre *
                  </Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Ex: Webinaire Cloud Computing"
                    className="border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl py-3"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Décrivez votre événement en détail..."
                    rows={4}
                    className="border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-sm font-semibold text-gray-700">Image de l'événement</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Aperçu"
                        className="w-full h-40 object-cover rounded-xl border shadow-sm"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-3 right-3 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                      <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-3">Glissez une image ici ou cliquez pour sélectionner</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Choisir une image
                      </Label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
                    </div>
                  )}
                  <div className="text-center text-sm text-gray-400">ou</div>
                  <Input
                    placeholder="URL de l'image (https://...)"
                    value={newEvent.image}
                    onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                    className="border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                      Lieu *
                    </Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="En ligne, Paris..."
                      className="border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
                      Date *
                    </Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="max_participants" className="text-sm font-semibold text-gray-700">
                    Nombre maximum de participants
                  </Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={newEvent.max_participants}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        max_participants: Number(e.target.value),
                      })
                    }
                    placeholder="50"
                    min="1"
                    max="1000"
                    className="border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                  />
                </div>

                <Button
                  onClick={createEvent}
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Créer l'événement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des événements */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-6 flex gap-6">
                  <div className="w-64 h-40 rounded-2xl"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6  rounded-lg w-2/3"></div>
                    <div className="h-4  rounded w-full"></div>
                    <div className="h-4 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="text-center py-16 border-0 shadow-lg rounded-3xl bg-gradient-to-br from-white to-gray-50">
            <CardContent>
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full flex items-center justify-center">
                <CalendarDays className="h-10 w-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "Aucun événement trouvé" : "Aucun événement pour le moment"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `Aucun événement ne correspond à "${searchQuery}"`
                  : "Soyez le premier à créer un événement pour votre communauté"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  variant="outline"
                  className="border-violet-200 text-violet-600 hover:bg-violet-50 rounded-xl px-6 py-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le premier événement
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`} className="block group">
                <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden group-hover:scale-[1.02] group-hover:bg-white">
                  <CardContent className="p-6 flex flex-col lg:flex-row gap-6">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={event.image || "/placeholder.svg?height=160&width=256"}
                        alt={event.title}
                        className="w-full lg:w-64 h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                            {event.title}
                          </h2>
                          <p className="text-gray-600 leading-relaxed">{event.description}</p>
                        </div>

                        {isEventCreator(event) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 hover:bg-red-50 rounded-full"
                            onClick={(e) => {
                              e.preventDefault()
                              if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
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
                          <div className="p-1 bg-violet-100 rounded-lg">
                            <MapPin className="h-4 w-4 text-violet-600" />
                          </div>
                          <span className="font-medium">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-blue-100 rounded-lg">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{new Date(event.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-green-100 rounded-lg">
                            <Users className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium">
                            {event.participants?.length || 0} / {event.max_participants}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                          Ajouté le {new Date(event.created_at).toLocaleDateString("fr-FR")}
                        </Badge>
                        {!isEventCreator(event) && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
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
