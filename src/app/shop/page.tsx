import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ShopMain from "@/components/shop/shop-main";
import { MainSidebar } from "@/components/dashboard/main-sidebar";
import { authOptions } from "@/lib/auth";

export default async function ShopPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30">
        <MainSidebar />

        {/* Zone centrale pour la boutique */}
        <SidebarInset className="flex-1 flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
            <ShopMain />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
