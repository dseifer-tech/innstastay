'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export type SortOption = 'best-value' | 'price-low' | 'price-high' | 'rating' | 'name';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'best-value', label: 'Best Value' },
  { value: 'price-low', label: 'Lowest Rate' },
  { value: 'price-high', label: 'Highest Rate' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'name', label: 'Hotel Name' }
];

interface SortControlProps {
  className?: string;
}

export default function SortControl({ className = '' }: SortControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSort = (searchParams.get('sort') as SortOption) || 'best-value';
  
  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'best-value') {
      params.delete('sort'); // Default value, no need to store in URL
    } else {
      params.set('sort', newSort);
    }
    
    router.push(`/search?${params.toString()}`);
  };
  
  const currentOption = SORT_OPTIONS.find(option => option.value === currentSort);
  
  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div className="group">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          id="sort-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          Sort: {currentOption?.label}
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="sort-menu-button">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentSort === option.value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                {option.label}
                {option.value === 'best-value' && (
                  <span className="text-xs text-gray-500 block">Default</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
