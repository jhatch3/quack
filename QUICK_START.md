# Quick Start Guide

## Running Both Frontend and Backend

### Option 1: Run in Separate Terminals (Recommended)

#### Terminal 1: Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

#### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:8080`

---

### Option 2: Using npm scripts (if you set them up)

You can create a script to run both, but for now, use separate terminals.

---

## First Time Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

---

## Environment Configuration

### Frontend Environment

Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

This tells the frontend where to find your backend API.

---

## Verify Everything Works

1. **Backend is running:**
   - Visit: `http://localhost:8000/docs`
   - You should see FastAPI interactive docs
   - Test endpoint: `http://localhost:8000/api/vault/stats`

2. **Frontend is running:**
   - Visit: `http://localhost:8080`
   - You should see the landing page
   - Check browser console for any errors

3. **Connection:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Navigate to Dashboard page
   - You should see API calls to `http://localhost:8000/api/vault/stats`

---

## Troubleshooting

### Backend won't start
- Make sure port 8000 is not in use
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify Python version (3.8+)

### Frontend won't start
- Make sure port 8080 is not in use
- Check that all dependencies are installed: `npm install`
- Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

### CORS Errors
- Make sure backend CORS is configured for `http://localhost:8080`
- Check `backend/app/main.py` has CORS middleware

### API calls failing
- Verify backend is running on port 8000
- Check `frontend/.env.local` has correct `VITE_API_BASE_URL`
- Restart frontend after changing `.env.local`

---

## Development Workflow

1. Start backend first: `cd backend && uvicorn app.main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Make changes - both will auto-reload
4. Check browser console for errors
5. Check backend terminal for API logs

---

## Ports

- **Backend:** `http://localhost:8000`
- **Frontend:** `http://localhost:8080`
- **API Docs:** `http://localhost:8000/docs`

