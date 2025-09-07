"use client";

import { isMoney, formatMoney } from '@/types/money'
import type { Money } from '@/types/money'

type Props = {
  price?: { currency: string; nightlyFrom: number } | (Money & { source?: string });
  className?: string;
  variant?: 'default' | 'blue' | 'purple' | 'orange';
};

export default function PriceBadge({ price, className, variant = 'default' }: Props) {
  if (!price) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-blue-400/30 hover:from-blue-600 hover:to-indigo-700";
      case 'purple':
        return "bg-gradient-to-r from-purple-500 to-violet-600 text-white border border-purple-400/30 hover:from-purple-600 hover:to-violet-700";
      case 'orange':
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white border border-orange-400/30 hover:from-orange-600 hover:to-red-600";
      default:
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white border border-green-400/30 hover:from-green-600 hover:to-emerald-700";
    }
  };

  return (
    <div className={[
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm transition-all duration-200",
      getVariantStyles(),
      "hover:shadow-md hover:scale-105 backdrop-blur-sm",
      className
    ].filter(Boolean).join(" ")}>
      <span className="text-yellow-200">💰</span>
      {('nightlyFrom' in price)
        ? <span>From {formatMoney({ currency: price.currency, amount: price.nightlyFrom })}/night</span>
        : isMoney(price)
          ? <span>{formatMoney(price)}</span>
          : null}
    </div>
  );
}
