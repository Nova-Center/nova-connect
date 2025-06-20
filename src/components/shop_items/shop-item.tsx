"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"

interface ShopItemProps {
  item: {
    id: number
    name: string
    description: string
    price: number
    image: string
    date_purchase: string | null
  }
  onClick: () => void
}

export function ShopItem({ item, onClick }: ShopItemProps) {
  const isAvailable = !item.date_purchase

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden">
      <div className="relative overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg?height=200&width=300"}
          alt={item.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute top-2 right-2">
          {isAvailable ? (
            <Badge variant="secondary" className="bg-green-500/90 text-white">
              Disponible
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-500/90 text-white">
              Vendu
            </Badge>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="bg-white/90 text-black hover:bg-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir détails
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{item.price.toFixed(2)} €</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          disabled={!isAvailable}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isAvailable ? "Voir l'article" : "Article vendu"}
        </Button>
      </CardFooter>
    </Card>
  )
}
