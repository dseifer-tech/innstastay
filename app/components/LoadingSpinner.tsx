"use client";

import { Search, Hotel } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'search';
}

export default function LoadingSpinner({ 
  message = "Searching for hotels...", 
  size = 'md',
  variant = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Animated spinner */}
        <div className="relative mb-6">
          {/* Outer ring */}
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 mx-auto`}></div>
          
          {/* Icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            {variant === 'search' ? (
              <Search className={`${size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600 animate-pulse`} />
            ) : (
              <Hotel className={`${size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600 animate-pulse`} />
            )}
          </div>
        </div>

        {/* Loading message */}
        <h2 className={`font-semibold text-gray-900 mb-2 ${textSizes[size]}`}>
          {message}
        </h2>
        
        {/* Subtitle */}
        <p className="text-gray-600 text-sm">
          {variant === 'search' 
            ? "Comparing real-time rates from verified hotels..." 
            : "Loading your perfect stay..."
          }
        </p>

        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
