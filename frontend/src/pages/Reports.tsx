import { Card } from '@/components/ui/card';

const Reports = () => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-solana bg-clip-text text-transparent">
          Performance Reports
        </h1>
        <p className="text-muted-foreground text-lg">
          Daily trading reports with IPFS archives
        </p>
      </div>

      <Card className="glass-card p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">No Reports Available</h3>
        <p className="text-muted-foreground mb-4">
          Daily performance reports will appear here once the vault begins trading operations.
        </p>
        <p className="text-sm text-muted-foreground">
          Reports will be fetched from on-chain sources and IPFS archives, showing real trading activity and performance metrics.
        </p>
      </Card>

      {/* Report Archive Info */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Report Archive Information</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            All daily performance reports are archived on IPFS (InterPlanetary File System) for permanent, decentralized storage and verification.
          </p>
          <p>
            Each report includes comprehensive trade logs, agent decision transcripts, risk metrics, and performance analytics.
          </p>
          <p>
            Reports are immutable once published, ensuring complete transparency and auditability of all trading activity.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
