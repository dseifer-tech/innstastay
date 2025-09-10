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
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full">
      {/* Background Image using Next.js Image with fill */}
      <Image 
        src={imageSrc} 
        alt={imageAlt} 
        fill 
        priority 
        className="object-cover z-0" 
      />
      
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      {/* Centered content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}


