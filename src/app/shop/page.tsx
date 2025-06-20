import { ShopList } from "@/components/shop_items/shop-list";
import { MainSidebar } from "@/components/dashboard/main-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function EvenementsPage() {
   return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <SidebarInset className="flex-1 bg-zinc-50 dark:bg-zinc-950">
          <ShopList />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
