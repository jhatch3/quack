import { Card } from '@/components/ui/card';

const Agents = () => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-solana bg-clip-text text-transparent">
          AI Trading Agents
        </h1>
        <p className="text-muted-foreground text-lg">
          Five specialized agents powering autonomous trading
        </p>
      </div>

      <Card className="glass-card p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">Agent Information</h3>
        <p className="text-muted-foreground mb-4">
          Agent profiles, performance metrics, and live debate transcripts will be displayed here once the vault is operational.
        </p>
        <p className="text-sm text-muted-foreground">
          All agent data will be fetched from on-chain sources and AI system logs.
        </p>
      </Card>

      {/* System Architecture */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Multi-Agent Architecture</h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Our AI trading system employs a multi-agent debate framework where specialized agents with distinct roles analyze market opportunities from different perspectives.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Consensus Mechanism</h4>
              <p>Agents vote YES/NO on proposals. Majority consensus (3/5) required for execution.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Risk Management</h4>
              <p>Risk Manager agent has veto power on proposals exceeding portfolio heat thresholds.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Data Sources</h4>
              <p>Agents pull data from Snowflake data warehouse, on-chain feeds, and sentiment APIs.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Transparency</h4>
              <p>All agent reasoning, votes, and data sources recorded on-chain for full auditability.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Agents;
