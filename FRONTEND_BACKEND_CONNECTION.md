# How to Connect Frontend to Backend

## Quick Example: Fetching Positions

### Step 1: The API Function (Already Added)

In `frontend/src/lib/api.ts`, there's now a `fetchCurrentPositions()` function:

```typescript
export const fetchCurrentPositions = async (): Promise<Position[]> => {
  const response = await fetch(`${API_BASE_URL}/api/positions/current`);
  const data = await response.json();
  return data || [];
};
```

### Step 2: Use It in a Component

```typescript
import { useState, useEffect } from 'react';
import { fetchCurrentPositions, Position } from '@/lib/api';

const MyComponent = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPositions = async () => {
      const data = await fetchCurrentPositions();
      setPositions(data);
      setIsLoading(false);
    };
    loadPositions();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {positions.map((pos, i) => (
        <div key={i}>{pos.market} - {pos.side}</div>
      ))}
    </div>
  );
};
```

## Complete Example

See `frontend/src/components/PositionsTable.example.tsx` for a complete working example with:
- Loading states
- Error handling
- Auto-refresh every 10 seconds
- Table display

## How It Works

1. **Frontend calls:** `fetchCurrentPositions()`
2. **Function makes HTTP request:** `GET http://localhost:8000/api/positions/current`
3. **Backend responds:** Returns JSON array of positions
4. **Frontend displays:** Renders the data in your component

## Environment Setup

Make sure you have `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Testing

1. **Start backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test in browser:**
   - Open `http://localhost:8080`
   - Open DevTools (F12) → Network tab
   - Navigate to a page that uses `fetchCurrentPositions()`
   - You should see a request to `/api/positions/current`

## Adding to Dashboard

To add positions to your Dashboard:

```typescript
// In Dashboard.tsx
import { fetchCurrentPositions } from '@/lib/api';

const Dashboard = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetchCurrentPositions().then(setPositions);
  }, []);

  return (
    <div>
      {/* Your existing code */}
      <PositionsTable positions={positions} />
    </div>
  );
};
```

## Other Endpoints

You can create similar functions for other endpoints:

```typescript
// In api.ts
export const fetchVaultStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/vault/stats`);
  return response.json();
};

export const fetchProposals = async () => {
  const response = await fetch(`${API_BASE_URL}/api/governance/proposals`);
  return response.json();
};
```

## Using React Query (Better Approach)

For better caching and error handling, use React Query:

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentPositions } from '@/lib/api';

const Dashboard = () => {
  const { data: positions, isLoading, error } = useQuery({
    queryKey: ['positions'],
    queryFn: fetchCurrentPositions,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading positions</div>;

  return <PositionsTable positions={positions || []} />;
};
```

