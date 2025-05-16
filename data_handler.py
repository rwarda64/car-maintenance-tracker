# data_handler.py
import json
import os

DATA_FILE = 'vehicles.json'

def load_vehicles():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_vehicles(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)
