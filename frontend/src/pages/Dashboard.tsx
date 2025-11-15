import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchUserDeposit } from '@/lib/api';
import { useSolBalance } from '@/hooks/useSolBalance';
import { useUSDCBalance } from '@/hooks/useUSDCBalance';
import { WalletAssets } from '@/components/WalletAssets';

const Dashboard = () => {
  const { publicKey } = useWallet();
  const { balance: solBalance } = useSolBalance();
  const { balance: usdcBalance } = useUSDCBalance();
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
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Real-time vault performance and AI trading activity
        </p>
      </div>

      {!publicKey ? (
        <Card className="glass-card p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Connect Your Wallet</h3>
          <p className="text-muted-foreground">
            Please connect your wallet to view your dashboard and vault statistics.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">SOL Balance</h3>
              <div className="text-3xl font-bold mb-2">
                {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Loading...'}
              </div>
              <p className="text-sm text-muted-foreground">
                {solBalance !== null ? `≈ $${(solBalance * 150).toFixed(2)} USD` : ''}
              </p>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">USDC Balance</h3>
              <div className="text-3xl font-bold mb-2">
                {usdcBalance !== null ? `${usdcBalance.toFixed(2)} USDC` : 'Loading...'}
              </div>
              <p className="text-sm text-muted-foreground">
                {usdcBalance !== null ? `≈ $${usdcBalance.toFixed(2)} USD` : ''}
              </p>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Deposited in Vault</h3>
              <div className="text-3xl font-bold mb-2">
                {depositedAmount > 0 ? `${depositedAmount.toFixed(4)} SOL` : '0.0000 SOL'}
              </div>
              <p className="text-sm text-muted-foreground">
                {depositedAmount > 0 ? `≈ $${(depositedAmount * 150).toFixed(2)} USD` : 'No deposits yet'}
              </p>
            </Card>
          </div>

          {/* All Wallet Assets */}
          <WalletAssets />

          {depositedAmount === 0 && (
            <Card className="glass-card p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">No Vault Activity Yet</h3>
              <p className="text-muted-foreground mb-4">
                Vault statistics, positions, and performance data will appear here once you make a deposit.
              </p>
              <p className="text-sm text-muted-foreground">
                Visit the Deposit page to stake your SOL and start earning returns.
              </p>
            </Card>
          )}

          {depositedAmount > 0 && (
            <Card className="glass-card p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">Vault Statistics</h3>
              <p className="text-muted-foreground">
                Detailed vault performance metrics, positions, and trading activity will be displayed here.
                This data will be fetched from on-chain sources once the vault is operational.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
