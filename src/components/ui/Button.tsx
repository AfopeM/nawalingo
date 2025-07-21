import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-md font-medium cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "shadow-xs border border-nawalingo-primary bg-nawalingo-primary text-nawalingo-light font-bold tracking-wide dark:text-nawalingo-dark hover:text-nawalingo-primary dark:hover:text-nawalingo-light hover:border hover:border-nawalingo-primary/75 hover:bg-nawalingo-primary/10 backdrop-blur-sm",
        secondary:
          "bg-nawalingo-dark hover:text-nawalingo-dark hover:bg-nawalingo-dark/10 text-nawalingo-light backdrop-blur-sm border border-nawalingo-dark/25",

        outline:
          "shadow-xs text-nawalingo-gray-dark border border-nawalingo-gray-light/25 hover:bg-nawalingo-light/80 dark:bg-nawalingo-dark/80 dark:hover:text-nawalingo-light dark:hover:border-nawalingo-primary/75",
        ghost:
          "rounded-md p-2 transition-colors hover:bg-nawalingo-dark/10 dark:hover:bg-nawalingo-light/10 text-nawalingo-gray-dark dark:text-nawalingo-gray-light",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
