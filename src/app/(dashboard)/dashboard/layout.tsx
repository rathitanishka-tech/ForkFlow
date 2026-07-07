import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[280px] lg:block">
        <Sidebar />
      </div>

      <div className="flex min-h-screen flex-col lg:pl-[280px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
