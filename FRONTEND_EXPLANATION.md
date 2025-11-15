# Frontend Architecture & Backend Integration Guide

## Frontend Overview

The frontend is a **React + TypeScript** application built with:
- **Vite** as the build tool (runs on port 8080)
- **React Router** for navigation
- **TanStack Query (React Query)** for data fetching and caching
- **Solana Wallet Adapter** for wallet connectivity
- **shadcn/ui** components for the UI
- **Recharts** for data visualization
- **TailwindCSS** for styling

## Current Architecture

### App Structure (`src/App.tsx`)
- Wraps the app with providers:
  - `QueryClientProvider` - for React Query data fetching
  - `SolanaWalletProvider` - for Solana wallet connection
  - `WalletContextProvider` - custom wallet context
  - `BrowserRouter` - for routing
- Implements protected routes that require onboarding completion

### Pages

1. **Landing** (`/`) - Entry point, onboarding
2. **Dashboard** (`/dashboard`) - Vault overview, metrics, charts, positions
3. **Profile** (`/profile`) - User-specific stats, NAV chart, agent commentary
4. **Deposit** (`/deposit`) - Deposit SOL interface, vault stats, TVL chart
5. **Governance** (`/governance`) - AI proposals, agent reasoning, voting
6. **Agents** (`/agents`) - Agent personas, live debate transcripts
7. **Reports** (`/reports`) - Daily performance reports with IPFS links

### Current Data Source

**All pages currently use mock data** from `src/lib/mockData.ts`:
- `vaultStats` - Vault metrics (TVL, depositors, win rate, PnL)
- `userProfile` - User-specific data (deposits, shares, yield)
- `navHistory` - NAV over time data
- `tvlHistory` - TVL over time data
- `marketAllocations` - Market type allocations
- `pnlHistogram` - PnL distribution
- `currentPositions` - Open trading positions
- `aiProposals` - Governance proposals
- `agentPersonas` - AI agent information
- `debateTranscript` - Agent debate messages
- `dailyReports` - Performance reports

## Backend Integration Strategy

### API Endpoints Needed

Based on the frontend pages, you'll need these backend endpoints:

#### 1. Dashboard Data
- `GET /api/vault/stats` - Vault statistics
- `GET /api/vault/nav/history` - NAV history over time
- `GET /api/vault/allocations` - Market allocations
- `GET /api/vault/pnl/distribution` - PnL histogram data
- `GET /api/positions/current` - Current open positions

#### 2. Profile Data
- `GET /api/user/profile` - User profile (requires wallet address)
- `GET /api/user/nav/history` - User's NAV history
- `GET /api/user/commentary` - AI agent commentary for user

#### 3. Deposit Data
- `GET /api/vault/stats` - Vault statistics (reused)
- `GET /api/vault/tvl/history` - TVL history
- `POST /api/vault/deposit` - Create deposit transaction
- `GET /api/user/deposits` - User's deposit history

#### 4. Governance Data
- `GET /api/governance/proposals` - List of AI proposals
- `GET /api/governance/proposals/:id` - Single proposal details
- `POST /api/governance/proposals/:id/vote` - Submit vote
- `GET /api/governance/proposals/:id/reasoning` - Agent reasoning

#### 5. Agents Data
- `GET /api/agents` - List of agent personas
- `GET /api/agents/debate/:proposalId` - Debate transcript for proposal
- `GET /api/agents/debate/live` - Live debate transcript

#### 6. Reports Data
- `GET /api/reports/daily` - List of daily reports
- `GET /api/reports/daily/:date` - Specific daily report
- `GET /api/reports/summary` - Summary statistics

### Authentication

The frontend uses Solana wallet authentication. You'll need to:
1. Verify wallet signatures on the backend
2. Pass wallet address as a header or query parameter
3. Use JWT tokens or session-based auth if needed

## Integration Steps

### Step 1: Create API Client

See `src/lib/api.ts` (created below) for a complete API client implementation.

### Step 2: Replace Mock Data with API Calls

For each page, replace direct imports from `mockData.ts` with React Query hooks:

**Before:**
```typescript
import { vaultStats } from '@/lib/mockData';
const stats = vaultStats;
```

**After:**
```typescript
import { useVaultStats } from '@/lib/api';
const { data: stats, isLoading } = useVaultStats();
```

### Step 3: Add Loading & Error States

Use React Query's built-in loading and error states:
```typescript
const { data, isLoading, error } = useVaultStats();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### Step 4: Configure API Base URL

Set the backend URL in environment variables:
- Create `.env.local` in the frontend directory
- Add: `VITE_API_BASE_URL=http://localhost:8000` (or your backend URL)

## Example: Converting Dashboard Page

**Current (using mock data):**
```typescript
import { vaultStats, navHistory, marketAllocations, pnlHistogram, currentPositions } from '@/lib/mockData';

const Dashboard = () => {
  return (
    <MetricCard value={`$${vaultStats.totalValueLocked.toLocaleString()}`} />
  );
};
```

**After (using API):**
```typescript
import { useVaultStats, useNavHistory, useMarketAllocations, usePnlDistribution, useCurrentPositions } from '@/lib/api';

const Dashboard = () => {
  const { data: vaultStats, isLoading } = useVaultStats();
  const { data: navHistory } = useNavHistory();
  // ... other hooks

  if (isLoading) return <LoadingSpinner />;

  return (
    <MetricCard value={`$${vaultStats?.totalValueLocked.toLocaleString()}`} />
  );
};
```

## Backend Requirements

Your FastAPI backend should:

1. **CORS Configuration** - Allow requests from `http://localhost:8080`
2. **Wallet Authentication** - Verify Solana wallet signatures
3. **Error Handling** - Return consistent error format
4. **Response Format** - Use consistent JSON structure

Example FastAPI endpoint:
```python
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/vault/stats")
async def get_vault_stats():
    return {
        "totalValueLocked": 2847392.45,
        "numberOfDepositors": 1247,
        "strategyWinRate": 73.4,
        "pnl24h": 14293.67,
        "vaultSharePrice": 1.0847,
    }
```

## Next Steps

1. Set up your FastAPI backend with the endpoints listed above
2. Use the API client utilities in `src/lib/api.ts`
3. Replace mock data imports with React Query hooks
4. Test each page with real backend data
5. Add error boundaries and loading states
6. Implement real-time updates using WebSockets if needed

