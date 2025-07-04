import { useSession } from "next-auth/react"
import { useState } from "react"

export default function Shop(){
    interface ShopItemType {
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

    const session = useSession();
    

    const [shops,setShops] = useState<ShopItemType[]>([])

    const fetchShops = async () => {

    }


}