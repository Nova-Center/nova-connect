"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Calendar, User } from "lucide-react"
import { useState } from "react"

interface ShopItemDetailProps {
  item: {
    id: number
    owner_id: number
    name: string
    description: string
    price: number
    image: string
    client_id: number
    date_purchase: string | null
    created_at: string
    updated_at: string
  }
  onBack: () => void
  onPurchase: (itemId: number) => Promise<void>
}

export function ShopItemDetail({ item, onBack, onPurchase }: ShopItemDetailProps) {
  const [purchasing, setPurchasing] = useState(false)
  const isAvailable = !item.date_purchase

  const handlePurchase = async () => {
    setPurchasing(true)
    try {
      await onPurchase(item.id)
    } finally {
      setPurchasing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-muted">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la boutique
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={item.image || "/placeholder.svg?height=500&width=600"}
              alt={item.name}
              width={600}
              height={500}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute top-4 right-4">
              {isAvailable ? (
                <Badge className="bg-green-500 text-white">Disponible</Badge>
              ) : (
                <Badge className="bg-red-500 text-white">Vendu</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
            <p className="text-4xl font-bold text-primary mb-6">{item.price.toFixed(2)} €</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Vendeur ID: {item.owner_id}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Ajouté le {formatDate(item.created_at)}</span>
            </div>
            {item.date_purchase && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingCart className="w-4 h-4" />
                <span>Vendu le {formatDate(item.date_purchase)}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <Button size="lg" className="w-full" onClick={handlePurchase} disabled={!isAvailable || purchasing}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {purchasing ? "Achat en cours..." : isAvailable ? "Acheter maintenant" : "Article vendu"}
            </Button>

            {isAvailable && (
              <p className="text-sm text-muted-foreground text-center">
                Cet article sera marqué comme vendu après votre achat
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
