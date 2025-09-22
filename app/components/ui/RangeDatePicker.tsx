'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/Button';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';

type Props = {
  value?: DateRange | undefined;
  onChange?: (range: DateRange | undefined) => void;
  minDate?: Date;
  label?: string;
};

function toYMD(d?: Date | null) {
  return d ? format(d, 'yyyy-MM-dd') : '';
}

export default function RangeDatePicker({
  value,
  onChange,
  minDate,
  label = 'Check-in date — Check-out date',
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>(
    value ?? { from: undefined, to: undefined }
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onChange?.(range);
  }, [range, onChange]);

  const labelText = useMemo(() => {
    const from = toYMD(range?.from ?? undefined);
    const to = toYMD(range?.to ?? undefined);
    if (!from && !to) return label;
    if (from && !to) return `${from} — …`;
    return `${from} — ${to}`;
  }, [range?.from, range?.to, label]);

  // Set minDate to today if not provided
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabledDays = [{ before: minDate ?? today }];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'font-date font-normal sm:font-medium',
            'relative w-full rounded-2xl border-2 border-blue-200/60 px-6 py-5 text-left justify-start',
            'bg-gradient-to-r from-white to-blue-50/30 hover:from-blue-50/40 hover:to-blue-100/40',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30',
            'shadow-lg hover:shadow-xl transition-all duration-200',
            'text-lg font-medium tracking-normal text-gray-900',
            'min-h-[4rem]'
          )}
          aria-label="Choose check-in and check-out dates"
        >
          <CalendarIcon className="mr-4 h-6 w-6 text-blue-600" />
          <span className="font-medium tracking-normal">{labelText}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-full max-w-sm sm:max-w-lg p-0 z-[60]"
      >
        <div 
          className="rounded-2xl border border-slate-200 bg-white shadow-2xl p-3 md:p-4"
          role="dialog"
          aria-label="Date range selector"
        >
          <Calendar
            mode="range"
            selected={range}
            onSelect={(newRange) => {
              
              if (!newRange?.from) {
                // Clear selection
                setRange({ from: undefined, to: undefined });
                return;
              }

              // Handle same date selection (prevent same check-in/check-out)
              if (newRange?.from && newRange?.to && 
                  newRange.from.getTime() === newRange.to.getTime()) {
                setRange({ from: newRange.from, to: undefined });
                return;
              }

              // Update range
              setRange(newRange);
              
              // Close when we have both dates
              if (newRange?.from && newRange?.to && 
                  newRange.from.getTime() !== newRange.to.getTime()) {
                setTimeout(() => setOpen(false), 300);
              }
            }}
            disabled={disabledDays}
            defaultMonth={range?.from ?? today}
            fromDate={today}
            className="font-date"
          />
          
          <div className="border-t mt-3 pt-3 flex items-center justify-between">
            <button 
              className="text-sm underline underline-offset-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => {
                setRange({ from: undefined, to: undefined });
              }}
            >
              Clear dates
            </button>
            <button 
              className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800 transition-colors"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}