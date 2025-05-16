import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddMaintenanceForm from './AddMaintenanceForm';


export default function MaintenanceLogDashboard() {
  const [vehicleId, setVehicleId] = useState(1);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs(vehicleId);
  }, [vehicleId]);

  const fetchLogs = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/logs/${id}`);
      setLogs(response.data.logs);
      setError('');
    } catch (err) {
      setLogs([]);
      setError('Vehicle not found or server error.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Maintenance Log Dashboard</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium">Vehicle ID:</label>
        <input
          type="number"
          value={vehicleId}
          onChange={(e) => setVehicleId(Number(e.target.value))}
          className="border p-2 rounded w-32"
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <AddMaintenanceForm vehicleId={vehicleId} onSuccess={() => fetchLogs(vehicleId)} />

      <div className="grid gap-4">
        {logs.map((log) => (
          <div key={log.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">{log.task}</h2>
            <p><strong>Date:</strong> {log.date}</p>
            <p><strong>Mileage:</strong> {log.mileage} mi</p>
            <p><strong>Performed By:</strong> {log.performed_by}</p>
            <p><strong>Notes:</strong> {log.notes}</p>
            <p><strong>Cost (Parts):</strong> ${log.cost_parts}</p>
            <p><strong>Cost (Labor):</strong> ${log.cost_labor}</p>
            <p><strong>Parts Used:</strong> {(log.parts_used || []).join(', ')}</p>
            {log.invoice_url && (
              <p>
                <strong>Invoice:</strong>{' '}
                <a href={log.invoice_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  View
                </a>
              </p>
            )}
            {(log.photo_urls || []).length > 0 && (
              <div className="mt-2">
                <strong>Photos:</strong>
                <div className="flex gap-2 mt-1">
                  {(log.photo_urls || []).map((url, index) => (
                    <img key={index} src={url} alt="log" className="w-24 h-24 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
