import Sidebar from "@/components/user/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Sidebar role="student">{children}</Sidebar>;
}
