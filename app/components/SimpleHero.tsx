"use client";

type Props = {
  title: string;
  subtitle?: string;
  /** "dark" = light text on dark bg, "light" = dark text on light bg */
  theme?: "dark" | "light";
  className?: string;
};

export default function SimpleHero({
  title,
  subtitle,
  theme = "dark",
  className = "",
}: Props) {
  const isDark = theme === "dark";
  
  return (
    <section
      className={[
        "relative w-full",
        // shorter, more compact height - matching homepage
        "min-h-[320px] md:min-h-[380px]",
        // soft gradient background - matching homepage
        isDark
          ? "bg-gradient-to-b from-slate-600 via-slate-700 to-slate-600"
          : "bg-gradient-to-b from-slate-50 via-white to-white",
        className,
      ].join(" ")}
      aria-label={`${title} page`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Text content - centered and styled like homepage */}
        <div className="h-full flex flex-col items-center justify-center text-center pt-8 md:pt-10 lg:pt-12">
          <h1
            className={`font-bold leading-tight tracking-tight 
              text-2xl md:text-4xl 
              ${isDark ? "text-white" : "text-neutral-900"}`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`mt-3 md:mt-4 text-base md:text-xl max-w-3xl
                ${isDark ? "text-white/80" : "text-neutral-600"}`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
