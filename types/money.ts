export type Money = { amount: number; currency: string }

export function isMoney(x: any): x is Money {
  return !!x && typeof x.amount === 'number' && typeof x.currency === 'string'
}

export function formatMoney(m: Money) {
  try {
    // Use 'en-US' locale explicitly to ensure consistent server/client rendering
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: m.currency }).format(m.amount)
  } catch {
    return `${m.amount} ${m.currency}`
  }
}


