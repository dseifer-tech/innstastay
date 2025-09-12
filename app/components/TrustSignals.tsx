import { ShieldCheck, Receipt, MessageSquare } from "lucide-react";

export default function TrustSignals() {
  const items = [
    {
      title: "Official hotel websites",
      desc: "Rates, room types, and policies sourced directly from hotels.",
      Icon: ShieldCheck,
      card: "from-emerald-50 to-emerald-100 ring-emerald-200",
      icon: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "No platform fees",
      desc: "We link you to the hotel to book. You own the reservation.",
      Icon: Receipt,
      card: "from-sky-50 to-sky-100 ring-sky-200",
      icon: "bg-sky-100 text-sky-600",
    },
    {
      title: "Real support",
      desc: "Talk to hotel staff—not a call center. Faster answers, fewer hoops.",
      Icon: MessageSquare,
      card: "from-violet-50 to-violet-100 ring-violet-200",
      icon: "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
      <header className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Built for clarity and trust
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600">
          Simple comparisons, transparent pricing, and direct booking with hotels.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(({ title, desc, Icon, card, icon }) => (
          <article
            key={title}
            className={`rounded-2xl bg-gradient-to-b ${card} ring-1 p-6 shadow-sm`}
          >
            <div
              className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${icon}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-gray-700 leading-relaxed">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
