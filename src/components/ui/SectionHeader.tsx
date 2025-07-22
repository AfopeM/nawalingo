interface SectionHeaderProps {
  tagline?: string;
  heading: string;
  desc?: string;
  className?: string;
}

export default function SectionHeader({
  tagline,
  heading,
  desc,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-10 flex max-w-md flex-col items-center gap-2 text-center lg:max-w-xl ${className}`.trim()}
    >
      {tagline && (
        <p className="mb-2 rounded-lg border border-nawalingo-primary/25 bg-gradient-to-r from-nawalingo-primary/20 to-nawalingo-primary/20 px-4 py-2 text-sm tracking-widest text-nawalingo-primary uppercase backdrop-blur-sm dark:to-orange-900/20">
          {tagline}
        </p>
      )}
      <h2 className="text-4xl font-black tracking-tight text-nawalingo-dark capitalize lg:text-5xl dark:text-nawalingo-light">
        {heading}
      </h2>
      {desc && (
        <p className="text-lg text-nawalingo-dark/50 md:text-xl dark:text-nawalingo-light/50">
          {desc}
        </p>
      )}
    </div>
  );
}
