import { ShieldCheck } from "lucide-react";

export default function DirectBookingPromise() {
  return (
    <section
      className="
        relative isolate
        bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600
        text-white
      "
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <ShieldCheck className="h-7 w-7 text-white" aria-hidden="true" />
        </div>

        {/* Heading + subheading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Our Direct Booking Promise
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-white/90 leading-relaxed">
          Book directly with the hotel for clear pricing, flexible changes, and help from the people
          who will check you in. No call centers. No back-and-forth.
        </p>

        {/* Metrics */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
            <div className="text-4xl font-extrabold">0%</div>
            <div className="mt-1 text-sm text-white/90">Platform Fees</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
            <div className="text-4xl font-extrabold">$0</div>
            <div className="mt-1 text-sm text-white/90">Booking Fees</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
            <div className="text-4xl font-extrabold">100%</div>
            <div className="mt-1 text-sm text-white/90">Transparent Pricing</div>
          </div>
        </div>

        {/* small footnote to align with overall messaging (optional) */}
        <p className="mt-6 text-xs text-white/80">
          Direct line, clear details, flexible changes — the simplest way to book.
        </p>
      </div>
    </section>
  );
}
