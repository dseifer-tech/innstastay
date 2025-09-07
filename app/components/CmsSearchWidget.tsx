'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'
import SearchBarWide from './SearchBarWide'

type Props = { title?: string; subhead?: string }

export default function CmsSearchWidget({ title, subhead }: Props) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    addDays(new Date(), 1),
  ])
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const handleSearch = () => {
    const checkIn = dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
    const checkOut = dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : format(addDays(new Date(), 1), 'yyyy-MM-dd')
    window.location.href = `/search?checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${children}`
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {(title || subhead) && (
          <div className="text-center mb-6">
            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
            {subhead && <p className="text-neutral-600 mt-2">{subhead}</p>}
          </div>
        )}
        <div className="mx-auto w-[min(980px,96vw)]">
          <SearchBarWide
            dateLabel="Dates"
            dateValue={dateRange[0] && dateRange[1] ? `${format(dateRange[0], 'MMM dd')} – ${format(dateRange[1], 'MMM dd')}` : 'Select dates'}
            onOpenDates={() => {}}
            paxLabel="Travelers"
            paxValue={`${adults + children} ${adults + children > 1 ? 'travelers' : 'traveler'}, 1 room`}
            onOpenPax={() => {}}
            onSearch={handleSearch}
          />
        </div>
      </div>
    </section>
  )
}


