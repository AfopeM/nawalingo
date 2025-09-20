import { FaFacebookF } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";

const links = [
  { href: "#", label: "Facebook", icon: FaFacebookF },
  { href: "#", label: "YouTube", icon: IoLogoYoutube },
];

export default function SocialLinks({
  className = "",
}: {
  className?: string;
}) {
  return (
    // SOCIAL MEDIA LINKS
    <div className={`flex justify-center space-x-6 ${className}`}>
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="text-nawalingo-light/50 transition-colors hover:text-nawalingo-primary dark:text-nawalingo-dark/50 dark:hover:text-nawalingo-primary"
        >
          <Icon className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
}
