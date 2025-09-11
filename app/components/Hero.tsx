"use client";

type HeroProps = {
  title: string;
  subtitle?: string;
  imageSrc: string;  // e.g. "/hero/homepage.jpg"
  imageAlt?: string; // (backgrounds aren't read by SRs; we'll expose text)
};

export default function Hero({ title, subtitle, imageSrc }: HeroProps) {
  return (
    <section
      className="
        relative w-full overflow-hidden 
        aspect-[5/2]                /* ✅ Wide but shorter 5:2 ratio */
      "
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center 45%",
        backgroundRepeat: "no-repeat",
      }}
      aria-label="Homepage hero"
    >
      {/* Subtle overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/25" />

      {/* Text content */}
      <div className="relative z-10 h-full max-w-5xl mx-auto px-4 sm:px-6 
                      flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{title}</h1>
        {subtitle && (
          <p className="mt-3 sm:mt-4 text-base sm:text-xl text-white/90">{subtitle}</p>
        )}
      </div>
    </section>
  );
}


