import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface UseSolBalanceReturn {
  balance: number | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch and maintain SOL balance from connected wallet
 * Automatically updates every 5 seconds
 */
export const useSolBalance = (): UseSolBalanceReturn => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connection) {
        setBalance(null);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const lamports = await connection.getBalance(publicKey);
        const solBalance = lamports / LAMPORTS_PER_SOL;
        setBalance(solBalance);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch balance');
        console.error('Error fetching SOL balance:', error);
        setError(error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    
    // Poll balance every 5 seconds
    const interval = setInterval(fetchBalance, 5000);
    
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return { balance, loading, error };
};

