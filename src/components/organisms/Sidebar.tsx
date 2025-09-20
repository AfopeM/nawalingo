"use client";

import Image from "next/image";
import { Logo, Button } from "@/components/atoms";
import { useActiveRole } from "@/hooks/useActiveRole";
import { ThemeToggle } from "@/components/organisms";
import { useState, useEffect } from "react";
import {
  RoleDropdownMenu,
  RoleMenuItems,
  ProfileMenuItems,
} from "@/features/user";
import { useResponsive } from "@/hooks/useResponsive";
import { useAuth } from "@/providers/auth/auth-provider";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  role: "student" | "tutor" | "admin";
}

export default function Sidebar({ children, role = "student" }: SidebarProps) {
  const { isDesktop } = useResponsive();
  const [isShowMenu, setIsShowMenu] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const [roles] = useActiveRole();
  const [isShowProfileMenu, setIsShowProfileMenu] = useState(false);

  // Reset open menus based on breakpoint changes
  useEffect(() => {
    if (isDesktop) {
      setIsShowMenu(false);
    } else {
      setIsShowProfileMenu(false);
    }
  }, [isDesktop]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsShowProfileMenu(false);
      setIsShowMenu(false);
    };

    if (isShowProfileMenu || isShowMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isShowProfileMenu, isShowMenu]);

  const isActive = (path: string) => pathname === path;

  const getUserDisplayName = () => {
    if (!user) return null;
    const fullName =
      user.user_metadata.full_name || user.user_metadata.username;
    return fullName ? fullName.split(" ")[0] : "User";
  };

  return (
    <section className="flex min-h-screen gap-3 p-3 transition-all duration-300">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-72 flex-col rounded-2xl bg-nawalingo-dark/5 p-6 transition-all duration-300 lg:flex dark:bg-nawalingo-light/5">
        {/* LOGO SECTION */}
        <div className="mb-6 flex h-20 items-center justify-center">
          <Logo className="text-2xl text-white" />
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-6">
          <div className="space-y-3">
            <h2 className="px-3 text-xs font-semibold tracking-wider text-nawalingo-gray-light uppercase dark:text-nawalingo-gray-dark">
              Navigation
            </h2>
            <div className="space-y-1">
              <RoleMenuItems
                role={role}
                isActive={isActive}
                reverse={role !== "student"}
              />
            </div>
          </div>
        </nav>

        {/* BOTTOM SECTION */}
        <div className="border-t border-nawalingo-dark/10 pt-6 text-center text-xs text-nawalingo-gray-light uppercase dark:border-slate-700/50 dark:text-nawalingo-gray-dark">
          Nawalingo Platform
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex flex-1 flex-col gap-3">
        {/* TOP NAVIGATION BAR */}
        <nav className="relative flex h-20 items-center justify-between rounded-xl bg-nawalingo-dark/5 px-6 transition-all duration-300 dark:bg-nawalingo-light/5">
          {/* WELCOME MESSAGE */}
          <div className="flex items-center gap-4">
            {!isDesktop && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setIsShowMenu(!isShowMenu);
                  setIsShowProfileMenu(false);
                }}
                className="h-10 w-10 rounded-xl transition-colors hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
              >
                {isShowMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* GREETING MESSAGE */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Good{" "}
                {new Date().getHours() < 12
                  ? "morning"
                  : new Date().getHours() < 18
                    ? "afternoon"
                    : "evening"}
              </span>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {user
                  ? `Welcome back, ${getUserDisplayName()}!`
                  : "Welcome to Nawalingo"}
              </h1>
            </div>
          </div>

          {/* RIGHT SIDE CONTROLS */}
          <div className="flex items-center gap-3">
            {/* ROLE SELECTOR */}
            {roles && roles.length > 1 && (
              <div className="hidden md:block">
                <RoleDropdownMenu />
              </div>
            )}

            {/* THEME TOGGLE */}
            <ThemeToggle />

            {/* PROFILE MENU - DESKTOP */}
            {isDesktop && user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setIsShowProfileMenu(!isShowProfileMenu);
                    setIsShowMenu(false);
                  }}
                  className="flex h-12 items-center gap-3 rounded-xl px-4 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-slate-900">
                        {user.user_metadata?.avatar_url ? (
                          <Image
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        )}
                      </div>
                    </div>
                    <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-900"></div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isShowProfileMenu ? "rotate-180" : ""}`}
                  />
                </Button>

                {/* PROFILE DROPDOWN */}
                {isShowProfileMenu && (
                  <div className="absolute top-16 right-0 z-50 w-72 animate-in rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-xl duration-200 slide-in-from-top-2 dark:border-slate-700/30 dark:bg-slate-900/90">
                    <div className="mb-4 flex items-center gap-4 border-b border-slate-200/50 pb-4 dark:border-slate-700/50">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-slate-900">
                          {user.user_metadata?.avatar_url ? (
                            <Image
                              src={user.user_metadata.avatar_url}
                              alt="Profile"
                              width={44}
                              height={44}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {user.user_metadata.full_name ||
                            user.user_metadata.username ||
                            "User"}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <ProfileMenuItems role={role} />
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* MOBILE MENU */}
        {isShowMenu && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsShowMenu(false)}
            />
            <div className="absolute top-24 right-3 left-3 animate-in rounded-xl bg-white/90 p-6 shadow-2xl backdrop-blur-xl duration-300 slide-in-from-top-4 dark:border-slate-700/30 dark:bg-slate-900/90">
              <div className="space-y-6">
                {/* MOBILE ROLE SELECTOR */}
                {roles && roles.length > 1 && (
                  <div className="border-b border-slate-200/50 pb-4 dark:border-slate-700/50">
                    <RoleDropdownMenu />
                  </div>
                )}

                {/* MOBILE NAVIGATION */}
                <div className="space-y-1">
                  <RoleMenuItems role={role} isActive={isActive} reverse />
                </div>

                {/* MOBILE PROFILE SECTION */}
                {user && (
                  <div className="border-t border-slate-200/50 pt-4 dark:border-slate-700/50">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full">
                        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-slate-900">
                          {user.user_metadata?.avatar_url ? (
                            <Image
                              alt="Profile"
                              width={36}
                              height={36}
                              src={user.user_metadata.avatar_url}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <User className="size-5 text-slate-600 dark:text-slate-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {user.user_metadata.full_name ||
                            user.user_metadata.username ||
                            "User"}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <ProfileMenuItems
                      role={role}
                      onItemClick={() => setIsShowMenu(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 dark:border-slate-700/30 dark:bg-slate-900/40">
          {children}
        </main>
      </section>
    </section>
  );
}
