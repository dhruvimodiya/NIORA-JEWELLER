import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { currencies, convertPrice, formatPrice } from '../utils/currency';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const savedCurrency = storage.get('currency');
    if (savedCurrency && currencies[savedCurrency]) {
      setCurrency(savedCurrency);
    }
  }, []);

  const changeCurrency = (newCurrency) => {
    if (currencies[newCurrency]) {
      setCurrency(newCurrency);
      storage.set('currency', newCurrency);
    }
  };

  const convert = (price, fromCurrency = 'USD') => {
    return convertPrice(price, fromCurrency, currency);
  };

  const format = (price) => {
    return formatPrice(price, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        convert,
        format,
        currencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
