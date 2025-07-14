import { SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { MainSidebar } from "@/components/dashboard/main-sidebar"
import ChatPage from "@/components/chat/chat-page"

export default async function EvenementsPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/auth/login")
  
   return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
            <ChatPage />
      </div>
    </SidebarProvider>
  )
}
