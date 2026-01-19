export const currencies = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar', country: 'United States' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro', country: 'Europe' },
  INR: { symbol: '₹', rate: 83.12, name: 'Indian Rupee', country: 'India' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound', country: 'United Kingdom' },
  AED: { symbol: 'د.إ', rate: 3.67, name: 'UAE Dirham', country: 'UAE' },
  AUD: { symbol: 'A$', rate: 1.53, name: 'Australian Dollar', country: 'Australia' },
  CAD: { symbol: 'C$', rate: 1.36, name: 'Canadian Dollar', country: 'Canada' },
  SGD: { symbol: 'S$', rate: 1.34, name: 'Singapore Dollar', country: 'Singapore' },
};

export const countryToCurrency = {
  'United States': 'USD',
  'Europe': 'EUR',
  'India': 'INR',
  'United Kingdom': 'GBP',
  'UAE': 'AED',
  'Australia': 'AUD',
  'Canada': 'CAD',
  'Singapore': 'SGD',
};

export const convertPrice = (price, fromCurrency, toCurrency) => {
  const basePrice = price / currencies[fromCurrency].rate;
  return basePrice * currencies[toCurrency].rate;
};

export const formatPrice = (price, currency) => {
  const { symbol } = currencies[currency];
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${symbol}${formattedNumber}`;
};
