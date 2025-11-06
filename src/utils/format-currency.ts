/**
 * Formats a number as UK currency (£)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "£12.99")
 */
export const formatCurrency = (amount: number): string => {
  return `£${amount.toFixed(2)}`;
};

