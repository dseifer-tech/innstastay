"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "page_view", page_location: url });
  }, [pathname, searchParams]);

  return null;
}
