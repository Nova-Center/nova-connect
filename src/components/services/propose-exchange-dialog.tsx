"use client"

import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Repeat, Send } from "lucide-react"

interface ProposeExchangeDialogProps {
  open: boolean
  onClose: () => void
  serviceId: number
  onPropose: (serviceId: number, desiredServiceDescription: string) => Promise<void>
}

export default function ProposeExchangeDialog({ open, onClose, serviceId, onPropose }: ProposeExchangeDialogProps) {
  const session = useSession()
  const user = session?.data?.user

  const [desiredServiceDescription, setDesiredServiceDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!desiredServiceDescription.trim()) {
      toast({ title: "Veuillez décrire le service que vous proposez en échange.", variant: "destructive" })
      return
    }
    if (!user?.accessToken) {
      toast({ title: "Vous devez être connecté pour proposer un échange", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await onPropose(serviceId, desiredServiceDescription)
      setDesiredServiceDescription("") // Réinitialiser le champ
      onClose() // Fermer la modale
    } catch (error) {
      // Erreur déjà gérée par onPropose (via toast)
    } finally {
      setLoading(false)
    }
  }, [desiredServiceDescription, onClose, onPropose, serviceId, user?.accessToken])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Repeat className="h-6 w-6 text-primary" /> Proposer un échange
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="exchangeDescription" className="font-semibold text-foreground">
              Décrivez ce que vous proposez en échange
            </Label>
            <Textarea
              id="exchangeDescription"
              placeholder="Ex: Je peux donner des cours de piano en échange de ce service..."
              value={desiredServiceDescription}
              onChange={(e) => setDesiredServiceDescription(e.target.value)}
              rows={5}
              maxLength={300}
              className="min-h-[120px]"
            />
            <div className="text-xs text-muted-foreground text-right">
              {desiredServiceDescription.length}/300 caractères
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !desiredServiceDescription.trim()}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground mr-2"></div>
                Envoi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer la proposition
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
