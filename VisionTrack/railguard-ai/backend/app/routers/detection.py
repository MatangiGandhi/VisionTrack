"""
Module 1: Hazard Detection Engine

In production, replace `generate_detection_frame` with a real YOLOv8
inference call using `ultralytics`. Example:

    from ultralytics import YOLO
    model = YOLO("yolov8n.pt")
    results = model.predict(frame)

This mock endpoint returns randomized but structurally identical data so
the frontend can be developed/tested independently of the ML pipeline.
"""

import random
from fastapi import APIRouter

from app.models.schemas import DetectionResult
from app.services.simulator import generate_detection_frame

router = APIRouter()


@router.get("/live", response_model=DetectionResult)
def get_live_detection():
    """Return the latest simulated detection frame (objects near the track)."""
    frame_id = random.randint(1, 100000)
    return generate_detection_frame(frame_id)


@router.get("/health")
def detection_health():
    return {"module": "Hazard Detection Engine", "status": "operational"}
