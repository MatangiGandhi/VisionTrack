"""
Module 3: Trajectory Prediction Engine

In production, replace `generate_trajectory` with an LSTM model
(TensorFlow/PyTorch) trained on historical position sequences:

    model = tf.keras.models.load_model("lstm_trajectory.h5")
    future_positions = model.predict(history_sequence)
"""

from typing import List
from fastapi import APIRouter

from app.models.schemas import TrajectoryPrediction
from app.services.simulator import (
    generate_detection_frame,
    generate_tracked_objects,
    generate_trajectory,
)

router = APIRouter()


@router.get("/live", response_model=List[TrajectoryPrediction])
def get_trajectory_predictions():
    """Return predicted future positions for each tracked object."""
    frame = generate_detection_frame(1)
    tracked = generate_tracked_objects(frame["objects"])
    return [generate_trajectory(obj) for obj in tracked]


@router.get("/health")
def prediction_health():
    return {"module": "Trajectory Prediction Engine", "status": "operational"}
