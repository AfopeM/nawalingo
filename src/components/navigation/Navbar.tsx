"use client";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import { Button } from "@/components/ui/New-Button";
import { useAuth } from "@/providers/auth/auth-provider";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="flex h-16 w-full items-center justify-between px-8 py-4">
      <Link href="/" className="font-black uppercase">
        Nawalingo
      </Link>

      <div className="flex items-center gap-4">
        {!loading && user ? (
          <>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button onClick={signOut}>Logout</Button>
            <ThemeToggle />
          </>
        ) : (
          <>
            <Link href="/signin">
              <Button>Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Signup</Button>
            </Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </nav>
  );
}
