"""
Module 2: Object Tracking Engine

In production, integrate DeepSORT to assign persistent tracking IDs across
frames using detection outputs from Module 1.
"""

from typing import List
from fastapi import APIRouter

from app.models.schemas import TrackedObject
from app.services.simulator import generate_detection_frame, generate_tracked_objects

router = APIRouter()


@router.get("/live", response_model=List[TrackedObject])
def get_tracked_objects():
    """Return tracked objects with movement history, speed, and direction."""
    frame = generate_detection_frame(1)
    return generate_tracked_objects(frame["objects"])


@router.get("/health")
def tracking_health():
    return {"module": "Object Tracking Engine", "status": "operational"}
