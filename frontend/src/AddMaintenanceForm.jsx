import React, { useState } from 'react';
import axios from 'axios';

export default function AddMaintenanceForm({ vehicleId, onSuccess }) {
  const [formData, setFormData] = useState({
    task: '',
    mileage: '',
    date: '',
    performed_by: '',
    notes: '',
    invoice_url: '',
    cost_parts: '',
    cost_labor: '',
    parts_used: '',
    photo_urls: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      mileage: parseInt(formData.mileage),
      cost_parts: parseFloat(formData.cost_parts || 0),
      cost_labor: parseFloat(formData.cost_labor || 0),
      parts_used: formData.parts_used.split(',').map((p) => p.trim()),
      photo_urls: formData.photo_urls.split(',').map((url) => url.trim())
    };
    try {
      await axios.post(`http://127.0.0.1:5000/add_maintenance/${vehicleId}`, payload);
      onSuccess();
      setFormData({
        task: '', mileage: '', date: '', performed_by: '', notes: '',
        invoice_url: '', cost_parts: '', cost_labor: '', parts_used: '', photo_urls: ''
      });
    } catch (err) {
      alert('Failed to submit log. Check console for details.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Add Maintenance Log</h2>
      <div className="grid gap-2">
        {['task', 'mileage', 'performed_by', 'notes', 'invoice_url', 'cost_parts', 'cost_labor', 'parts_used', 'photo_urls'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={formData[field]}
            placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        ))}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded mt-2">Submit Log</button>
      </div>
    </form>
  );
}
