const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface UserDeposit {
  walletAddress: string;
  depositedAmount: number;
}

export const fetchUserDeposit = async (walletAddress: string): Promise<number> => {
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/api/users/${walletAddress}/deposit`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      // If user doesn't exist or endpoint not available, return 0
      return 0;
    }
    const data = await response.json();
    return data.depositedAmount || 0;
  } catch (error: unknown) {
    // Suppress connection errors (expected when backend is not running)
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isConnectionError = 
      (error instanceof TypeError && errorMessage.includes('Failed to fetch')) ||
      errorMessage.includes('ERR_CONNECTION_REFUSED') ||
      errorMessage.includes('aborted') ||
      error instanceof DOMException; // AbortError
    
    // Only log non-connection errors in development
    if (import.meta.env.DEV && !isConnectionError) {
      console.warn('Error fetching user deposit:', error);
    }
    // Default to 0 if API is not available (expected when backend is not running)
    return 0;
  }
};

