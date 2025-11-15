/**
 * Utility functions to verify balance data integrity
 */

/**
 * Verifies that a balance value is valid
 */
export const isValidBalance = (balance: number | null): boolean => {
  if (balance === null) return false;
  if (isNaN(balance)) return false;
  if (balance < 0) return false;
  if (balance > 1_000_000_000) return false; // Sanity check: unlikely to have > 1B SOL
  return true;
};

/**
 * Formats balance for display with proper precision
 */
export const formatBalance = (balance: number | null, decimals: number = 4): string => {
  if (balance === null || !isValidBalance(balance)) {
    return 'N/A';
  }
  return balance.toFixed(decimals);
};

/**
 * Calculates USD value from SOL balance
 */
export const calculateUSDValue = (solBalance: number | null, solPrice: number = 150): number | null => {
  if (solBalance === null || !isValidBalance(solBalance)) {
    return null;
  }
  return solBalance * solPrice;
};

/**
 * Verifies that balance has been updated recently (within last 10 seconds)
 */
export const isBalanceFresh = (lastUpdate: number | null): boolean => {
  if (lastUpdate === null) return false;
  const now = Date.now();
  const tenSeconds = 10 * 1000;
  return (now - lastUpdate) < tenSeconds;
};

