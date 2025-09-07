import { formatMoney, parseMoney } from '../money';

describe('formatMoney', () => {
  it('should format CAD currency correctly', () => {
    expect(formatMoney('CAD', 555)).toBe('$555.00');
    expect(formatMoney('CAD', 199.99)).toBe('$199.99');
    expect(formatMoney('CAD', 0)).toBe('$0.00');
  });

  it('should handle invalid currency gracefully', () => {
    expect(formatMoney('INVALID', 555)).toBe('$555');
  });

  it('should handle zero and negative amounts', () => {
    expect(formatMoney('CAD', 0)).toBe('$0.00');
    expect(formatMoney('CAD', -100)).toBe('-$100.00');
  });
});

describe('parseMoney', () => {
  it('should extract money with precedence order', () => {
    const obj = {
      extracted_before_taxes_fees: 555,
      extracted_lowest: 600,
      rate: 700,
      price: 800,
      amount: 900
    };
    
    expect(parseMoney(obj)).toBe(555); // Should prefer extracted_before_taxes_fees
  });

  it('should fallback to extracted_lowest', () => {
    const obj = {
      extracted_lowest: 600,
      rate: 700,
      price: 800
    };
    
    expect(parseMoney(obj)).toBe(600);
  });

  it('should handle null/undefined gracefully', () => {
    expect(parseMoney(null)).toBeUndefined();
    expect(parseMoney(undefined)).toBeUndefined();
    expect(parseMoney({})).toBeUndefined();
  });

  it('should handle edge cases', () => {
    expect(parseMoney({ rate: 0 })).toBe(0);
    expect(parseMoney({ price: 'invalid' })).toBe('invalid');
  });
});
