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
    <section className="relative isolate overflow-hidden w-full min-h-[520px] md:min-h-[640px]">
      <Image 
        src={imageSrc} 
        alt={imageAlt} 
        fill 
        priority 
        className="object-cover -z-10" 
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/10" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-20 md:py-28 text-center text-white">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
          {title}
        </h1>
        <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl/relaxed opacity-90">
          {subtitle}
        </p>
      </div>
    </section>
  );
}


