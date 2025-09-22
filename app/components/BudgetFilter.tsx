'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DollarSign } from 'lucide-react';

import type { Hotel } from '@/types/hotel';

interface BudgetFilterProps {
  hotels: Hotel[];
}

export default function BudgetFilter({ hotels }: BudgetFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter values from URL
  const currentMinRate = searchParams.get('minRate');
  const currentMaxRate = searchParams.get('maxRate');
  
  // Local state for inputs
  const [minRate, setMinRate] = useState(currentMinRate || '');
  const [maxRate, setMaxRate] = useState(currentMaxRate || '');
  
  // Calculate price range from hotels
  const pricesWithData = hotels
    .map(h => {
      if (h.price && 'nightlyFrom' in h.price) {
        return h.price.nightlyFrom;
      }
      return undefined;
    })
    .filter((price): price is number => typeof price === 'number' && price > 0);
  
  const minPrice = pricesWithData.length > 0 ? Math.floor(Math.min(...pricesWithData)) : 0;
  const maxPrice = pricesWithData.length > 0 ? Math.ceil(Math.max(...pricesWithData)) : 1000;
  
  // Sync local state with URL params
  useEffect(() => {
    setMinRate(currentMinRate || '');
    setMaxRate(currentMaxRate || '');
  }, [currentMinRate, currentMaxRate]);
  
  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set or remove minRate
    if (minRate && parseInt(minRate) > 0) {
      params.set('minRate', minRate);
    } else {
      params.delete('minRate');
    }
    
    // Set or remove maxRate  
    if (maxRate && parseInt(maxRate) > 0) {
      params.set('maxRate', maxRate);
    } else {
      params.delete('maxRate');
    }
    
    router.push(`/search?${params.toString()}`);
  };
  
  const clearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minRate');
    params.delete('maxRate');
    router.push(`/search?${params.toString()}`);
    setMinRate('');
    setMaxRate('');
  };
  
  const hasActiveFilter = currentMinRate || currentMaxRate;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Budget per night</h3>
      </div>
      
      {pricesWithData.length > 0 && (
        <p className="text-xs text-gray-500 mb-3">
          Range: CAD ${minPrice} - ${maxPrice}
        </p>
      )}
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="minRate" className="block text-xs font-medium text-gray-700 mb-1">
              Min CAD
            </label>
            <input
              id="minRate"
              type="number"
              min="0"
              max={maxPrice}
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
              placeholder={minPrice.toString()}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="maxRate" className="block text-xs font-medium text-gray-700 mb-1">
              Max CAD
            </label>
            <input
              id="maxRate"
              type="number"
              min="0"
              max={maxPrice}
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              placeholder={maxPrice.toString()}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={applyFilter}
            className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
          {hasActiveFilter && (
            <button
              onClick={clearFilter}
              className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        {hasActiveFilter && (
          <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
            Filtering: CAD ${currentMinRate || minPrice} - ${currentMaxRate || maxPrice}
          </div>
        )}
      </div>
    </div>
  );
}
