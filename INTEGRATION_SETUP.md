# Quick Integration Setup Guide

This guide will help you connect your frontend to the backend step by step.

## Step 1: Backend Setup

### 1.1 Install FastAPI Dependencies

```bash
cd backend
pip install fastapi uvicorn[standard] python-dotenv
```

### 1.2 Create Basic FastAPI App

Create or update `backend/app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Quack API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Quack API is running"}

@app.get("/api/vault/stats")
async def get_vault_stats():
    # TODO: Replace with real data from your database
    return {
        "totalValueLocked": 2847392.45,
        "numberOfDepositors": 1247,
        "strategyWinRate": 73.4,
        "pnl24h": 14293.67,
        "vaultSharePrice": 1.0847,
    }
```

### 1.3 Run Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Test it: Visit `http://localhost:8000/api/vault/stats`

## Step 2: Frontend Setup

### 2.1 Create Environment File

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 2.2 Update API Client (Optional)

The API client in `frontend/src/lib/api.ts` is already configured to use `VITE_API_BASE_URL`. If your backend runs on a different port, update the `.env.local` file.

### 2.3 Test API Connection

You can test the connection by temporarily updating a page to use the API. For example, update `Dashboard.tsx`:

```typescript
import { useVaultStats } from '@/lib/api';

const Dashboard = () => {
  const { data: vaultStats, isLoading, error } = useVaultStats();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  console.log('Vault Stats:', vaultStats);
  // ... rest of component
};
```

## Step 3: Replace Mock Data

### 3.1 Start with One Page

Start by converting one page at a time. The `Dashboard.example.tsx` file shows a complete example.

### 3.2 Conversion Pattern

For each page:

1. **Remove mock data import:**
   ```typescript
   // Remove this
   import { vaultStats } from '@/lib/mockData';
   ```

2. **Add API hook:**
   ```typescript
   // Add this
   import { useVaultStats } from '@/lib/api';
   ```

3. **Use hook in component:**
   ```typescript
   const { data: vaultStats, isLoading, error } = useVaultStats();
   ```

4. **Add loading/error states:**
   ```typescript
   if (isLoading) return <LoadingSpinner />;
   if (error) return <ErrorMessage error={error} />;
   ```

5. **Update data access:**
   ```typescript
   // Change from: vaultStats.totalValueLocked
   // To: vaultStats?.totalValueLocked
   ```

## Step 4: Implement Backend Endpoints

Refer to `backend/API_ENDPOINTS_REFERENCE.md` for complete endpoint specifications.

### Priority Order:

1. **Vault Stats** (`/api/vault/stats`) - Used by Dashboard and Deposit
2. **NAV History** (`/api/vault/nav/history`) - Used by Dashboard and Profile
3. **Current Positions** (`/api/positions/current`) - Used by Dashboard
4. **User Profile** (`/api/user/profile`) - Used by Profile
5. **Governance Proposals** (`/api/governance/proposals`) - Used by Governance
6. **Daily Reports** (`/api/reports/daily`) - Used by Reports

## Step 5: Add Authentication

### 5.1 Wallet Address Extraction

Update `frontend/src/lib/api.ts` to get wallet address from context:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';

function getWalletAddress(): string | null {
  // This won't work in a regular function - you'll need to pass it as a parameter
  // Or create a custom hook
  return null;
}
```

### 5.2 Create Wallet Hook

Create `frontend/src/hooks/useWalletAddress.ts`:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';

export function useWalletAddress() {
  const { publicKey } = useWallet();
  return publicKey?.toString() || null;
}
```

### 5.3 Use in Components

```typescript
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { useUserProfile } from '@/lib/api';

const Profile = () => {
  const walletAddress = useWalletAddress();
  const { data: profile } = useUserProfile(walletAddress);
  // ...
};
```

## Step 6: Error Handling

### 6.1 Create Error Component

Create `frontend/src/components/ErrorBoundary.tsx`:

```typescript
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function ErrorDisplay({ error }: { error: Error }) {
  return (
    <Card className="glass-card p-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
      <p className="text-muted-foreground">{error.message}</p>
    </Card>
  );
}
```

### 6.2 Add to Pages

```typescript
import { ErrorDisplay } from '@/components/ErrorBoundary';

const Dashboard = () => {
  const { data, error } = useVaultStats();
  
  if (error) return <ErrorDisplay error={error} />;
  // ...
};
```

## Step 7: Testing

### 7.1 Test Each Endpoint

1. Start backend: `uvicorn app.main:app --reload`
2. Start frontend: `npm run dev` (in frontend directory)
3. Open browser console
4. Navigate to each page
5. Check Network tab for API calls
6. Verify data appears correctly

### 7.2 Common Issues

**CORS Error:**
- Make sure CORS middleware is configured in FastAPI
- Check that frontend URL matches `allow_origins`

**404 Not Found:**
- Verify backend is running on correct port
- Check `VITE_API_BASE_URL` in `.env.local`
- Ensure endpoint path matches exactly

**Data Not Loading:**
- Check browser console for errors
- Verify API response format matches TypeScript types
- Check React Query DevTools for query status

## Step 8: Real-time Updates

For real-time data (like positions, proposals), consider:

1. **WebSockets** - For live updates
2. **Polling** - Already configured in React Query hooks with `refetchInterval`
3. **Server-Sent Events** - Alternative to WebSockets

The API client already has `refetchInterval` configured for endpoints that need real-time updates.

## Next Steps

1. ✅ Set up basic FastAPI backend
2. ✅ Configure CORS
3. ✅ Create environment file
4. ✅ Test API connection
5. ✅ Convert one page to use API
6. ✅ Implement remaining endpoints
7. ✅ Add authentication
8. ✅ Add error handling
9. ✅ Test all pages
10. ✅ Deploy!

## Resources

- **Frontend Explanation:** `FRONTEND_EXPLANATION.md`
- **API Reference:** `backend/API_ENDPOINTS_REFERENCE.md`
- **Example Page:** `frontend/src/pages/Dashboard.example.tsx`
- **API Client:** `frontend/src/lib/api.ts`

