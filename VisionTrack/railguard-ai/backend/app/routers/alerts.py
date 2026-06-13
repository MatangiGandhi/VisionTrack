"""
Module 5: Smart Alert System

Provides:
  - GET  /api/alerts/live        -> latest list of alerts (REST polling)
  - WS   /api/alerts/ws          -> real-time alert stream (WebSocket)

In production, alerts should be pushed the moment Module 4 (Risk Intelligence)
flags a "High Risk" or "Medium Risk" situation, instead of being generated
on a timer.
"""

import asyncio
from typing import List

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.models.schemas import Alert
from app.services.simulator import (
    generate_detection_frame,
    generate_tracked_objects,
    generate_trajectory,
    calculate_risk,
    generate_alert,
)

router = APIRouter()


def _build_alerts() -> List[dict]:
    frame = generate_detection_frame(1)
    tracked = generate_tracked_objects(frame["objects"])
    alerts = []
    for obj in tracked:
        traj = generate_trajectory(obj)
        risk = calculate_risk(obj, traj)
        if risk["classification"] in ("Medium Risk", "High Risk"):
            alerts.append(generate_alert(risk))
    return alerts


@router.get("/live", response_model=List[Alert])
def get_live_alerts():
    """Return current active alerts (Medium/High risk only)."""
    return _build_alerts()


@router.websocket("/ws")
async def alerts_websocket(websocket: WebSocket):
    """Streams new alerts to connected clients every few seconds."""
    await websocket.accept()
    try:
        while True:
            alerts = _build_alerts()
            await websocket.send_json({"alerts": alerts})
            await asyncio.sleep(4)
    except WebSocketDisconnect:
        pass


@router.get("/health")
def alerts_health():
    return {"module": "Smart Alert System", "status": "operational"}
