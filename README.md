# Car Maintenance Tracker

This is a full-stack web application for tracking vehicle maintenance history, built with **Flask** (Python backend) and **React** (frontend). The app allows users to log service tasks, track mileage, costs, parts used, and view or upload maintenance receipts and photos.

---

## 🚀 Features

- Add multiple vehicles with year, make, model, and mileage
- Log detailed maintenance tasks (e.g. oil changes, brake service)
- Include:
  - Mileage at service
  - Date
  - Task performed
  - Who performed it
  - Cost (parts + labor)
  - Notes
  - Invoice URL
  - Photo URLs
- View logs in a dashboard
- Upload data via form (React frontend)
- Persistent data storage via local `vehicles.json`

---

## 🛠 Tech Stack

**Backend**
- Python 3.10+
- Flask
- Flask-CORS

**Frontend**
- React (Create React App)
- Axios
- Tailwind CSS (optional, for styling)

---

## 📁 Project Structure

```
MaintenanceReminderApp/
├── app.py                  # Flask backend
├── data_handler.py        # Load/save vehicles.json
├── vehicles.json          # Stores all vehicle and log data
├── frontend/              # React app
│   ├── src/
│   │   ├── App.js
│   │   ├── MaintenanceLogDashboard.jsx
│   │   └── AddMaintenanceForm.jsx
│   └── ...
└── README.md
```

---

## 📦 Installation & Setup

### 1. Backend (Flask)

```bash
cd MaintenanceReminderApp
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install flask flask-cors
```

#### Run the server:
```bash
python app.py
```
Server runs at: [http://127.0.0.1:5000](http://127.0.0.1:5000)


### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```
Frontend runs at: [http://localhost:3000](http://localhost:3000)

---

## 🔄 API Endpoints

### POST `/add_vehicle`
Add a new vehicle
```json
{
  "year": 2020,
  "make": "Subaru",
  "model": "WRX",
  "mileage": 15000
}
```

### GET `/logs/<vehicle_id>`
Returns all maintenance logs for a vehicle

### POST `/update_mileage/<vehicle_id>`
```json
{
  "mileage": 17500
}
```

### POST `/add_maintenance/<vehicle_id>`
Add a detailed log
```json
{
  "task": "Oil Change",
  "mileage": 15000,
  "date": "2025-05-16",
  "performed_by": "DIY",
  "notes": "Used Motul 5W-40 synthetic",
  "invoice_url": "https://imgur.com/invoice123",
  "cost_parts": 55.0,
  "cost_labor": 0.0,
  "parts_used": ["Motul 5W-40", "Oil filter"],
  "photo_urls": ["https://imgur.com/photo1"]
}
```

---

## 🧪 Using the App

1. Start the Flask backend (`python app.py`)
2. Start the React frontend (`npm start` in `/frontend`)
3. Visit [http://localhost:3000](http://localhost:3000)
4. Select a vehicle ID, view logs, and submit new ones via the form

---

## ✅ Future Features

- 🔍 Filtering by task, date, or shop (in progress)
- 🧾 Export logs to PDF/CSV
- 🧠 User login and VIN lookup
- ☁️ Cloud sync (Firebase/Postgres)
- 📱 Mobile-friendly UI

---

## 🧑‍💻 Contributing

Feel free to fork, clone, or open PRs to contribute. Bug fixes, UI polish, and feature requests welcome!

---

## 📃 License

This project is open-source and licensed under the [MIT License](LICENSE).
