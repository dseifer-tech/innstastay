"use client";

import { ArrowRight } from 'lucide-react';

interface SecondaryCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
  className?: string;
}

export default function SecondaryCTA({ 
  title = "Ready to Find Your Perfect Stay?",
  subtitle = "Compare live rates from Toronto&apos;s top hotels in seconds.",
  buttonText = "Compare Rates Now",
  href = "/search",
  className = ""
}: SecondaryCTAProps) {
  return (
    <section className={`py-16 bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <a 
          href={href}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          {buttonText}
          <ArrowRight className="w-5 h-5" />
        </a>
        <p className="text-sm text-gray-500 mt-4">
          It&apos;s free and only takes 10 seconds.
        </p>
      </div>
    </section>
  );
}
