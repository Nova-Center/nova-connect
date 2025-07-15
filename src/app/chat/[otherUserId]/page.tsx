// app/chat/[otherUserId]/page.tsx
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import ChatPage from "@/components/chat/chat-page"
import { MainSidebar } from "@/components/dashboard/main-sidebar"
import RightSidebar from "@/components/dashboard/rightSidebar"

export default async function OneToOnePage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/auth/login")

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <MainSidebar />
                <SidebarInset className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-6">
                    <ChatPage />
                </SidebarInset>
                {/* Sidebar droite - complètement fixe */}
                <div className="hidden xl:block w-80 relative">
                    <div className="fixed top-0 right-0 w-110 h-screen border-l bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}
