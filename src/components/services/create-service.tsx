"use client"

import type React from "react"
import { useState, useCallback } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Calendar, FileText, Type, Sparkles, Repeat } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateServiceProps {
  onCreated: () => void
}

export default function CreateServiceForm({ onCreated }: CreateServiceProps) {
  const session = useSession()
  const user = session?.data?.user

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    isExchangeOnly: false,
    desiredServiceDescription: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!formData.title || !formData.description || !formData.date) {
        toast({ title: "Tous les champs requis (Titre, Description, Date) sont obligatoires", variant: "destructive" })
        return
      }

      if (formData.isExchangeOnly && !formData.desiredServiceDescription) {
        toast({ title: "Veuillez décrire le service désiré pour un échange", variant: "destructive" })
        return
      }

      if (!user?.accessToken) {
        toast({ title: "Vous devez être connecté", variant: "destructive" })
        return
      }

      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        toast({ title: "La date ne peut pas être dans le passé", variant: "destructive" })
        return
      }

      setLoading(true)
      try {
        // API expects date as a string, not timestamp
        const payload = {
          title: formData.title,
          description: formData.description,
          date: formData.date, // Send as string "YYYY-MM-DD"
          isExchangeOnly: formData.isExchangeOnly,
          ...(formData.isExchangeOnly && formData.desiredServiceDescription
            ? { desiredServiceDescription: formData.desiredServiceDescription }
            : {}),
        }

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`, payload, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        })

        toast({ title: "Service créé avec succès ! 🎉" })
        setFormData({ title: "", description: "", date: "", isExchangeOnly: false, desiredServiceDescription: "" })
        onCreated()
      } catch (error: any) {
        console.error("Erreur détaillée lors de la création:", error.response?.data || error.message)
        toast({
          title: "Erreur lors de la création",
          description: error.response?.data?.message || "Une erreur est survenue",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [formData, user?.accessToken, onCreated],
  )

  const today = new Date().toISOString().split("T")[0]

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (session.status === "unauthenticated" || !user?.accessToken) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Vous devez être connecté pour créer un service</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-primary/5 to-primary/3 rounded-2xl p-8 border border-primary/10 dark:from-primary/10 dark:to-primary/5 dark:border-primary/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Proposer un service</h2>
          <p className="text-muted-foreground">Partagez vos compétences avec la communauté</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 font-semibold text-foreground">
              <Type className="h-4 w-4 text-primary" />
              Titre du service
            </Label>
            <Input
              id="title"
              placeholder="Ex: Cours de guitare, Aide au jardinage..."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="h-12"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground text-right">{formData.title.length}/100 caractères</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Description détaillée
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre service en détail..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={5}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">{formData.description.length}/500 caractères</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2 font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              Date prévue
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              min={today}
              className="h-12"
            />
          </div>

          {/* Section Échange */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20 dark:bg-slate-700/20">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExchangeOnly"
                checked={formData.isExchangeOnly}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isExchangeOnly: checked as boolean }))}
              />
              <Label htmlFor="isExchangeOnly" className="flex items-center gap-2 font-semibold text-foreground">
                <Repeat className="h-4 w-4 text-primary" />
                Service d'échange uniquement
              </Label>
            </div>
            {formData.isExchangeOnly && (
              <div className="space-y-2">
                <Label
                  htmlFor="desiredServiceDescription"
                  className="flex items-center gap-2 font-semibold text-foreground"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  Description du service désiré en échange
                </Label>
                <Textarea
                  id="desiredServiceDescription"
                  placeholder="Ex: Je cherche des cours de cuisine en échange de mes cours de guitare..."
                  value={formData.desiredServiceDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, desiredServiceDescription: e.target.value }))}
                  rows={3}
                  maxLength={300}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.desiredServiceDescription.length}/300 caractères
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              loading ||
              !formData.title ||
              !formData.description ||
              !formData.date ||
              (formData.isExchangeOnly && !formData.desiredServiceDescription)
            }
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
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
        </form>
      </div>
    </div>
  )
}
