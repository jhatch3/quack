import { DepositCard } from '@/components/DepositCard';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchUserDeposit } from '@/lib/api';

const Deposit = () => {
  const { publicKey } = useWallet();
  const [depositedAmount, setDepositedAmount] = useState<number>(0);

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
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-solana bg-clip-text text-transparent">
          Deposit SOL
        </h1>
        <p className="text-muted-foreground text-lg">
          Stake your SOL and let AI agents trade on your behalf
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Deposit Card */}
        <div className="lg:col-span-1">
          <DepositCard />
        </div>

        {/* Right Column - Vault Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Deposit Status</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Deposited</div>
                <div className="text-2xl font-bold">
                  {depositedAmount > 0 ? `${depositedAmount.toFixed(4)} SOL` : '0.0000 SOL'}
                </div>
              </div>
              {depositedAmount === 0 && (
                <p className="text-sm text-muted-foreground">
                  You haven't made any deposits yet. Use the deposit form to stake your SOL.
                </p>
              )}
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Important Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="text-yellow-500 font-bold">⚠️</span>
                <div>
                  <p className="font-medium mb-1">No Withdrawals or Redemptions</p>
                  <p className="text-muted-foreground">
                    Once deposited, your SOL is committed to the vault. There is no mechanism to withdraw or redeem your position.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-500 font-bold">ℹ️</span>
                <div>
                  <p className="font-medium mb-1">AI-Managed Trading</p>
                  <p className="text-muted-foreground">
                    Your funds will be actively managed by our multi-agent AI system across Solana DeFi markets including perps, spot, and options.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <p className="font-medium mb-1">Vault Share Tokens</p>
                  <p className="text-muted-foreground">
                    You receive vault share tokens representing your proportional ownership. Share price increases with profitable trades.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
