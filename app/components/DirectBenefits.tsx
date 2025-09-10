import { Phone, ShieldCheck, CalendarClock, Receipt } from "lucide-react";

export default function DirectBenefits() {
  const items = [
    {
      title: "Real People, Real Answers",
      desc: "Speak with the hotel—not a script. Faster solutions, zero runaround.",
      Icon: Phone,
      card: "from-rose-50 to-rose-100 ring-rose-200",
      icon: "bg-rose-100 text-rose-600",
    },
    {
      title: "Your Booking, Not Theirs",
      desc: "We manage your reservation. No \"we'll email the agency\" delays.",
      Icon: ShieldCheck,
      card: "from-emerald-50 to-emerald-100 ring-emerald-200",
      icon: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Better Policies + Perks",
      desc: "Change or cancel under hotel rules and unlock loyalty benefits and member-only extras.",
      Icon: CalendarClock,
      card: "from-sky-50 to-sky-100 ring-sky-200",
      icon: "bg-sky-100 text-sky-600",
    },
    {
      title: "Honest, Upfront Pricing",
      desc: "What you see is what you get—no funny fees, no bait-and-switch, and rooms that match the photos.",
      Icon: Receipt,
      card: "from-violet-50 to-violet-100 ring-violet-200",
      icon: "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
      <header className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Why Skip the OTAs? Book Direct.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600">
          Direct line. Clear details. Flexible changes. The easiest way to book—start to finish.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ title, desc, Icon, card, icon }) => (
          <article
            key={title}
            className={`rounded-2xl bg-gradient-to-b ${card} ring-1 p-5 shadow-sm`}
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${icon} mb-4`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
