// src/app/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/dashboard/main-sidebar"
import { RightSidebar } from "@/components/dashboard/rightSidebar"
import { Feed } from "@/components/dashboard/feed"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <SidebarInset className="flex-1 bg-zinc-50 dark:bg-zinc-950">
          <Feed />
        </SidebarInset>
        <RightSidebar />
      </div>
    </SidebarProvider>
  )
}
