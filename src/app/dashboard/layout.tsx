"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
} from "@/components/ui/Siebar";
import ProtectedRoute from "@/providers/auth/protected-route";
import Logo from "@/components/navigation/Logo";
import Link from "next/link";
import { useAuth } from "@/providers/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/Dropdown-Menu";
import { UserRound } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <SidebarProvider className="min-h-svh w-full">
        <Sidebar collapsible="icon" className="border-r">
          {/* Sidebar header with logo */}
          <SidebarHeader>
            <Logo className="mx-auto" />
          </SidebarHeader>
          <SidebarSeparator />

          {/* Sidebar navigation content */}
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link
                    href="/dashboard/profile"
                    className="flex w-full items-center gap-2"
                  >
                    <UserRound className="size-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          {/* Sidebar footer with user details */}
          <SidebarFooter>
            <UserInfoDropdown />
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <SidebarInset className="p-4">{children}</SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

// Client component to display current user info and dropdown
function UserInfoDropdown() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    const fetchName = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();
      setFullName(data?.name ?? "");
    };
    fetchName();
  }, [user]);

  if (!user) return null;

  const email = user.email ?? "";

  const initials = (
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("") || email.charAt(0)
  ).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent focus:ring-2 focus:ring-sidebar-ring focus:outline-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-white uppercase">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden text-left">
            <span className="truncate text-xs text-sidebar-foreground/70 lowercase">
              {email.toLowerCase()}
            </span>
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              {fullName || "User"}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">Profile</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
