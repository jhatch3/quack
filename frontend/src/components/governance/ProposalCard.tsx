import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface ProposalCardProps {
  market: string;
  direction: 'LONG' | 'SHORT';
  positionSize: string;
  confidence: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  summary: string;
  timestamp: string;
  betStatus: 'OPEN' | 'CLOSED';
  betResult?: 'WIN' | 'LOSS';
  closedAt?: string;
}

export const ProposalCard = ({
  market,
  direction,
  positionSize,
  confidence,
  status,
  summary,
  timestamp,
  betStatus,
  betResult,
  closedAt,
}: ProposalCardProps) => {
  const statusColors = {
    PENDING: 'bg-yellow-500/20 text-yellow-500',
    APPROVED: 'bg-green-500/20 text-green-500',
    REJECTED: 'bg-red-500/20 text-red-500',
    EXECUTED: 'bg-blue-500/20 text-blue-500',
  };

  const directionColors = {
    LONG: 'bg-green-500/20 text-green-500',
    SHORT: 'bg-red-500/20 text-red-500',
  };

  const betStatusTextColors = {
    OPEN: 'text-blue-500',
    CLOSED: 'text-gray-500',
  };

  const betResultTextColors = {
    WIN: 'text-green-500',
    LOSS: 'text-red-500',
  };

  return (
    <Card className="glass-card p-6 hover-glow-secondary transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-evergreen-glow flex items-center justify-center">
            {betStatus === 'CLOSED' && betResult ? (
              // Show result-based color
              betResult === 'WIN' ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500" />
              )
            ) : (
              // Show direction-based color for open/rejected bets
              direction === 'LONG' ? (
                <TrendingUp className="w-6 h-6 text-green-500" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-500" />
              )
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">{market}</h3>
            <div className="text-sm text-muted-foreground">
              {new Date(timestamp).toLocaleString()}
            </div>
          </div>
        </div>
        <Badge className={statusColors[status]}>{status}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Position Size</div>
          <div className="text-lg font-bold text-foreground">{positionSize}</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Confidence</div>
          <div className="text-lg font-bold text-primary">{confidence}%</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Bet Status</div>
          <div className="font-semibold flex flex-col gap-1">
            <span className={`text-base ${betStatusTextColors[betStatus]}`}>
              {betStatus === 'OPEN' ? 'Open Bet' : 'Closed Bet'}
            </span>
            {betStatus === 'CLOSED' && betResult && (
              <div className="flex items-center gap-1 mt-1">
                {betResult === 'WIN' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${betResultTextColors[betResult]}`}>
                  {betResult === 'WIN' ? 'Won' : 'Lost'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border mb-4">
        <p className="text-sm leading-relaxed">{summary}</p>
      </div>

      <a
        href="https://polymarket.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
      >
        <span className="text-sm font-medium">View on Polymarket</span>
        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </Card>
  );
};
