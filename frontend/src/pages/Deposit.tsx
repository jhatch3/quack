import { DepositCard } from '@/components/DepositCard';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  fetchUserDeposit,
  fetchVaultStats,
  type VaultStats,
} from '@/lib/api';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Deposit = () => {
  const { publicKey } = useWallet();
  const [depositedAmount, setDepositedAmount] = useState<number>(0);
  const [vaultStats, setVaultStats] = useState<VaultStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      
      const [deposit, stats] = await Promise.all([
        publicKey ? fetchUserDeposit(publicKey.toString()) : Promise.resolve(0),
        fetchVaultStats(publicKey?.toString()),
      ]);

      setDepositedAmount(deposit);
      setVaultStats(stats);
      setLoading(false);
    };

    fetchAllData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Deposit SOL
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Add SOL to your vault and start earning with AI-powered trading strategies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Main Deposit Section - Takes 3 columns */}
          <div className="lg:col-span-3">
            <DepositCard />
          </div>

          {/* Sidebar - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vault Stats Card */}
            {!loading && vaultStats && (
              <Card className="border border-border/50 bg-card p-6">
                <h3 className="text-base font-semibold text-foreground mb-5">Vault Overview</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-4 border-b border-border/30">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Total Value Locked
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        ${vaultStats.totalValueLocked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Share Price
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {vaultStats.vaultSharePrice.toFixed(4)} SOL
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Important Info Card */}
            <Card className="border border-border/50 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-5">Important Information</h3>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1.5">No Withdrawals</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Deposits are final. There is no mechanism to withdraw or redeem your position once deposited.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1.5">AI-Managed Trading</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your funds are actively managed by our multi-agent AI system across Solana DeFi markets.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1.5">Vault Share Tokens</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You receive vault share tokens representing your proportional ownership in the vault.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
