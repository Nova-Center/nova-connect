import { Feed } from "@/components/feed"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="bg-zinc-50 dark:bg-zinc-950">
        <Feed />
      </SidebarInset>
    </SidebarProvider>
  )
}
