# VisionGuard — Railway Hazard Intelligence System

Full-stack scaffold:
- **Backend**: FastAPI (Python) — REST + WebSocket APIs for all 6 modules
- **Frontend**: React + Vite + Tailwind CSS + Chart.js + Leaflet

> Note: The backend currently returns **simulated/mock data** with the exact
> shape your real ML models (YOLOv8, DeepSORT, LSTM, XGBoost) will produce.
> This lets you build and demo the full UI immediately, then swap in real
> models module-by-module (see comments in `backend/app/services/simulator.py`
> and each router file).

---

## Project Structure

```
railguard-ai/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py                  # FastAPI entrypoint
│       ├── models/schemas.py        # Pydantic data models
│       ├── services/simulator.py    # Mock data generator (replace with real ML)
│       └── routers/
│           ├── detection.py         # Module 1: Hazard Detection
│           ├── tracking.py          # Module 2: Object Tracking
│           ├── prediction.py        # Module 3: Trajectory Prediction
│           ├── risk.py              # Module 4: Risk Intelligence
│           ├── alerts.py            # Module 5: Smart Alerts (REST + WS)
│           └── dashboard.py         # Module 6: Analytics Dashboard
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js                   # Axios API client
        ├── index.css
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── TopBar.jsx
        │   ├── StatCard.jsx
        │   └── RiskBadge.jsx
        └── pages/
            ├── Dashboard.jsx         # Module 6: Overview (heatmap + charts)
            ├── Detection.jsx         # Module 1
            ├── Tracking.jsx          # Module 2
            ├── Prediction.jsx        # Module 3
            ├── Risk.jsx              # Module 4
            ├── Alerts.jsx            # Module 5 (live WebSocket)
            └── Incidents.jsx         # Module 6: History table
```

---

## How to Run in VS Code

### 1. Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed
- VS Code with the **Python** and **ES7+ React/Redux** extensions (optional but helpful)

### 2. Open the project
Open the `railguard-ai` folder in VS Code (`File → Open Folder`).

### 3. Backend setup (Terminal 1)

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```

Backend will run at: **http://localhost:8000**
API docs (Swagger UI): **http://localhost:8000/docs**

> If you only want to test the dashboard quickly without the heavy ML
> libraries (TensorFlow, ultralytics, xgboost), install just:
> `pip install fastapi uvicorn pydantic` — the mock simulator doesn't
> actually call those libraries yet, they're placeholders for your real
> model integration.

### 4. Frontend setup (Terminal 2 — open a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Frontend will run at: **http://localhost:5173**

### 5. Open the app
Visit **http://localhost:5173** in your browser. The dashboard will fetch
live data from the FastAPI backend at `http://localhost:8000`.

---

## API Endpoints Reference

| Module | Endpoint | Method |
|---|---|---|
| 1. Hazard Detection | `/api/detection/live` | GET |
| 2. Object Tracking | `/api/tracking/live` | GET |
| 3. Trajectory Prediction | `/api/prediction/live` | GET |
| 4. Risk Intelligence | `/api/risk/live?train_speed=80` | GET |
| 5. Smart Alerts | `/api/alerts/live` | GET |
| 5. Smart Alerts (real-time) | `/api/alerts/ws` | WebSocket |
| 6. Dashboard Heatmap | `/api/dashboard/heatmap` | GET |
| 6. Incident History | `/api/dashboard/incidents` | GET |
| 6. Summary Stats | `/api/dashboard/summary` | GET |

---

## Integrating Real ML Models (Next Steps)

1. **Module 1 (YOLOv8)**: In `routers/detection.py`, load a YOLO model with
   `ultralytics` and run `model.predict(frame)` on camera/video frames
   instead of `generate_detection_frame()`.

2. **Module 2 (DeepSORT)**: In `routers/tracking.py`, feed YOLO detections
   into a DeepSORT tracker to get persistent IDs, speed, and direction.

3. **Module 3 (LSTM)**: In `routers/prediction.py`, load a trained
   TensorFlow/PyTorch LSTM model and feed it the tracking history sequence
   to forecast future positions.

4. **Module 4 (XGBoost)**: In `routers/risk.py`, load a trained XGBoost
   classifier (`risk_model.json`) and pass features (distance to track,
   object type, speed, train speed, trajectory direction) to get a risk
   probability score.

5. **Module 5 (Alerts)**: In `routers/alerts.py`, trigger
   `generate_alert()` automatically whenever Module 4 returns
   "Medium Risk" or "High Risk" — already wired up in `_build_alerts()`.

6. **Module 6 (Dashboard)**: Replace `generate_heatmap_points()` and
   `generate_incident_history()` with real database queries (e.g.
   PostgreSQL/MongoDB) storing historical incident records.

---

## Tech Stack Summary

- **Frontend**: React 18, Vite, Tailwind CSS, Chart.js, React-Leaflet, Lucide Icons
- **Backend**: FastAPI, Pydantic, Uvicorn
- **ML (to integrate)**: YOLOv8 (Ultralytics), OpenCV, DeepSORT, TensorFlow/PyTorch (LSTM), XGBoost, Scikit-Learn
