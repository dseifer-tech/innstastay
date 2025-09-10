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
    <section id="hero" className="relative isolate overflow-hidden w-full h-[clamp(320px,36vw,520px)]">
      {/* Background image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          style={{ objectPosition: 'center 45%' }}
        />
      </div>

      {/* Contrast overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/35 via-black/20 to-black/25" />

      {/* Text INSIDE the picture, centered */}
      <div className="relative z-10 h-full px-4 sm:px-6 max-w-5xl mx-auto
                      flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md">
          {title}
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg/relaxed opacity-90">
          {subtitle}
        </p>
      </div>
    </section>
  );
}


