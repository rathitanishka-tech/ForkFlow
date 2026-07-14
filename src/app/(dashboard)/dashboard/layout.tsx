import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/app/dashboard/header";
import { Sidebar } from "@/app/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authState = await auth();
  if (!authState.userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-[#081E19] text-[#f8f5ef]">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-70 lg:block">
        <Sidebar />
      </div>

      <div className="flex min-h-screen flex-col lg:pl-70">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
