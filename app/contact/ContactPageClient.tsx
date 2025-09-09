'use client';

import { Mail, Shield, Clock, CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ContactPageClient() {
  const [copied, setCopied] = useState(false);
  const email = 'info@innstastay.com';


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

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Support Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-blue-50 p-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-zinc-900 mb-2">General Support</h2>
                <p className="text-zinc-600 mb-4">
                  Questions about bookings, rates, or using our platform? We&apos;re here to help.
                </p>

                <div className="mb-4">
                  <div className="text-sm font-medium text-zinc-700 mb-2">Email us at:</div>
                  <div className="font-mono text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    hello@innstastay.com
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <a
                    href="mailto:hello@innstastay.com"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow hover:shadow-md transition"
                  >
                    Send Email
                  </a>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText('hello@innstastay.com');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      } catch (_) {}
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:shadow-sm transition"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <ul className="space-y-2 text-sm text-zinc-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Response within 24 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Mon-Fri, 9am-6pm ET
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Partnership Card */}
          <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-purple-100 p-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-zinc-900 mb-2">Hotel Partnerships</h2>
                <p className="text-zinc-600 mb-4">
                  Are you a hotel looking to offer direct rates without commissions? Let&apos;s talk.
                </p>

                <div className="mb-4">
                  <div className="text-sm font-medium text-zinc-700 mb-2">Partnership inquiries:</div>
                  <div className="font-mono text-purple-600 bg-white px-3 py-2 rounded-lg">
                    partners@innstastay.com
                  </div>
                </div>

                <a
                  href="mailto:partners@innstastay.com?subject=Hotel Partnership Inquiry"
                  className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-white font-medium shadow hover:shadow-md transition w-full sm:w-auto"
                >
                  Become a Partner
                </a>

                <div className="mt-4 text-sm text-zinc-600">
                  <strong>Benefits:</strong> Zero commissions, direct customer relationships, better margins
                </div>
              </div>
            </div>
          </div>
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
