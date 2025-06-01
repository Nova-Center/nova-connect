import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/dashboard/main-sidebar"
import { NotificationsList } from "@/components/news/notification-main"

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <SidebarInset className="flex-1 bg-zinc-50 dark:bg-zinc-950">
          <NotificationsList />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
