"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Calendar, FileText, Type, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"

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

    // Vérifier que la date n'est pas dans le passé
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      toast({ title: "La date ne peut pas être dans le passé", variant: "destructive" })
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
        },
      )
      toast({
        title: "Service créé avec succès ! 🎉",
        description: "Votre service est maintenant visible par la communauté",
      })
      setTitle("")
      setDescription("")
      setDate("")
      onCreated?.()
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création du service",
        description: error.response?.data?.message || "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-2xl p-8 border border-primary/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Proposer un service
          </h2>
          <p className="text-muted-foreground mt-2">Partagez vos compétences avec la communauté</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
              <Type className="h-4 w-4 text-primary" />
              Titre du service
            </Label>
            <Input
              id="title"
              placeholder="Ex: Cours de guitare, Aide au jardinage, Réparation vélo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 bg-background/50 border-border/40 focus:border-primary/40 focus:ring-primary/20"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground text-right">{title.length}/100 caractères</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Description détaillée
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre service en détail : ce que vous proposez, les prérequis, le matériel nécessaire..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="bg-background/50 border-border/40 focus:border-primary/40 focus:ring-primary/20 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">{description.length}/500 caractères</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date prévue
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="h-12 bg-background/50 border-border/40 focus:border-primary/40 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !title || !description || !date}
              className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground mr-2"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Proposer le service
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
