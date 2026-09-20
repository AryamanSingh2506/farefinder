export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateFromINR: number; // 1 INR in target currency
}

// Indicative exchange rates (Base currency: INR)
// In production, this can fetch from OpenExchangeRates / RBI API
export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rateFromINR: 1.0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateFromINR: 0.0116, // approx ₹86 per USD
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateFromINR: 0.0108, // approx ₹92 per EUR
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateFromINR: 0.0091, // approx ₹110 per GBP
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    rateFromINR: 0.0427, // approx ₹23.4 per AED
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    rateFromINR: 0.0152, // approx ₹65.7 per SGD
  },
};

export function convertFromINR(amountInINR: number, targetCurrency: SupportedCurrency): number {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.INR;
  const converted = amountInINR * config.rateFromINR;
  if (targetCurrency === 'INR') {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

export function formatPrice(amountInINR: number, currency: SupportedCurrency = 'INR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = convertFromINR(amountInINR, currency);

  if (currency === 'INR') {
    // Format Indian Numbering system e.g. ₹4,620 or ₹12,500
    return `${config.symbol}${converted.toLocaleString('en-IN')}`;
  }

  return `${config.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
