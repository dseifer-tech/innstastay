"use client";

import Image from "next/image";

type HeroProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

export default function Hero({ title, subtitle, imageSrc, imageAlt }: HeroProps) {
  return (
    <section
      className="
        relative isolate w-full overflow-hidden
        [--hero-h:clamp(320px,36vw,520px)]
        h-[var(--hero-h)]
      "
    >
      {/* Background image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
      />

      {/* Subtle full-cover overlay for readability (no hard band) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/20" />

      {/* Text INSIDE the picture */}
      <div className="relative z-10 mx-auto max-w-5xl h-full px-4 sm:px-6
                      flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md">
          {title}
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg/relaxed opacity-90">
          {subtitle}
        </p>
      </div>
    </section>
  );
}


