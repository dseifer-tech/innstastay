"use client";

import { useMemo } from "react";

type Props = {
  children: React.ReactNode;
};

export default function SearchSection({ children }: Props) {
  const shadowClass = useMemo(
    () =>
      "shadow-[0_20px_60px_rgba(2,6,23,0.14)] hover:shadow-[0_28px_90px_rgba(2,6,23,0.18)]",
    []
  );

  return (
    <section aria-label="Search hotels" className="relative -mt-10 md:-mt-14">
      <div className="mx-auto w-[min(1200px,96vw)]">
        <div className={`rounded-[2rem] bg-white ring-1 ring-black/5 ${shadowClass} transition-shadow duration-200`}>{children}</div>
      </div>
    </section>
  );
}


