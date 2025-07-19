import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Feed } from "@/components/dashboard/feed";
import RightSidebar from "@/components/dashboard/rightSidebar";
import { MainSidebar } from "@/components/dashboard/main-sidebar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30">
        {/* Sidebar gauche */}
        <MainSidebar />

        {/* Zone centrale avec le feed */}
        <SidebarInset className="flex-1 flex flex-col">
          <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
            <Feed />
          </div>
        </SidebarInset>

        {/* Sidebar droite - complètement fixe */}
        <div className="hidden xl:block w-80 relative">
          <div className="fixed top-0 right-0 w-110 h-screen border-l bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <RightSidebar />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
