import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface NavLinksProps {
  isMobile?: boolean;
}

const navPaths = [
  { name: "languages", path: "/languages" },
  { name: "become a tutor", path: "/become-a-tutor" },
  { name: "pricing", path: "/pricing" },
];

export default function NavLinks({ isMobile = false }: NavLinksProps) {
  const getButtonClasses = () => {
    const baseStyles = "font-normal tracking-widest capitalize";
    const desktopStyles = "py-2 text-md";
    const mobileStyles =
      "w-full justify-center py-6 text-xl border border-nawalingo-dark dark:border-nawalingo-light text-nawalingo-gray-light/75 hover:bg-nawalingo-light/5 hover:border-nawalingo-light/10 hover:text-nawalingo-light dark:text-nawalingo-gray-dark/75 hover:dark:bg-nawalingo-dark/5 hover:dark:border-nawalingo-dark/10 hover:dark:text-nawalingo-dark";

    return cn(baseStyles, isMobile ? mobileStyles : desktopStyles);
  };

  const getContainerClasses = () => {
    const baseContainer = "gap-4";
    const mobileContainer = "flex flex-col justify-start";
    const desktopContainer = "hidden items-center justify-center lg:flex";

    return cn(baseContainer, isMobile ? mobileContainer : desktopContainer);
  };

  return (
    <div className={getContainerClasses()}>
      {navPaths.map((nav) => (
        <Link key={nav.name} href={nav.path} passHref>
          <Button variant="ghost" className={getButtonClasses()}>
            {nav.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
