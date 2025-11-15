import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from '@/components/ui/card';
import { Wallet, Coins, DollarSign } from 'lucide-react';
import { fetchUserDeposit } from '@/lib/api';
import { useSolBalance } from '@/hooks/useSolBalance';
import { useUSDCBalance } from '@/hooks/useUSDCBalance';
import { BalanceVerification } from '@/components/BalanceVerification';
import { WalletAssets } from '@/components/WalletAssets';

const Profile = () => {
  const { publicKey } = useWallet();
  const { balance: solBalance, loading: solLoading } = useSolBalance();
  const { balance: usdcBalance, loading: usdcLoading } = useUSDCBalance();
  const [depositedAmount, setDepositedAmount] = useState<number>(0);

  // Fetch deposited amount from backend
  useEffect(() => {
    const fetchDeposit = async () => {
      if (!publicKey) {
        setDepositedAmount(0);
        return;
      }

      // fetchUserDeposit handles errors internally and returns 0
      const deposit = await fetchUserDeposit(publicKey.toString());
      setDepositedAmount(deposit);
    };

    fetchDeposit();
  }, [publicKey]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-solana bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Personal vault statistics and performance
          </p>
        </div>

        {/* Balance Verification (Dev Only) */}
        <BalanceVerification />

        {/* Wallet Info Card */}
        <Card className="glass-card p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-solana-glow flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Wallet Address</div>
              <div className="font-mono text-lg">
                {publicKey ? publicKey.toString() : 'Not Connected'}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-border">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coins className="w-4 h-4" />
                <span className="text-sm">SOL Balance</span>
              </div>
              <div className="text-3xl font-bold">
                {!publicKey ? (
                  <span className="text-muted-foreground">Connect Wallet</span>
                ) : solLoading ? (
                  <span className="text-muted-foreground">Loading...</span>
                ) : solBalance !== null ? (
                  `${solBalance.toFixed(4)} SOL`
                ) : (
                  <span className="text-muted-foreground">Unable to fetch</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {solBalance !== null && !solLoading && publicKey
                  ? `≈ $${(solBalance * 150).toFixed(2)} USD`
                  : ''}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">USDC Balance</span>
              </div>
              <div className="text-3xl font-bold">
                {!publicKey ? (
                  <span className="text-muted-foreground">Connect Wallet</span>
                ) : usdcLoading ? (
                  <span className="text-muted-foreground">Loading...</span>
                ) : usdcBalance !== null ? (
                  `${usdcBalance.toFixed(2)} USDC`
                ) : (
                  <span className="text-muted-foreground">Unable to fetch</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {usdcBalance !== null && !usdcLoading && publicKey
                  ? `≈ $${usdcBalance.toFixed(2)} USD`
                  : ''}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coins className="w-4 h-4" />
                <span className="text-sm">Deposited in App</span>
              </div>
              <div className="text-3xl font-bold">
                {depositedAmount > 0 ? `${depositedAmount.toFixed(4)} SOL` : '0.0000 SOL'}
              </div>
              <div className="text-sm text-muted-foreground">
                {depositedAmount > 0 ? `≈ $${(depositedAmount * 150).toFixed(2)} USD` : 'No deposits yet'}
              </div>
            </div>
          </div>
        </Card>

        {/* All Wallet Assets */}
        <WalletAssets />

        {depositedAmount > 0 && (
          <>
            <Card className="glass-card p-8">
              <h3 className="text-2xl font-semibold mb-4">Deposit Information</h3>
              <p className="text-muted-foreground">
                Deposit history and performance data will appear here once you make a deposit.
              </p>
            </Card>
          </>
        )}

        {depositedAmount === 0 && (
          <Card className="glass-card p-8">
            <h3 className="text-2xl font-semibold mb-4">No Deposits Yet</h3>
            <p className="text-muted-foreground">
              Visit the Deposit page to stake your SOL and start earning returns.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
