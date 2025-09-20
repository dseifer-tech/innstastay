'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'primary', size = 'md', fullWidth = false, disabled, loading, children, ...props },
  ref
) {
  const sizes: Record<NonNullable<Props['size']>, string> = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-5 py-3 text-sm rounded-xl',
    lg: 'px-6 py-4 text-base rounded-xl',
  };

  const base =
    'inline-flex items-center justify-center font-semibold transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants: Record<NonNullable<Props['variant']>, string> = {
    primary:
      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ' +
      'hover:from-blue-700 hover:to-indigo-700 focus-visible:ring-blue-600 active:translate-y-[1px] active:shadow-none',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
    outline:
      'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-blue-600',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-blue-600',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading ? true : undefined}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
});