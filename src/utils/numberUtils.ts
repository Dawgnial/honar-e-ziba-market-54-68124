
// Utility function to convert numbers to Farsi digits
export const toFarsiNumber = (num: number | string): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => farsiDigits[parseInt(digit)]);
};

// Utility function to format price with Farsi numbers
export const formatPriceToFarsi = (price: number): string => {
  return toFarsiNumber(price.toLocaleString());
};
