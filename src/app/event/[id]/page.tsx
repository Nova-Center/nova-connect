import { MainSidebar } from "@/components/dashboard/main-sidebar"
import EventDetailPage from "@/components/event/event-detail"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function EvenementsPage() {
   return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <SidebarInset className="flex-1 bg-zinc-50 dark:bg-zinc-950">
          <EventDetailPage />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
