import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export interface WalletAsset {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  uiAmount: number;
  isNative: boolean; // true for SOL
}

interface UseWalletAssetsReturn {
  assets: WalletAsset[];
  loading: boolean;
  error: Error | null;
  totalValueUSD: number;
}

/**
 * Custom hook to fetch all assets (SOL + SPL tokens) from connected wallet
 * Automatically updates every 10 seconds
 */
export const useWalletAssets = (): UseWalletAssetsReturn => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalValueUSD, setTotalValueUSD] = useState(0);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!publicKey || !connection) {
        setAssets([]);
        setLoading(false);
        setError(null);
        setTotalValueUSD(0);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const allAssets: WalletAsset[] = [];

        // Fetch SOL balance
        try {
          const lamports = await connection.getBalance(publicKey);
          const solBalance = lamports / LAMPORTS_PER_SOL;
          if (solBalance > 0) {
            allAssets.push({
              mint: 'So11111111111111111111111111111111111111112',
              symbol: 'SOL',
              name: 'Solana',
              balance: lamports,
              decimals: 9,
              uiAmount: solBalance,
              isNative: true,
            });
          }
        } catch (err) {
          console.error('Error fetching SOL balance:', err);
        }

        // Fetch all SPL token accounts
        try {
          const tokenProgramId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: tokenProgramId,
          });

          for (const account of tokenAccounts.value) {
            const tokenAmount = account.account.data.parsed.info.tokenAmount;
            const mint = account.account.data.parsed.info.mint;
            
            // Only include tokens with balance > 0
            if (tokenAmount.uiAmount > 0) {
              // Try to get token metadata (name, symbol) from common sources
              // For now, we'll use the mint address and try to identify common tokens
              const tokenInfo = getTokenInfo(mint);
              
              allAssets.push({
                mint: mint,
                symbol: tokenInfo.symbol,
                name: tokenInfo.name,
                balance: tokenAmount.amount,
                decimals: tokenAmount.decimals,
                uiAmount: tokenAmount.uiAmount || 0,
                isNative: false,
              });
            }
          }
        } catch (err) {
          console.error('Error fetching token accounts:', err);
        }

        // Sort assets: SOL first, then by balance (highest first)
        allAssets.sort((a, b) => {
          if (a.isNative) return -1;
          if (b.isNative) return 1;
          return b.uiAmount - a.uiAmount;
        });

        setAssets(allAssets);

        // Calculate total USD value (rough estimate)
        // SOL at ~$150, USDC at $1, others at $0 for now
        let total = 0;
        for (const asset of allAssets) {
          if (asset.symbol === 'SOL') {
            total += asset.uiAmount * 150; // Approximate SOL price
          } else if (asset.symbol === 'USDC' || asset.symbol === 'USDT') {
            total += asset.uiAmount; // Stablecoins at $1
          }
        }
        setTotalValueUSD(total);

      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch wallet assets');
        console.error('Error fetching wallet assets:', error);
        setError(error);
        setAssets([]);
        setTotalValueUSD(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
    
    // Poll assets every 10 seconds
    const interval = setInterval(fetchAssets, 10000);
    
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return { assets, loading, error, totalValueUSD };
};

/**
 * Get token info (name, symbol) from mint address
 * This is a simplified version - in production, you'd fetch from token metadata
 */
function getTokenInfo(mint: string): { name: string; symbol: string } {
  // Common token mint addresses
  const tokenMap: Record<string, { name: string; symbol: string }> = {
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { name: 'USD Coin', symbol: 'USDC' },
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { name: 'Tether USD', symbol: 'USDT' },
    '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU': { name: 'USD Coin (Devnet)', symbol: 'USDC' },
    'So11111111111111111111111111111111111111112': { name: 'Solana', symbol: 'SOL' },
  };

  if (tokenMap[mint]) {
    return tokenMap[mint];
  }

  // Default: use first 4 chars of mint as symbol
  return {
    name: 'Unknown Token',
    symbol: mint.slice(0, 4) + '...',
  };
}

