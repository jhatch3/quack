import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';
import { useSolBalance } from '@/hooks/useSolBalance';
import { useUSDCBalance } from '@/hooks/useUSDCBalance';

export const WalletConnectButton = () => {
  const { connected, publicKey } = useWallet();
  const { balance: solBalance, loading: solLoading, error: solError } = useSolBalance();
  const { balance: usdcBalance, loading: usdcLoading, error: usdcError } = useUSDCBalance();

  const isLoading = solLoading || usdcLoading;
  const hasError = solError || usdcError;

  return (
    <div className="flex items-center gap-4">
      {connected && publicKey && (
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="text-sm text-muted-foreground">Connected Wallet</div>
          <div className="flex items-center gap-2 text-sm font-mono">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-foreground">
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {isLoading ? (
              'Loading balance...'
            ) : hasError ? (
              'Error fetching balance'
            ) : (
              <>
                {solBalance !== null && `${solBalance.toFixed(4)} SOL`}
                {solBalance !== null && usdcBalance !== null && ' • '}
                {usdcBalance !== null && `${usdcBalance.toFixed(2)} USDC`}
                {solBalance === null && usdcBalance === null && 'Balance unavailable'}
              </>
            )}
          </div>
        </div>
      )}
      <WalletMultiButton className="!bg-gradient-solana hover-glow-primary !rounded-lg !h-10 !px-6 !font-medium !transition-all" />
    </div>
  );
};
