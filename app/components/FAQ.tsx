"use client";

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { 
      q: "Do I still get loyalty points?", 
      a: "Yes. You book direct with the hotel and keep all loyalty benefits, points, and member perks." 
    },
    { 
      q: "Are there fees to use InnstaStay?", 
      a: "No fees. We show the hotel's actual price with 0% commission. What you see is what you pay." 
    },
    { 
      q: "Where do your prices come from?", 
      a: "Direct from the hotel's own booking system in real time via Google's Hotel API." 
    },
    { 
      q: "How is this different from other booking sites?", 
      a: "We don't add commissions or markups. You see the hotel's real rate and book directly with them." 
    },
    { 
      q: "What if I need to cancel or change my booking?", 
      a: "You'll work directly with the hotel using their cancellation and modification policies." 
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }, index) => (
            <div key={q} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left cursor-pointer font-semibold text-lg flex justify-between items-center"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {q}
                <span className={`ml-4 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <div 
                id={`faq-answer-${index}`}
                className={`mt-3 text-gray-600 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* FAQ JSON-LD Schema */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(({q, a}) => ({
              "@type": "Question",
              "name": q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": a
              }
            }))
          })
        }} 
      />
    </section>
  );
}
