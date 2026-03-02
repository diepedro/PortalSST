import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50/50">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
