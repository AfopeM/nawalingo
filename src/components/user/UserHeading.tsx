import ThemeToggle from "@/ui/ThemeToggle";

export default function UserHeading() {
  return (
    <nav className="flex h-16 items-center justify-between">
      <h1 className="text-2xl font-black">Tutor Dashboard</h1>
      <ThemeToggle />
    </nav>
  );
}
