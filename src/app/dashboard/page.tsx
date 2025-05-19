
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

import { Feed } from "@/components/dashboard/feed"
import { MainSidebar } from "@/components/dashboard/main-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login") 
  }

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="bg-zinc-50 dark:bg-zinc-950">
        <Feed />
      </SidebarInset>
    </SidebarProvider>
  )
}
