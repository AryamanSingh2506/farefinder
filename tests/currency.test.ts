import { describe, it, expect } from 'vitest';
import { convertFromINR, formatPrice } from '@/lib/currency';

describe('Multi-Currency Engine', () => {
  it('formats Indian Rupee (INR) with standard symbol and formatting', () => {
    const formatted = formatPrice(4620, 'INR');
    expect(formatted).toBe('₹4,620');
  });

  it('converts and formats US Dollar (USD)', () => {
    const converted = convertFromINR(8600, 'USD');
    expect(converted).toBeGreaterThan(90);
    expect(converted).toBeLessThan(110);

    const formatted = formatPrice(8600, 'USD');
    expect(formatted).toContain('$');
  });

  it('converts and formats Euro (EUR)', () => {
    const formatted = formatPrice(9200, 'EUR');
    expect(formatted).toContain('€');
  });

  it('converts and formats British Pound (GBP)', () => {
    const formatted = formatPrice(11000, 'GBP');
    expect(formatted).toContain('£');
  });

  it('converts and formats UAE Dirham (AED)', () => {
    const formatted = formatPrice(4620, 'AED');
    expect(formatted).toContain('AED');
  });

  it('converts and formats Singapore Dollar (SGD)', () => {
    const formatted = formatPrice(6500, 'SGD');
    expect(formatted).toContain('S$');
  });
});
