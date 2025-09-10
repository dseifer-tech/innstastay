'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'primary', disabled, loading, children, ...props },
  ref
) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[.98] ' +
    'disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary:
      'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-600',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm focus-visible:ring-gray-400',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
});
