"""
Module 4: Risk Intelligence Engine

In production, replace `calculate_risk` with an XGBoost classifier trained
on features such as distance-to-track, object type, speed, trajectory
direction, and train speed:

    import xgboost as xgb
    model = xgb.XGBClassifier()
    model.load_model("risk_model.json")
    risk_score = model.predict_proba(features)[0][1] * 100
"""

from typing import List
from fastapi import APIRouter, Query

from app.models.schemas import RiskAssessment
from app.services.simulator import (
    generate_detection_frame,
    generate_tracked_objects,
    generate_trajectory,
    calculate_risk,
)

router = APIRouter()


@router.get("/live", response_model=List[RiskAssessment])
def get_risk_assessments(train_speed: float = Query(80.0, description="Current train speed (km/h)")):
    """Return risk score and classification for each tracked object."""
    frame = generate_detection_frame(1)
    tracked = generate_tracked_objects(frame["objects"])
    results = []
    for obj in tracked:
        traj = generate_trajectory(obj)
        results.append(calculate_risk(obj, traj, train_speed))
    return results


@router.get("/health")
def risk_health():
    return {"module": "Risk Intelligence Engine", "status": "operational"}
