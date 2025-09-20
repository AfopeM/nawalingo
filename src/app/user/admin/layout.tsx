import Sidebar from "@/components/organisms/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Sidebar role="admin">{children}</Sidebar>;
}
