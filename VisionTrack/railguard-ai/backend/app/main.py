"""
RailGuard AI - Main FastAPI Application
Run with: uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import detection, tracking, prediction, risk, alerts, dashboard

app = FastAPI(
    title="RailGuard AI",
    description="Predictive Railway Hazard Intelligence System API",
    version="1.0.0",
)

# Allow the React frontend (Vite dev server) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all module routers
app.include_router(detection.router, prefix="/api/detection", tags=["Hazard Detection (Module 1)"])
app.include_router(tracking.router, prefix="/api/tracking", tags=["Object Tracking (Module 2)"])
app.include_router(prediction.router, prefix="/api/prediction", tags=["Trajectory Prediction (Module 3)"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk Intelligence (Module 4)"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Smart Alert System (Module 5)"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Analytics Dashboard (Module 6)"])


@app.get("/")
def root():
    return {
        "project": "RailGuard AI",
        "status": "running",
        "modules": [
            "Hazard Detection Engine",
            "Object Tracking Engine",
            "Trajectory Prediction Engine",
            "Risk Intelligence Engine",
            "Smart Alert System",
            "Analytics & Visualization Dashboard",
        ],
    }


@app.get("/health")
def health():
    return {"status": "ok"}
