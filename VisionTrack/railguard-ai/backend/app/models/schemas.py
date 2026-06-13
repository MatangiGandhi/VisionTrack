"""
Shared Pydantic schemas used across RailGuard AI modules.
"""

from pydantic import BaseModel
from typing import List, Optional, Literal


# ---------- Module 1: Hazard Detection ----------

class DetectedObject(BaseModel):
    object_id: int
    object_type: str          # human, animal, vehicle, foreign_object
    x: float                  # bounding box center x (pixels or normalized)
    y: float                  # bounding box center y
    width: float
    height: float
    confidence: float         # 0.0 - 1.0


class DetectionResult(BaseModel):
    frame_id: int
    timestamp: float
    objects: List[DetectedObject]


# ---------- Module 2: Object Tracking ----------

class TrackedObject(BaseModel):
    tracking_id: int
    object_type: str
    x: float
    y: float
    speed: float               # units/sec
    direction: float           # degrees (0-360)
    history: List[List[float]] # list of [x, y] positions


# ---------- Module 3: Trajectory Prediction ----------

class TrajectoryPrediction(BaseModel):
    tracking_id: int
    future_positions: List[List[float]]   # predicted [x, y] points
    moving_toward_track: bool
    time_to_track_seconds: Optional[float]


# ---------- Module 4: Risk Intelligence ----------

class RiskAssessment(BaseModel):
    tracking_id: int
    object_type: str
    distance_to_track: float
    train_speed: float
    risk_score: float                       # 0 - 100
    classification: Literal["Low Risk", "Medium Risk", "High Risk"]


# ---------- Module 5: Smart Alerts ----------

class Alert(BaseModel):
    alert_id: str
    tracking_id: int
    object_type: str
    risk_score: float
    classification: str
    location: str
    message: str
    recommended_action: str
    timestamp: float


# ---------- Module 6: Dashboard ----------

class HeatmapPoint(BaseModel):
    lat: float
    lng: float
    intensity: float


class IncidentRecord(BaseModel):
    incident_id: str
    location: str
    object_type: str
    risk_score: float
    classification: str
    timestamp: float
    resolved: bool
