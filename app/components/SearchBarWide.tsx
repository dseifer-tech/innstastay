"use client";

type Props = {
  dateLabel: string;          // e.g. "Dates"
  dateValue: string;          // e.g. "Aug 13 – Aug 14"
  onOpenDates: () => void;

  paxLabel: string;           // e.g. "Travelers"
  paxValue: string;           // e.g. "2 travelers, 1 room"
  onOpenPax: () => void;

  onSearch: () => void;
};

export default function SearchBarWide({
  dateLabel,
  dateValue,
  onOpenDates,
  paxLabel,
  paxValue,
  onOpenPax,
  onSearch,
}: Props) {
  return (
    <section className="w-full relative">
      {/* Remove backdrop spotlight temporarily */}
      {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div className="h-[420px] w-[min(1100px,92vw)] rounded-[2.25rem] blur-3xl opacity-40 bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200"></div>
      </div> */}

      {/* container */}
      <div
        className="
          group mx-auto w-[min(1200px,96vw)]
          sticky top-6 z-50
          rounded-[2rem]
          bg-white
          shadow-2xl ring-1 ring-black/5
          transition-all duration-200
          hover:shadow-[0_20px_60px_rgba(2,6,23,0.18)]
          focus-within:shadow-[0_24px_80px_rgba(2,6,23,0.22)]
        "
        aria-label="Hotel search"
      >
        {/* Remove gradient edge highlight temporarily */}
        {/* <div className="rounded-[2rem] p-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"> */}
          <div
            className="
              rounded-[2rem]
              grid grid-cols-1 md:grid-cols-[1fr_1fr_auto]
              gap-3 md:gap-4
              p-4 md:p-5 lg:p-6
            "
          >
            {/* Dates */}
            <button
              type="button"
              onClick={onOpenDates}
              className="
                flex items-center gap-3 w-full
                rounded-xl border border-gray-300
                bg-white px-4 py-4
                text-left
                hover:bg-gray-50
                transition-colors
              "
              aria-label="Select dates"
            >
              <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">{dateLabel}</p>
                <p className="truncate text-lg md:text-xl font-semibold text-gray-900">
                  {dateValue}
                </p>
              </div>
            </button>

            {/* Travelers */}
            <button
              type="button"
              onClick={onOpenPax}
              className="
                flex items-center gap-3 w-full
                rounded-xl border border-gray-300
                bg-white px-4 py-4
                text-left
                hover:bg-gray-50
                transition-colors
              "
              aria-label="Select travelers"
            >
              <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">{paxLabel}</p>
                <p className="truncate text-lg md:text-xl font-semibold text-gray-900">
                  {paxValue}
                </p>
              </div>
            </button>

            {/* Search Button */}
            <button
              type="button"
              onClick={onSearch}
              className="
                flex items-center justify-center gap-2
                rounded-xl
                bg-blue-600 px-6 py-4
                text-white font-semibold text-lg
                hover:bg-blue-700
                transition-colors
                shadow-lg hover:shadow-xl
                transform hover:-translate-y-0.5
                transition-all duration-200
              "
              aria-label="Search hotels"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        {/* </div> */}
      </div>
    </section>
  );
}
