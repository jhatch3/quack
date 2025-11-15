/**
 * Development component to verify balance data is being fetched correctly
 * Shows detailed information about balance fetching status
 */

import { useSolBalance } from '@/hooks/useSolBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from './ui/card';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { isValidBalance, formatBalance } from '@/utils/balanceVerification';

export const BalanceVerification = () => {
  const { publicKey, connected } = useWallet();
  const { balance, loading, error } = useSolBalance();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const isBalanceValid = isValidBalance(balance);
  const hasWallet = connected && publicKey !== null;
  const hasError = error !== null;

  return (
    <Card className="p-4 mb-4 border-2 border-dashed">
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <AlertCircle className="w-4 h-4" />
          Balance Verification (Dev Only)
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            {hasWallet ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span>Wallet Connected: {hasWallet ? 'Yes' : 'No'}</span>
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
            <span>Loading: {loading ? 'Yes' : 'No'}</span>
          </div>

          <div className="flex items-center gap-2">
            {isBalanceValid ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span>Balance Valid: {isBalanceValid ? 'Yes' : 'No'}</span>
          </div>

          <div className="flex items-center gap-2">
            {hasError ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
            <span>Error: {hasError ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="pt-2 border-t space-y-1 text-xs">
          <div>
            <span className="text-muted-foreground">Raw Balance: </span>
            <span className="font-mono">{balance !== null ? balance.toString() : 'null'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Formatted: </span>
            <span className="font-mono">{formatBalance(balance)} SOL</span>
          </div>
          {error && (
            <div className="text-red-500">
              <span className="text-muted-foreground">Error: </span>
              {error.message}
            </div>
          )}
          {publicKey && (
            <div>
              <span className="text-muted-foreground">Wallet: </span>
              <span className="font-mono text-xs">{publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

