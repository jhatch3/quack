import { Card } from '@/components/ui/card';

const Governance = () => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12 max-w-6xl">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-solana bg-clip-text text-transparent">
          AI Governance
        </h1>
        <p className="text-muted-foreground text-lg">
          Real-time AI agent proposals and decision-making
        </p>
      </div>

      <Card className="glass-card p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">No Active Proposals</h3>
        <p className="text-muted-foreground mb-4">
          AI agent proposals and governance decisions will appear here once the vault is operational.
        </p>
        <p className="text-sm text-muted-foreground">
          All proposals will be fetched from on-chain governance contracts and displayed in real-time.
        </p>
      </Card>

      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">How AI Governance Works</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Our AI hedge fund uses a multi-agent consensus system where five specialized agents analyze market opportunities independently.
          </p>
          <p>
            Each agent votes YES or NO on proposed trades based on their domain expertise. A proposal requires majority approval (3/5) to be executed.
          </p>
          <p>
            All reasoning, data sources, and decision transcripts are transparently recorded on-chain and stored on IPFS for full auditability.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Governance;
