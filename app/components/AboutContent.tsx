import { Building2, CheckCircle2, XOctagon, MessageSquare, ShieldCheck, Receipt } from "lucide-react";

export default function AboutContent() {
  return (
    <section id="about" className="relative isolate mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
      {/* soft background accents */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(900px_500px_at_-10%_0%,#eef5ff_0%,transparent_60%),
              radial-gradient(700px_400px_at_110%_-10%,#f4f1ff_0%,transparent_55%)]
        "
      />

      <header className="text-center mb-10">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Building2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">About InnstaStay</h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          We surface official hotel prices and policies, then send you to the hotel to book.
          No reselling. No platform fees. You keep flexibility and talk to the people who will check you in.
        </p>
      </header>

      {/* Mission + Value props */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mission card */}
        <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-2">Our mission</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Replace runaround with clarity. We make it easy to compare real room options, prices, and policies directly from hotels—
            then complete your booking on the hotel's site so you own the reservation end-to-end.
          </p>
          <ul className="mt-4 grid gap-2">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-[2px]" />
              Direct contact with hotel staff—no call centers.
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-[2px]" />
              Clear, upfront policies (cancellation, holds, fees).
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-[2px]" />
              You keep loyalty participation and member perks.
            </li>
          </ul>
        </article>

        {/* Why booking direct feels better */}
        <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-3">Why book direct with hotels</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-black/10 p-4">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">Real answers, faster</div>
              <p className="text-sm text-gray-600">Talk to the front desk—not a script.</p>
            </div>
            <div className="rounded-xl border border-black/10 p-4">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">You own the booking</div>
              <p className="text-sm text-gray-600">Changes and requests are simple.</p>
            </div>
            <div className="rounded-xl border border-black/10 p-4">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Receipt className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">Transparent pricing</div>
              <p className="text-sm text-gray-600">No bait-and-switch; rooms match what you see.</p>
            </div>
            <div className="rounded-xl border border-black/10 p-4">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">Better options</div>
              <p className="text-sm text-gray-600">Hotels often include member perks or flexible policies.</p>
            </div>
          </div>
        </article>

        {/* What we don't do */}
        <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-3">What we don't do</h3>
          <ul className="grid gap-3">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <XOctagon className="h-5 w-5 text-rose-600 mt-[2px]" />
              We don't resell rooms or add platform fees.
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <XOctagon className="h-5 w-5 text-rose-600 mt-[2px]" />
              We don't hide policies or play bait-and-switch games.
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <XOctagon className="h-5 w-5 text-rose-600 mt-[2px]" />
              We don't make you bounce between call centers and hotels.
            </li>
          </ul>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="/search"
              className="inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Show Direct Rates
            </a>
            <a
              href="/#faq"
              className="inline-block rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Read FAQs
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}