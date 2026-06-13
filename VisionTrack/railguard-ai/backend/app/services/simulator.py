"""
Simple in-memory store + simulator used to generate realistic mock data
for all modules. Replace this with real model outputs (YOLOv8, DeepSORT,
LSTM, XGBoost) when integrating actual ML pipelines.
"""

import random
import time
import uuid

OBJECT_TYPES = ["human", "animal", "vehicle", "foreign_object"]
LOCATIONS = [
    {"name": "Track Section A - Surat Junction", "lat": 21.1702, "lng": 72.8311},
    {"name": "Track Section B - Vadodara Crossing", "lat": 22.3072, "lng": 73.1812},
    {"name": "Track Section C - Ahmedabad Yard", "lat": 23.0225, "lng": 72.5714},
    {"name": "Track Section D - Bharuch Bridge", "lat": 21.7051, "lng": 72.9959},
]


def _seeded_objects(n=5):
    objects = []
    for i in range(n):
        objects.append({
            "object_id": i + 1,
            "object_type": random.choice(OBJECT_TYPES),
            "x": round(random.uniform(0, 1280), 2),
            "y": round(random.uniform(0, 720), 2),
            "width": round(random.uniform(20, 120), 2),
            "height": round(random.uniform(20, 120), 2),
            "confidence": round(random.uniform(0.65, 0.99), 2),
        })
    return objects


def generate_detection_frame(frame_id: int):
    return {
        "frame_id": frame_id,
        "timestamp": time.time(),
        "objects": _seeded_objects(random.randint(2, 6)),
    }


def generate_tracked_objects(detections):
    tracked = []
    for obj in detections:
        speed = round(random.uniform(0.5, 5.0), 2)
        direction = round(random.uniform(0, 360), 1)
        history = [
            [round(obj["x"] - i * speed, 2), round(obj["y"] - i * speed, 2)]
            for i in range(5, 0, -1)
        ]
        tracked.append({
            "tracking_id": obj["object_id"],
            "object_type": obj["object_type"],
            "x": obj["x"],
            "y": obj["y"],
            "speed": speed,
            "direction": direction,
            "history": history,
        })
    return tracked


def generate_trajectory(tracked_obj):
    steps = 5
    future = []
    x, y = tracked_obj["x"], tracked_obj["y"]
    for i in range(1, steps + 1):
        x += tracked_obj["speed"] * 5
        y += tracked_obj["speed"] * 2
        future.append([round(x, 2), round(y, 2)])

    # naive heuristic: assume track is at x=640 (center of frame)
    moving_toward_track = abs(future[-1][0] - 640) < abs(tracked_obj["x"] - 640)
    time_to_track = None
    if moving_toward_track and tracked_obj["speed"] > 0:
        distance = abs(tracked_obj["x"] - 640)
        time_to_track = round(distance / (tracked_obj["speed"] * 10), 2)

    return {
        "tracking_id": tracked_obj["tracking_id"],
        "future_positions": future,
        "moving_toward_track": moving_toward_track,
        "time_to_track_seconds": time_to_track,
    }


def calculate_risk(tracked_obj, trajectory, train_speed=80.0):
    distance_to_track = round(abs(tracked_obj["x"] - 640), 2)

    score = 0.0
    score += max(0, 100 - distance_to_track / 5)        # closer = riskier
    if trajectory["moving_toward_track"]:
        score += 25
    if tracked_obj["object_type"] in ("human", "animal"):
        score += 15
    score += min(20, train_speed / 5)

    score = min(100, round(score, 1))

    if score < 35:
        classification = "Low Risk"
    elif score < 70:
        classification = "Medium Risk"
    else:
        classification = "High Risk"

    return {
        "tracking_id": tracked_obj["tracking_id"],
        "object_type": tracked_obj["object_type"],
        "distance_to_track": distance_to_track,
        "train_speed": train_speed,
        "risk_score": score,
        "classification": classification,
    }


def generate_alert(risk_assessment):
    location = random.choice(LOCATIONS)["name"]

    action_map = {
        "Low Risk": "Continue monitoring. No immediate action required.",
        "Medium Risk": "Notify nearest station controller and track patrol.",
        "High Risk": "Trigger emergency alert, alert train operator, reduce speed.",
    }

    return {
        "alert_id": str(uuid.uuid4())[:8],
        "tracking_id": risk_assessment["tracking_id"],
        "object_type": risk_assessment["object_type"],
        "risk_score": risk_assessment["risk_score"],
        "classification": risk_assessment["classification"],
        "location": location,
        "message": (
            f"{risk_assessment['object_type'].title()} detected "
            f"{risk_assessment['distance_to_track']}m from track "
            f"with {risk_assessment['classification']} "
            f"(score: {risk_assessment['risk_score']})."
        ),
        "recommended_action": action_map[risk_assessment["classification"]],
        "timestamp": time.time(),
    }


def generate_heatmap_points(n=12):
    points = []
    for _ in range(n):
        base = random.choice(LOCATIONS)
        points.append({
            "lat": round(base["lat"] + random.uniform(-0.05, 0.05), 5),
            "lng": round(base["lng"] + random.uniform(-0.05, 0.05), 5),
            "intensity": round(random.uniform(0.1, 1.0), 2),
        })
    return points


def generate_incident_history(n=15):
    incidents = []
    now = time.time()
    for i in range(n):
        risk_score = round(random.uniform(5, 98), 1)
        classification = (
            "Low Risk" if risk_score < 35 else
            "Medium Risk" if risk_score < 70 else
            "High Risk"
        )
        incidents.append({
            "incident_id": f"INC-{1000 + i}",
            "location": random.choice(LOCATIONS)["name"],
            "object_type": random.choice(OBJECT_TYPES),
            "risk_score": risk_score,
            "classification": classification,
            "timestamp": now - random.randint(0, 60 * 60 * 24 * 7),
            "resolved": random.choice([True, True, False]),
        })
    return sorted(incidents, key=lambda x: x["timestamp"], reverse=True)
