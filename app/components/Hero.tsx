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
    <section className="relative isolate w-full min-h-[380px] md:min-h-[480px] lg:min-h-[560px] overflow-hidden">
      {/* Background image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
      />

      {/* Contrast overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30" />

      {/* Text inside the picture */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 h-full flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md">
          {title}
        </h1>
        <p className="mt-3 text-sm sm:text-base lg:text-lg/relaxed opacity-90">
          {subtitle}
        </p>
      </div>
    </section>
  );
}


