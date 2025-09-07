/**
 * Format currency amount using Intl.NumberFormat
 */
export function formatMoney(currency: string, amount: number): string {
  try {
    return new Intl.NumberFormat("en-CA", { 
      style: "currency", 
      currency: currency || "CAD" 
    }).format(amount);
  } catch {
    return `$${amount.toFixed(0)}`;
  }
}

/**
 * Parse money from SerpAPI response with precedence:
 * extracted_before_taxes_fees → extracted_lowest
 */
export function parseMoney(obj: any): number | undefined {
  if (!obj) return undefined;
  
  // Prefer extracted_before_taxes_fees, then extracted_lowest
  return obj.extracted_before_taxes_fees ?? 
         obj.extracted_lowest ?? 
         obj.rate ?? 
         obj.price ?? 
         obj.amount;
}
