import { useActiveRole } from "@/hooks/useActiveRole";
import ThemeToggle from "@/components/organisms/ThemeToggle";
import RoleDropdownMenu from "@/features/user/RoleDropdownMenu";

export default function UserHeading() {
  const [activeRole] = useActiveRole();
  return (
    <nav className="flex h-16 w-full items-center justify-between rounded bg-green-400 px-4">
      <h1 className="text-2xl font-black capitalize">
        {activeRole}&apos;s Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <RoleDropdownMenu />
        <ThemeToggle />
      </div>
    </nav>
  );
}
