"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // Responsive: 2 months on ≥sm, 1 month on mobile
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const set = () => setIsDesktop(mq.matches);
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      numberOfMonths={isDesktop ? 2 : 1}
      className={cn("p-3", className)}
      classNames={{
        // ✅ Force horizontal layout for months
        months: "flex flex-row gap-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-base font-semibold text-slate-900",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-600 rounded-md w-10 font-medium text-xs uppercase tracking-wider",
        row: "flex w-full mt-2",
        cell:
          "h-10 w-10 text-center text-sm p-0 relative rounded-lg",
        day: "h-10 w-10 p-0 font-normal hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:text-white rounded-lg font-medium",
        day_today: "bg-blue-50 text-blue-900 font-semibold border border-blue-200",
        day_outside: "text-muted-foreground opacity-35",
        day_disabled: "text-muted-foreground opacity-35 cursor-not-allowed line-through",
        day_range_start: "bg-blue-600 text-white rounded-lg font-medium",
        day_range_end: "bg-blue-600 text-white rounded-lg font-medium", 
        day_range_middle:
          "bg-blue-100 text-blue-900 hover:bg-blue-200",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
