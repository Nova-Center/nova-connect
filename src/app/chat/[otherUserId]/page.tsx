// app/chat/[otherUserId]/page.tsx
import ChatPage from "@/components/chat/chat-page"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"

export default async function OneToOnePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarInset className="flex-1 bg-zinc-50">
          <ChatPage />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
