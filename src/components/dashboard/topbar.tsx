"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface TopbarProps {
  title: string;
  description?: string;
}

export function Topbar({ title, description }: TopbarProps) {
  const { data: session } = useSession();
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-md border bg-blue-50 px-3 py-2 text-xs font-semibold tracking-wide text-[#1e3a8a]">
          PORTAL SST
        </div>
        <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="border-[#1e3a8a]/20 text-[#1e3a8a] gap-1"
        >
          <Shield className="h-3 w-3" />
          SST
        </Badge>
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9 bg-[#1e3a8a]">
            <AvatarFallback className="bg-[#1e3a8a] text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
