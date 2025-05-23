// src/app/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/dashboard/main-sidebar"
import { Feed } from "@/components/dashboard/feed"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="bg-zinc-50 dark:bg-zinc-950">
        <Feed />
      </SidebarInset>
    </SidebarProvider>
  )
}
