"use client";

import Link from "next/link";
import {
  House,
  GraduationCap,
  Wallet,
  Video,
  CalendarDays,
  SquarePen,
  Clock,
  CalendarCheck,
  IdCard,
  DollarSign,
  Star,
  Users,
  BarChart3,
  FileText,
  Settings,
  Banknote,
  FileSearch,
  LucideIcon,
} from "lucide-react";

type Role = "student" | "tutor" | "admin";

interface NavItem {
  label: string;
  icon: LucideIcon;
}

interface RoleMenuItemsProps {
  role: Role;
  isActive: (path: string) => boolean;
  /**
   * When true, applies `flex-row-reverse justify-between` to each nav item –
   * useful for mobile layouts or alternative visual arrangements.
   */
  reverse?: boolean;
}

const itemStyles =
  "flex w-full items-center gap-4 rounded-lg p-4 text-lg cursor-pointer tracking-wider text-nawalingo-gray-dark capitalize hover:bg-nawalingo-dark/10 dark:hover:bg-nawalingo-light/5 transition-all duration-300";

const roleItems: Record<Role, NavItem[]> = {
  student: [
    { label: "find tutors", icon: GraduationCap },
    { label: "my lessons", icon: CalendarDays },
    { label: "past sessions", icon: Video },
    { label: "billing", icon: Wallet },
    { label: "reviews", icon: SquarePen },
  ],
  tutor: [
    { label: "schedule & availability", icon: Clock },
    { label: "my sessions", icon: CalendarCheck },
    { label: "teaching profile", icon: IdCard },
    { label: "earnings", icon: DollarSign },
    { label: "reviews", icon: Star },
  ],
  admin: [
    { label: "user management", icon: Users },
    { label: "platform analytics", icon: BarChart3 },
    { label: "content & support", icon: FileText },
    { label: "system management", icon: Settings },
    { label: "financial operations", icon: Banknote },
    { label: "audit logs", icon: FileSearch },
  ],
};

export default function RoleMenuItems({
  role,
  isActive,
  reverse = false,
}: RoleMenuItemsProps) {
  const navItems: NavItem[] = [
    { label: "dashboard", icon: House },
    ...roleItems[role],
  ];

  const directionClass = reverse ? "flex-row-reverse justify-between" : "";

  return (
    <>
      {navItems.map(({ label, icon: Icon }) => {
        const path =
          label === "dashboard"
            ? `/user/${role}/dashboard`
            : `/user/${role}/${label.toLowerCase().replace(/ /g, "-")}`;

        return (
          <Link
            key={label}
            href={path}
            className={`${itemStyles} ${directionClass} ${
              isActive(path)
                ? "bg-nawalingo-dark/10 font-black dark:bg-nawalingo-light/5"
                : ""
            }`}
          >
            <Icon className="size-5 stroke-1" />
            <span>{label}</span>
          </Link>
        );
      })}
    </>
  );
}
