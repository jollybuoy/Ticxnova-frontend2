import React, { useState } from 'react';
import axios from 'axios';

const TicketForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://ticxnova-a6e8f0cmaxguhpfm.canadacentral-01.azurewebsites.net/api/tickets',
        { ...formData, createdBy: 'ram@example.com' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Ticket created!');
      setFormData({ title: '', description: '', priority: 'Low' });
    } catch (err) {
      alert('❌ Failed to create ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">Create Ticket</h2>
      <input
        name="title"
        placeholder="Title"
        className="w-full mb-3 p-2 border rounded"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        className="w-full mb-3 p-2 border rounded"
        value={formData.description}
        onChange={handleChange}
      />
      <select
        name="priority"
        className="w-full mb-3 p-2 border rounded"
        value={formData.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default TicketForm;
