import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  as: Tag = "section",
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={`relative z-10 flex flex-col items-center py-28 text-center ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
