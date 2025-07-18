"use client"

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
  const { data: session, status } = useSession()
  const token = session?.user?.accessToken

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    isExchangeOnly: false,
    desiredServiceDescription: "",
  })
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  const handleChange = useCallback(
    (field: keyof typeof formData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const { title, description, date, isExchangeOnly, desiredServiceDescription } = formData

      if (!title || !description || !date) {
        toast({ title: "Tous les champs requis (Titre, Description, Date) sont obligatoires", variant: "destructive" })
        return
      }
      if (isExchangeOnly && !desiredServiceDescription) {
        toast({ title: "Veuillez décrire le service désiré pour un échange", variant: "destructive" })
        return
      }
      if (!token) {
        toast({ title: "Vous devez être connecté", variant: "destructive" })
        return
      }
      if (new Date(date) < new Date(today)) {
        toast({ title: "La date ne peut pas être dans le passé", variant: "destructive" })
        return
      }

      setLoading(true)
      try {
        const payload: Record<string, any> = {
          title,
          description,
          date: new Date(date).getTime(),
        }
        if (isExchangeOnly) {
          payload.isExchangeOnly = true
          payload.desiredServiceDescription = desiredServiceDescription
        }

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`,
          payload,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        )

        toast({ title: "Service créé avec succès ! 🎉" })
        setFormData({ title: "", description: "", date: "", isExchangeOnly: false, desiredServiceDescription: "" })
        onCreated()
      } catch (error: any) {
        console.error("Erreur création service:", error.response?.data || error.message)
        toast({
          title: "Erreur lors de la création",
          description: error.response?.data?.message || "Une erreur est survenue",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [formData, token, today, onCreated]
  )

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }
  if (status === "unauthenticated" || !token) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Vous devez être connecté pour créer un service</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-primary/5 to-primary/3 rounded-2xl p-8 border border-primary/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Proposer un service</h2>
          <p className="text-muted-foreground">Partagez vos compétences avec la communauté</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 font-semibold">
              <Type className="h-4 w-4 text-primary" /> Titre du service
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Ex: Cours de guitare..."
              maxLength={100}
              className="h-12"
            />
            <div className="text-xs text-muted-foreground text-right">{formData.title.length}/100</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4 text-primary" /> Description détaillée
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Décrivez votre service..."
              rows={5}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">{formData.description.length}/500</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2 font-semibold">
              <Calendar className="h-4 w-4 text-primary" /> Date prévue
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              min={today}
              className="h-12"
            />
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExchangeOnly"
                checked={formData.isExchangeOnly}
                onCheckedChange={(c) => handleChange("isExchangeOnly", c as boolean)}
              />
              <Label htmlFor="isExchangeOnly" className="flex items-center gap-2 font-semibold">
                <Repeat className="h-4 w-4 text-primary" /> Échange uniquement
              </Label>
            </div>
            {formData.isExchangeOnly && (
              <div className="space-y-2">
                <Label htmlFor="desiredServiceDescription" className="flex items-center gap-2 font-semibold">
                  <FileText className="h-4 w-4 text-primary" /> Service désiré en échange
                </Label>
                <Textarea
                  id="desiredServiceDescription"
                  value={formData.desiredServiceDescription}
                  onChange={(e) => handleChange("desiredServiceDescription", e.target.value)}
                  rows={3}
                  maxLength={300}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.desiredServiceDescription.length}/300
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
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/80"
          >
            {loading ? "Création en cours…" : "Proposer le service"}
          </Button>
        </form>
      </div>
    </div>
)
}
