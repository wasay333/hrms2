import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "./dashboard/_components/app-sidebar";
import BreadcrumbHeader from "./dashboard/_components/BreadcrumbHeader";
import { Separator } from "../../components/ui/separator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbHeader />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
