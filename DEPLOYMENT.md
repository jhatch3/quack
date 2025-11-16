# Deployment Guide - Evergreen Capital

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:8080
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

## Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy Frontend
```bash
cd frontend
vercel
```

### 3. Set Environment Variables in Vercel Dashboard
- `VITE_API_BASE_URL` - Your backend API URL (e.g., `https://your-backend.vercel.app`)
- `VITE_SOLANA_RPC_URL` - Solana RPC endpoint (optional)
- `VITE_SOLANA_API_BASE_URL` - Solana API proxy URL (optional)

### 4. Deploy Backend (Alternative: Railway/Render)
The backend (FastAPI) should be deployed separately:
- **Railway**: Connect GitHub repo, set root to `backend/`, install `requirements.txt`
- **Render**: Create Web Service, set root to `backend/`, command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Requirements

### Frontend (`frontend/package.json`)
All dependencies listed in `package.json` - run `npm install`

### Backend (`backend/requirements.txt`)
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
pydantic==2.9.2
python-dotenv==1.0.1
```

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_API_BASE_URL=http://localhost:3001
```

### Backend (.env)
```
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Running Locally

1. **Start Backend:**
   ```bash
   cd backend
   uvicorn app.main:app --port 8000 --reload
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

