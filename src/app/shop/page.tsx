import { ShopList } from "@/components/shop_items/shop-list";
import { MainSidebar } from "@/components/dashboard/main-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function EvenementsPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/auth/login")

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


