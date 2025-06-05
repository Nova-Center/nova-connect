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
import { MapPin, Users, CalendarDays, Plus, Trash2, Upload, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Type définition pour les événements
interface EventParticipant {
  id: string
  name: string
}

interface EventItem {
  id: string
  title: string
  description: string
  location: string
  date: string
  max_participants: number
  participants: EventParticipant[]
  image?: string
  created_at: string
  updated_at: string
  creator_id?: string
  created_by?: string
}

export default function EventList() {
  const { data: session } = useSession()
  const user = session?.user
  const [events, setEvents] = useState<EventItem[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    max_participants: "",
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
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
      // Remplacez cette URL par votre endpoint d'upload d'images
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`, formData, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.url || ""
    } catch (error) {
      console.error("Erreur upload image:", error)
      // En cas d'erreur, on utilise l'image en base64
      return imagePreview
    }
  }

  const createEvent = async () => {
    if (!user?.accessToken) return

    if (!newEvent.title || !newEvent.description || !newEvent.location || !newEvent.date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      let imageUrl = newEvent.image

      // Upload de l'image si une image a été sélectionnée
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      const eventData = {
        ...newEvent,
        max_participants: Number.parseInt(newEvent.max_participants) || 10,
        image: imageUrl || "/placeholder.svg?height=200&width=300",
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`, eventData, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      toast({
        title: "Succès",
        description: "Événement créé avec succès !",
      })

      // Reset du formulaire
      setNewEvent({
        title: "",
        description: "",
        location: "",
        date: "",
        max_participants: "",
        image: "",
      })
      setImageFile(null)
      setImagePreview("")
      setIsCreateDialogOpen(false)
      fetchEvents()
    } catch (error) {
      console.error("Erreur création événement :", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer l'événement",
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
    <div className="w-full">
      {/* Container principal avec padding approprié */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header avec bouton de création */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Événements à venir</h1>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white border-0 shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Créer un événement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un nouvel événement</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Ex: Webinaire Cloud"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Solutions cloud modernes"
                    rows={3}
                  />
                </div>

                {/* Upload d'image */}
                <div className="grid gap-2">
                  <Label>Image de l'événement</Label>

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Aperçu"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Glissez une image ici ou cliquez pour sélectionner</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Choisir une image
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                    </div>
                  )}

                  {/* URL alternative */}
                  <div className="text-center text-sm text-gray-500">ou</div>
                  <Input
                    placeholder="URL de l'image (https://...)"
                    value={newEvent.image}
                    onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Lieu *</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="En ligne"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="max_participants">Nombre maximum de participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={newEvent.max_participants}
                    onChange={(e) => setNewEvent({ ...newEvent, max_participants: e.target.value })}
                    placeholder="10"
                    min="1"
                    max="1000"
                  />
                </div>

                <Button onClick={createEvent} className="w-full">
                  Créer l'événement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des événements */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card className="text-center py-12 border-dashed border-2">
            <CardContent>
              <p className="text-gray-500 mb-4">Aucun événement pour le moment</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier événement
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow border-0 shadow-sm bg-white">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                  <img
                    src={event.image || "/placeholder.svg?height=128&width=192"}
                    alt={event.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h2>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>

                      {/* Menu d'actions pour le créateur */}
                      {isEventCreator(event) && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
                                deleteEvent(event.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.participants?.length || 0} / {event.max_participants} participants
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        Ajouté le {new Date(event.created_at).toLocaleDateString("fr-FR")}
                      </Badge>
                      {!isEventCreator(event) && (
                        <Button size="sm" variant="outline" className="text-sm">
                          Participer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
