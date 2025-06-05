"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { EventItem, EventParticipant } from "@/types/event"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { CalendarDays, MapPin, Users } from "lucide-react"

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribed, setSubscribed] = useState(false)

  const fetchEvent = async () => {
    if (!user?.accessToken) return
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      const data = res.data
      setEvent(data)
      setSubscribed(data.participants.some((p: EventParticipant) => String(p.id) === String(user.id)))
    } catch (error) {
      console.error("Erreur chargement de l’événement :", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${id}/subscribe`, {}, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      })
      toast({ title: "Inscription réussie 🎉" })
      fetchEvent()
    } catch (err) {
      toast({ title: "Erreur d'inscription", variant: "destructive" })
    }
  }

  const handleUnsubscribe = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${id}/unsubscribe`, {}, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      })
      toast({ title: "Désinscription réussie" })
      fetchEvent()
    } catch (err) {
      toast({ title: "Erreur de désinscription", variant: "destructive" })
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [user?.accessToken])

  if (loading || !event) {
    return <p className="p-6 text-muted-foreground">Chargement...</p>
  }

  return (
    <div className="container max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>

      <img
        src={event.image}
        alt={event.title}
        className="rounded-md object-cover w-full h-64"
      />

      <p className="text-sm text-muted-foreground">{event.description}</p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        {event.location}
        <CalendarDays className="w-4 h-4 ml-4" />
        {new Date(event.date).toLocaleDateString("fr-FR")}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <Users className="inline-block w-4 h-4 mr-1" />
          {event.participants.length} / {event.max_participants} participants
        </div>

        {subscribed ? (
          <Button variant="destructive" onClick={handleUnsubscribe}>
            Se désinscrire
          </Button>
        ) : (
          <Button onClick={handleSubscribe}>
            S'inscrire à l'événement
          </Button>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-md font-semibold mb-2">Participants :</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {event.participants.map((participant) => (
            <Card key={participant.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <Avatar className="h-10 w-10">
                  {participant.avatar ? (
                    <AvatarImage src={participant.avatar} />
                  ) : (
                    <AvatarFallback>
                      {participant.name ? participant.name[0] : "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{participant.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
