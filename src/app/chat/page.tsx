import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import ChatList from "@/components/chat/chat-list"

export default async function EvenementsPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/auth/login")

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <SidebarInset className="flex-1 bg-zinc-50 dark:bg-zinc-950">
                    <ChatList />
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
