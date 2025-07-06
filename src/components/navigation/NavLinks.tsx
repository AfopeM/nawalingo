"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/auth/auth-provider";

interface NavLinksProps {
  isMobile?: boolean;
}

export default function NavLinks({ isMobile = false }: NavLinksProps) {
  const { user, loading, signOut } = useAuth();

  const buttonClassName = isMobile ? "w-full justify-start text-center" : "";

  if (loading) {
    return null;
  }

  return user ? (
    <>
      <Link href="/dashboard/apply">
        <Button variant="outline" className={buttonClassName}>
          Apply to teach
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button variant="outline" className={buttonClassName}>
          Dashboard
        </Button>
      </Link>
      <Button onClick={signOut} className={buttonClassName}>
        Logout
      </Button>
    </>
  ) : (
    <>
      <Link href="/signin">
        <Button variant="outline" className={buttonClassName}>
          Apply to teach
        </Button>
      </Link>
      <Link href="/signin">
        <Button className={buttonClassName}>Login</Button>
      </Link>
      <Link href="/signup">
        <Button variant="outline" className={buttonClassName}>
          Signup
        </Button>
      </Link>
    </>
  );
}
