"use client"

import { useState, useEffect } from "react"
import { ShopItem } from "./shop-item"
import { ShopItemDetail } from "./shop-item-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import axios from "axios"
import { ShopItemType } from "@/types/shop-items"


export function ShopList() {
  const [items, setItems] = useState<ShopItemType[]>([])
  const [selectedItem, setSelectedItem] = useState<ShopItemType | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 12
  const session = useSession()
  const user = session?.data?.user

  useEffect(() => {
    fetchItems()
  }, [currentPage])

  const fetchItems = async () => {
    try {
      setLoading(true)
      console.log("token => " + user?.accessToken)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shop-items/no-pagination`, {
        headers : {Authorization : `Bearer ${user?.accessToken}`}
      })
      
      setItems(response.data.data)
      setTotalItems(response.data.meta.total)
    } catch (error) {
        if(error instanceof Error){
          toast({
          title : "",
          description : error.message || "erreur lors de la récupération des shops"
        })
        }
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleItemClick = async (item: ShopItemType) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shop-items/${item.id}`)
      if (response.ok) {
        const detailedItem = await response.json()
        setSelectedItem(detailedItem)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error)
    }
  }

  const handlePurchase = async (itemId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shop-items/${itemId}/purchase`, {
        method: "POST",
        headers: {Authorization: `Bearer ${user?.accessToken}` },
      })

      if (response.ok) {
        // Rafraîchir la liste après achat
        fetchItems()
        setSelectedItem(null)
      }
    } catch (error) {
      console.error("Erreur lors de l'achat:", error)
    }
  }

  if (selectedItem) {
    return <ShopItemDetail item={selectedItem} onBack={() => setSelectedItem(null)} onPurchase={handlePurchase} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Boutique</h1>
        <p className="text-muted-foreground mb-6">Découvrez notre sélection d'articles exclusifs</p>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3 mb-4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredItems.map((item) => (
              <ShopItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
            ))}
          </div>

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Aucun article trouvé</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>

              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
