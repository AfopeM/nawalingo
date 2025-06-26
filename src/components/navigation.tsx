import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="flex h-16 w-full items-center justify-between px-8 py-4">
      <Link href="/">Nawalingo</Link>
      <ul className="flex items-center gap-4">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="flex items-center gap-4">
        <Button>Login</Button>
        <Button variant="outline">Signup</Button>
      </div>
    </nav>
  );
}
