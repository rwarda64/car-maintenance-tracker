from flask_cors import CORS
from flask import Flask, request, jsonify
from datetime import datetime
from data_handler import load_vehicles, save_vehicles
import uuid

app = Flask(__name__)
CORS(app)


# Sample maintenance rules (miles interval)
MAINTENANCE_RULES = {
    "oil_change": 5000,
    "tire_rotation": 7500,
    "brake_inspection": 10000,
    "coolant_flush": 30000,
    "spark_plugs": 60000
}

# Load existing vehicles from file
vehicles = load_vehicles()

@app.route('/')
def index():
    return jsonify({
        "message": "Welcome to the Car Maintenance Reminder API!",
        "routes": {
            "POST /add_vehicle": "Add a new vehicle",
            "GET /get_schedule/<vehicle_id>": "Get maintenance schedule",
            "GET /logs/<vehicle_id>": "Get maintenance logs for a vehicle",
            "POST /update_mileage/<vehicle_id>": "Update mileage",
            "POST /add_maintenance/<vehicle_id>": "Add a maintenance log entry"
        }
    })

@app.route('/add_vehicle', methods=['POST'])
def add_vehicle():
    data = request.json
    vehicle = {
        "id": len(vehicles) + 1,
        "year": data['year'],
        "make": data['make'],
        "model": data['model'],
        "mileage": data['mileage'],
        "maintenance_logs": []
    }
    vehicles.append(vehicle)
    save_vehicles(vehicles)
    return jsonify({"message": "Vehicle added.", "vehicle": vehicle}), 201

@app.route('/get_schedule/<int:vehicle_id>', methods=['GET'])
def get_schedule(vehicle_id):
    vehicle = next((v for v in vehicles if v["id"] == vehicle_id), None)
    if not vehicle:
        return jsonify({"error": "Vehicle not found."}), 404

    current_mileage = vehicle['mileage']
    logs = vehicle.get("maintenance_logs", [])
    last = {}
    for log in logs:
        task = log["task"]
        if task in MAINTENANCE_RULES:
            last[task] = max(last.get(task, 0), log["mileage"])

    schedule = []
    for task, interval in MAINTENANCE_RULES.items():
        last_done = last.get(task, 0)
        next_due = last_done + interval
        schedule.append({
            "task": task,
            "last_done": last_done,
            "next_due": next_due,
            "overdue": current_mileage >= next_due
        })

    return jsonify({"vehicle_id": vehicle_id, "schedule": schedule})

@app.route('/update_mileage/<int:vehicle_id>', methods=['POST'])
def update_mileage(vehicle_id):
    data = request.json
    new_mileage = data.get("mileage")

    vehicle = next((v for v in vehicles if v["id"] == vehicle_id), None)
    if not vehicle:
        return jsonify({"error": "Vehicle not found."}), 404

    vehicle['mileage'] = new_mileage
    save_vehicles(vehicles)
    return jsonify({"message": "Mileage updated.", "mileage": new_mileage})

@app.route('/add_maintenance/<int:vehicle_id>', methods=['POST'])
def add_maintenance(vehicle_id):
    data = request.json
    vehicle = next((v for v in vehicles if v["id"] == vehicle_id), None)
    if not vehicle:
        return jsonify({"error": "Vehicle not found."}), 404

    log_entry = {
        "id": str(uuid.uuid4()),
        "task": data.get("task"),
        "mileage": data.get("mileage"),
        "date": data.get("date", datetime.today().strftime('%Y-%m-%d')),
        "performed_by": data.get("performed_by", "DIY"),
        "notes": data.get("notes", ""),
        "invoice_url": data.get("invoice_url", ""),
        "cost_parts": data.get("cost_parts", 0.0),
        "cost_labor": data.get("cost_labor", 0.0),
        "parts_used": data.get("parts_used", []),
        "photo_urls": data.get("photo_urls", [])
    }

    vehicle.setdefault("maintenance_logs", []).append(log_entry)
    save_vehicles(vehicles)
    return jsonify({"message": "Maintenance log added.", "log": log_entry})

@app.route('/logs/<int:vehicle_id>', methods=['GET'])
def get_logs(vehicle_id):
    vehicle = next((v for v in vehicles if v["id"] == vehicle_id), None)
    if not vehicle:
        return jsonify({"error": "Vehicle not found."}), 404

    return jsonify({
        "vehicle_id": vehicle_id,
        "logs": vehicle.get("maintenance_logs", [])
    })

if __name__ == '__main__':
    app.run(debug=True)