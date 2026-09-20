'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedCurrency, CURRENCIES, formatPrice, convertFromINR } from '@/lib/currency';

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  format: (amountInINR: number) => string;
  convert: (amountInINR: number) => number;
  currencies: typeof CURRENCIES;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'INR',
  setCurrency: () => {},
  format: (amount) => formatPrice(amount, 'INR'),
  convert: (amount) => amount,
  currencies: CURRENCIES,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<SupportedCurrency>('INR');

  useEffect(() => {
    const saved = localStorage.getItem('farefinder_currency') as SupportedCurrency;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: SupportedCurrency) => {
    setCurrencyState(c);
    localStorage.setItem('farefinder_currency', c);
  };

  const format = (amountInINR: number) => formatPrice(amountInINR, currency);
  const convert = (amountInINR: number) => convertFromINR(amountInINR, currency);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format,
        convert,
        currencies: CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
