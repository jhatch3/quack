import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useSolBalance } from '@/hooks/useSolBalance';

export const DepositCard = () => {
  const { connected, publicKey } = useWallet();
  const { balance, loading, error } = useSolBalance();
  const [depositAmount, setDepositAmount] = useState('');

  // Debug logging
  useEffect(() => {
    if (connected && publicKey) {
      console.log('[DepositCard] Balance state:', { balance, loading, error, connected });
    }
  }, [balance, loading, error, connected, publicKey]);

  const vaultSharePrice = 1.0847;
  const estimatedShares = depositAmount ? (parseFloat(depositAmount) / vaultSharePrice).toFixed(4) : '0';

  const handleDeposit = () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    // Mock deposit action
    toast.success(`Deposit of ${depositAmount} SOL initiated!`, {
      description: `You will receive approximately ${estimatedShares} vault shares`,
    });
    setDepositAmount('');
  };

  return (
    <Card className="border border-border/50 bg-card p-6 sm:p-8 lg:p-10">
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Deposit Amount</h2>
          <p className="text-sm text-muted-foreground">
            Enter the amount of SOL you want to deposit into the vault
          </p>
        </div>

        {/* Available Balance */}
        <div className="p-5 rounded-xl bg-muted/20 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Available Balance
            </span>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </div>
          {connected && publicKey ? (
            <>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <span className="text-muted-foreground animate-pulse">Loading...</span>
                ) : balance !== null && balance !== undefined ? (
                  balance.toFixed(4)
                ) : error ? (
                  <span className="text-yellow-500 text-xl">Error loading</span>
                ) : (
                  <span className="text-muted-foreground">0.0000</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {error ? 'Check console for details' : 'SOL'}
              </div>
              {error && (
                <div className="text-xs text-yellow-500 mt-2">
                  {error.message.includes('rate limit') 
                    ? 'RPC rate limit. Use custom RPC endpoint.' 
                    : 'Unable to fetch balance'}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-muted-foreground">
                Connect Wallet
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Connect your wallet to see balance
              </div>
            </>
          )}
        </div>

        {/* Deposit Input Section */}
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Amount to Deposit</label>
              <span className="text-xs text-muted-foreground font-medium">SOL</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="text-4xl font-bold h-20 pr-24 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                step="0.01"
                min="0"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <span className="text-xl font-semibold text-muted-foreground">SOL</span>
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDepositAmount('1')}
                className="flex-1 h-9 text-sm font-medium hover:bg-muted/50"
              >
                1 SOL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDepositAmount('5')}
                className="flex-1 h-9 text-sm font-medium hover:bg-muted/50"
              >
                5 SOL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (balance !== null) {
                    setDepositAmount(balance.toFixed(4));
                  }
                }}
                className="flex-1 h-9 text-sm font-medium hover:bg-muted/50"
                disabled={balance === null || loading}
              >
                MAX
              </Button>
            </div>
          </div>


          {/* Estimated Shares Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">You'll Receive</label>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-border/50">
              <div className="text-4xl font-bold text-foreground mb-2">{estimatedShares}</div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Vault Shares</span> @ {vaultSharePrice.toFixed(4)} SOL per share
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Button */}
        <Button
          className="w-full h-14 bg-gradient-evergreen hover:opacity-90 text-lg font-semibold text-white shadow-xl hover:shadow-2xl transition-all"
          onClick={handleDeposit}
          disabled={!connected || !depositAmount || parseFloat(depositAmount) <= 0}
        >
          {connected ? 'Deposit SOL' : 'Connect Wallet to Continue'}
        </Button>
      </div>
    </Card>
  );
};
