import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CTASection({
  children,
  className,
  img,
  imgAlt = "CTA",
  imgClassName,
}: {
  className?: string;
  children: React.ReactNode;
  img?: string;
  imgAlt?: string;
  imgClassName?: string;
}) {
  return (
    <div
      className={cn(
        `${img ? "lg:justify-around" : ""} relative flex items-center justify-center bg-nawalingo-primary p-12 text-center`,
        className,
      )}
    >
      <div className={`${img ? "lg:text-left" : ""} text-center`}>
        {children}
      </div>
      {img && (
        <Image
          src={img}
          width={500}
          height={500}
          alt={imgAlt}
          className={cn("hidden object-contain lg:block", imgClassName)}
        />
      )}
    </div>
  );
}
