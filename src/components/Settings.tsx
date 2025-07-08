import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const [oldUsername, setOldUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) navigate('/');
    else setOldUsername(storedUsername); // preload
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8081/api/auth/update', {
      // ✅ Fixed: changed '/api/users/update' to '/api/auth/update'
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldUsername,
        oldPassword,
        newUsername,
        newPassword
      })
    });

    if (response.ok) {
      //alert('User updated successfully');
      localStorage.setItem('username', newUsername);
      navigate('/');
    } else {
      const msg = await response.text();
      alert(`Error: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center">⚙️ Update Credentials</h2>

        <div>
          <label className="block text-sm font-medium text-purple-700">Old Username</label>
          <input
            value={oldUsername}
            onChange={e => setOldUsername(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700">New Username</label>
          <input
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default Settings;
