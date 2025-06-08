"use client"

import { useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function CreateServiceForm({ onCreated }: { onCreated?: () => void }) {
  const { data: session } = useSession()
  const user = session?.user

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !date) {
      toast({ title: "Tous les champs sont requis", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`,
        { title, description, date },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      toast({ title: "Service créé avec succès" })
      setTitle("")
      setDescription("")
      setDate("")
      onCreated?.()
    } catch (error) {
      toast({ title: "Erreur lors de la création du service", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 border rounded-lg">
      <h2 className="text-xl font-semibold">Proposer un service</h2>
      <Input
        placeholder="Titre du service"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Description du service"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Création..." : "Proposer le service"}
      </Button>
    </form>
  )
}
