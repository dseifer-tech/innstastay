"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GA4RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    // Never include PII in URL/query params
    (window as any).gtag?.("event", "page_view", { page_location: url });
  }, [pathname, searchParams]);

  return null;
}
