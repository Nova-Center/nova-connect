"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface Participant {
  id: number
}

interface Service {
  id: number
  title: string
  description: string
  date: string
  owner_id: number
  participants: Participant[]
}

export default function ServiceList() {
  const { data: session } = useSession()
  const user = session?.user

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)

  const fetchServices = async () => {
    if (!user?.accessToken) return
    setLoading(true)
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      setServices(res.data.data || [])
    } catch (err) {
      toast({ title: "Erreur chargement des services", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleVolunteer = async (serviceId: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}/volunteer`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      toast({ title: "Inscription au service réussie 🎉" })
      fetchServices()
    } catch (err: any) {
      console.error("Erreur inscription service:", err.response?.data || err.message)
      toast({
        title: "Erreur lors de l'inscription",
        description: err.response?.data?.message || "Vérifiez vos droits ou l'état du service",
        variant: "destructive",
      })
    }
  }

  const handleUnvolunteer = async (serviceId: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}/unvolunteer`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      toast({ title: "Désinscription réussie" })
      fetchServices()
    } catch (err) {
      console.error("Erreur désinscription:", err)
      toast({ title: "Erreur de désinscription", variant: "destructive" })
    }
  }

  const handleDelete = async (serviceId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      )
      toast({ title: "Service supprimé avec succès ✅" })
      fetchServices()
    } catch (err) {
      console.error("Erreur suppression service:", err)
      toast({ title: "Erreur suppression", variant: "destructive" })
    }
  }

  useEffect(() => {
    fetchServices()
  }, [user?.accessToken])

  if (!user?.accessToken) return <p className="p-4 text-sm">Veuillez vous connecter</p>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Services</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : services.length === 0 ? (
        <p className="text-muted-foreground">Aucun service pour le moment.</p>
      ) : (
        services.map((service) => {
          const isOwner = service.owner_id === user.id
          const isParticipant = Array.isArray(service.participants) && service.participants.some((p) => p.id === user.id)


          return (
            <Card key={service.id}>
              <CardContent className="p-4 space-y-2">
                <h2 className="font-semibold text-lg">{service.title}</h2>
                <p className="text-muted-foreground text-sm">{service.description}</p>
                <p className="text-sm">Date : {new Date(service.date).toLocaleDateString("fr-FR")}</p>

                {isOwner ? (
                  <Button variant="destructive" onClick={() => handleDelete(service.id)}>
                    Supprimer
                  </Button>
                ) : isParticipant ? (
                  <Button variant="destructive" onClick={() => handleUnvolunteer(service.id)}>
                    Se retirer du service
                  </Button>
                ) : (
                  <Button onClick={() => handleVolunteer(service.id)}>
                    Participer
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
} 
