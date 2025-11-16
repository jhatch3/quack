/**
 * EXAMPLE: How to fetch and display positions from the backend
 * 
 * This shows how to use the fetchCurrentPositions function in a React component
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { fetchCurrentPositions, Position } from '@/lib/api';

const PositionsTable = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPositions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchCurrentPositions();
        setPositions(data);
      } catch (err) {
        setError('Failed to load positions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPositions();
    
    // Optionally: Refresh every 10 seconds for real-time updates
    const interval = setInterval(loadPositions, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center py-8 text-muted-foreground">
          Loading positions...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      </Card>
    );
  }

  if (positions.length === 0) {
    return (
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Current Open Positions</h3>
        <div className="text-center py-8 text-muted-foreground">
          No open positions
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Current Open Positions</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Market</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Side</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Entry</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Current</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">PnL</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-medium">{position.market}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    position.side === 'LONG' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {position.side}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">{position.size}</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{position.entryPrice}</td>
                <td className="py-3 px-4 text-right">{position.currentPrice}</td>
                <td className="py-3 px-4 text-right">
                  <div className="text-green-500 font-medium">{position.pnl}</div>
                  <div className="text-xs text-muted-foreground">{position.pnlValue}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PositionsTable;

