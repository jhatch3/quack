# Frontend & Backend Integration Summary

## 📚 Documentation Files

1. **`FRONTEND_EXPLANATION.md`** - Complete frontend architecture explanation
2. **`INTEGRATION_SETUP.md`** - Step-by-step setup guide
3. **`backend/API_ENDPOINTS_REFERENCE.md`** - Complete API endpoint specifications
4. **`frontend/src/lib/api.ts`** - Ready-to-use API client with React Query hooks
5. **`frontend/src/pages/Dashboard.example.tsx`** - Example of converted page

## 🎯 Quick Start

### Frontend Overview

Your frontend is a **React + TypeScript** app with:
- **7 pages**: Landing, Dashboard, Profile, Deposit, Governance, Agents, Reports
- **Mock data**: Currently using `src/lib/mockData.ts` for all data
- **React Query**: Already set up for data fetching
- **Solana Wallet**: Integrated for authentication

### Backend Requirements

You need a **FastAPI backend** with **21 endpoints** covering:

1. **Vault Data** (6 endpoints)
   - Stats, NAV history, TVL history, allocations, PnL distribution

2. **User Data** (4 endpoints)
   - Profile, NAV history, commentary, deposits

3. **Positions** (1 endpoint)
   - Current open positions

4. **Governance** (4 endpoints)
   - Proposals list, single proposal, reasoning, voting

5. **Agents** (3 endpoints)
   - Agent list, debate transcript, live debate

6. **Reports** (3 endpoints)
   - Daily reports, single report, summary

## 🔌 How to Connect

### Step 1: Backend Setup

```bash
cd backend
pip install fastapi uvicorn python-dotenv
```

Create `backend/app/main.py` with CORS enabled (see `INTEGRATION_SETUP.md`)

### Step 2: Frontend Configuration

Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Step 3: Use API Hooks

Replace mock data imports with API hooks:

**Before:**
```typescript
import { vaultStats } from '@/lib/mockData';
```

**After:**
```typescript
import { useVaultStats } from '@/lib/api';
const { data: vaultStats, isLoading } = useVaultStats();
```

## 📋 Data Sources by Page

### Dashboard (`/dashboard`)
- `useVaultStats()` - Vault statistics
- `useNavHistory()` - NAV chart data
- `useMarketAllocations()` - Market allocation chart
- `usePnlDistribution()` - PnL histogram
- `useCurrentPositions()` - Open positions table

### Profile (`/profile`)
- `useUserProfile(walletAddress)` - User stats
- `useUserNavHistory(walletAddress)` - Personal NAV chart
- `useUserCommentary(walletAddress)` - Agent commentary

### Deposit (`/deposit`)
- `useVaultStats()` - Vault statistics
- `useTvlHistory()` - TVL chart
- `useUserDeposits(walletAddress)` - Deposit history
- `useCreateDeposit()` - Create deposit mutation

### Governance (`/governance`)
- `useProposals()` - List of proposals
- `useProposalReasoning(proposalId)` - Agent reasoning
- `useVoteOnProposal()` - Submit vote mutation

### Agents (`/agents`)
- `useAgents()` - Agent personas
- `useLiveDebate()` - Live debate transcript
- `useDebateTranscript(proposalId)` - Proposal debate

### Reports (`/reports`)
- `useDailyReports()` - List of daily reports
- `useReportSummary()` - Summary statistics

## 🛠️ Implementation Priority

1. **Phase 1: Core Vault Data**
   - `/api/vault/stats`
   - `/api/vault/nav/history`
   - `/api/vault/tvl/history`

2. **Phase 2: User Data**
   - `/api/user/profile`
   - `/api/user/nav/history`
   - `/api/user/commentary`

3. **Phase 3: Trading Data**
   - `/api/positions/current`
   - `/api/vault/allocations`
   - `/api/vault/pnl/distribution`

4. **Phase 4: Governance**
   - `/api/governance/proposals`
   - `/api/governance/proposals/{id}`
   - `/api/governance/proposals/{id}/reasoning`
   - `/api/governance/proposals/{id}/vote`

5. **Phase 5: Agents & Reports**
   - `/api/agents`
   - `/api/agents/debate/live`
   - `/api/reports/daily`
   - `/api/reports/summary`

## 📝 Example: Converting Dashboard

See `frontend/src/pages/Dashboard.example.tsx` for a complete example showing:
- Loading states with Skeleton components
- Error handling
- Data fetching with React Query
- Conditional rendering

## 🔐 Authentication

The frontend uses Solana wallet authentication. Backend should:
1. Accept wallet address as query parameter or header
2. Optionally verify wallet signatures for sensitive operations
3. Return user-specific data based on wallet address

## 🚀 Next Steps

1. Read `FRONTEND_EXPLANATION.md` for detailed frontend architecture
2. Follow `INTEGRATION_SETUP.md` for step-by-step setup
3. Reference `backend/API_ENDPOINTS_REFERENCE.md` when implementing endpoints
4. Use `frontend/src/lib/api.ts` hooks in your components
5. Test each page as you convert from mock data to API

## ❓ Common Questions

**Q: Do I need to implement all endpoints at once?**  
A: No, start with Phase 1 (core vault data) and work your way through.

**Q: Can I still use mock data while building backend?**  
A: Yes! The mock data is still available. You can gradually replace it.

**Q: How do I handle loading states?**  
A: React Query provides `isLoading` automatically. See `Dashboard.example.tsx`.

**Q: What if my backend structure is different?**  
A: Update the API client (`api.ts`) to match your backend's response format.

**Q: How do I test the connection?**  
A: Start both servers, open browser console, and check Network tab for API calls.

## 📞 Support

- Check `FRONTEND_EXPLANATION.md` for frontend details
- Check `backend/API_ENDPOINTS_REFERENCE.md` for API specs
- Check `INTEGRATION_SETUP.md` for troubleshooting

