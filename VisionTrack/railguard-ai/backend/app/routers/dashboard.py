"""
Module 6: Analytics & Visualization Dashboard

Provides aggregate data for the React dashboard:
  - Heatmap points of hazardous locations (Leaflet)
  - Historical incident records (table / charts)
  - Summary statistics
"""

from typing import List
from fastapi import APIRouter

from app.models.schemas import HeatmapPoint, IncidentRecord
from app.services.simulator import generate_heatmap_points, generate_incident_history

router = APIRouter()


@router.get("/heatmap", response_model=List[HeatmapPoint])
def get_heatmap():
    """Return hazard heatmap points for the map view."""
    return generate_heatmap_points()


@router.get("/incidents", response_model=List[IncidentRecord])
def get_incidents():
    """Return recent incident history."""
    return generate_incident_history()


@router.get("/summary")
def get_summary():
    """Return aggregate statistics for dashboard cards/charts."""
    incidents = generate_incident_history(50)
    total = len(incidents)
    high = len([i for i in incidents if i["classification"] == "High Risk"])
    medium = len([i for i in incidents if i["classification"] == "Medium Risk"])
    low = len([i for i in incidents if i["classification"] == "Low Risk"])
    resolved = len([i for i in incidents if i["resolved"]])

    return {
        "total_incidents": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "resolved": resolved,
        "unresolved": total - resolved,
        "active_cameras": 24,
        "trains_monitored": 8,
    }


@router.get("/health")
def dashboard_health():
    return {"module": "Analytics & Visualization Dashboard", "status": "operational"}
