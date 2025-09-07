export type Money = { amount: number; currency: string }

export function isMoney(x: any): x is Money {
  return !!x && typeof x.amount === 'number' && typeof x.currency === 'string'
}

export function formatMoney(m: Money) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: m.currency }).format(m.amount)
  } catch {
    return `${m.amount} ${m.currency}`
  }
}


