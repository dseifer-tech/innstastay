'use client';

import { Mail, Shield, Clock, CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ContactPageClient() {
  const [copied, setCopied] = useState(false);
  const email = 'info@innstastay.com';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eef5ff] to-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
          Get in touch
        </h1>
        <p className="mt-2 text-zinc-600 max-w-2xl">
          We&apos;re here to help with questions about bookings, partnerships, or platform support.
        </p>
      </section>

      {/* Contact Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-xl bg-blue-50 p-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Email</h2>
                  <p className="text-zinc-600 mt-1">
                    The fastest way to reach us. We typically reply within one business day.
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow hover:shadow-md transition"
                    >
                      Email us
                    </a>
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:shadow-sm transition"
                      aria-label="Copy email address"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? 'Copied!' : 'Copy address'}
                    </button>
                  </div>

                  <div className="mt-3 text-sm text-zinc-700">
                    Or write to: <span className="font-mono">{email}</span>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <li className="flex items-center gap-2 text-zinc-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Direct support — no middlemen
                </li>
                <li className="flex items-center gap-2 text-zinc-700">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Replies within 1 business day
                </li>
                <li className="flex items-center gap-2 text-zinc-700">
                  <Shield className="h-4 w-4 text-indigo-600" />
                  Secure & private
                </li>
              </ul>
            </div>
          </div>

          {/* Helpful Info / CTA */}
          <aside className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-zinc-900">Helpful links</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="/about" className="text-blue-700 hover:underline">
                  About InnstaStay
                </a>
              </li>
              <li>
                <a href="/search" className="text-blue-700 hover:underline">
                  Browse hotels
                </a>
              </li>
              <li className="text-zinc-600">
                Looking to partner? Email{' '}
                <a href={`mailto:${email}`} className="text-blue-700 hover:underline">
                  {email}
                </a>
                .
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Map / Visual (optional static) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-0 overflow-hidden shadow-sm">
          <div className="h-56 sm:h-72 w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🏙️</div>
              <div className="text-zinc-600 font-medium">Toronto, Canada</div>
            </div>
          </div>
          <div className="px-6 py-4 text-sm text-zinc-600">
            Toronto, Canada • Operating hours: Mon–Fri, 9am–6pm ET
          </div>
        </div>
      </section>

      {/* JSON-LD for ContactPoint */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'InnstaStay',
            url: 'https://www.innstastay.com',
            contactPoint: [
              {
                '@type': 'ContactPoint',
                email: 'info@innstastay.com',
                contactType: 'customer support',
                availableLanguage: ['en'],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
