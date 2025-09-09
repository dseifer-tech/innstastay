"use client";

import OptimizedImage from "./OptimizedImage";

type HeroProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

export default function Hero({ title, subtitle, imageSrc, imageAlt }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[56vh] w-full">
      <picture className="absolute inset-0 -z-10">
        <OptimizedImage
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          width={1920}
          height={900}
          priority={true}
          sizes="100vw"
        />
      </picture>

      {/* Overlays for contrast */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Centered content */}
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:py-28 md:py-36">
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-white/90 sm:text-xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
}


