"use client";
import Link from "next/link";
import { Button, Logo } from "@/components/atoms";
import { useTheme } from "@/providers/theme/theme-provider";
import { SocialLinks } from "@/marketing/navigation";

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-nawalingo-dark pt-10 text-center dark:bg-nawalingo-light">
      {/* MAIN FOOTER CONTENT */}
      <div className="px-8">
        {/* SOCIAL MEDIA ICONS */}
        <SocialLinks className="mb-4" />

        {/* LOGO */}
        <Logo isFooter className="mb-2" />

        {/* TAGLINE */}
        <p className="mx-auto mb-6 max-w-xl text-nawalingo-gray-light dark:text-nawalingo-gray-dark">
          Chat with native speakers and pick up the language the right way, the
          it&#39;s actually spoken, all through real conversations and exchange
          of culture.
        </p>

        {/* FOOTER NAVIGATION LINK */}
        <div className="mb-6 flex justify-center space-x-8 text-sm font-black text-nawalingo-light/50 uppercase transition-colors hover:text-white dark:text-nawalingo-dark/90">
          <Link href="/about-us">
            <Button
              className="capitalize"
              variant={theme === "light" ? "default" : "secondary"}
            >
              about us
            </Button>
          </Link>

          <Link href="/contact-us">
            <Button
              className="capitalize"
              variant={theme === "light" ? "default" : "secondary"}
            >
              contact us
            </Button>
          </Link>
        </div>
      </div>

      {/* COPYRIGHT, PRIVACY POLICY & TERMS AND CONDITIONS */}
      <div className="gap-2 px-8 py-4 text-center text-xs tracking-wider text-nawalingo-light/40 dark:text-nawalingo-dark/40">
        Nawalingo©{currentYear}.<br /> Read our{" "}
        <Link
          href="#"
          className="underline transition-all duration-300 hover:text-nawalingo-primary"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="underline transition-all duration-300 hover:text-nawalingo-primary"
        >
          Terms and Conditions
        </Link>{" "}
        to learn more.
      </div>
    </footer>
  );
}
