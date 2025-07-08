import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddMemory: React.FC = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/');
    } else {
      setUser(storedUsername);
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !description.trim()) {
      alert('Please add an image and description');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    formData.append('postedBy', localStorage.getItem('username') || 'unknown');

    try {
      const res = await fetch('http://localhost:8081/api/memories', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        //alert('Memory added!');
        navigate('/home');
      } else {
        alert('Failed to add memory');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading memory');
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 text-purple-800 font-sans">
      {/* 🔼 Header */}
      <header className="sticky top-0 z-50 flex  justify-between items-center bg-white p-4 shadow-md">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-purple-800">Memories</h1>
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-xl hover:text-purple-600 transition"
          >
            👤
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-purple-200 rounded-md shadow-lg z-10">
              <ul className="text-sm">
                <li className="px-4 py-2 hover:bg-purple-100 cursor-pointer">
                  👤 {user || 'Not Logged In'}
                </li>
                <li className="px-4 py-2 hover:bg-purple-100 cursor-pointer">
                  <Link to="/home">🏠 Home</Link>
                </li>
                <li className="px-4 py-2 hover:bg-purple-100 cursor-pointer">
                  <Link to="/profile">🧾 Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-purple-100 cursor-pointer">
                  <Link to="/add">➕ Add</Link>
                </li>
                <li className="px-4 py-2 hover:bg-purple-100 cursor-pointer">
                  <Link to="/settings">⚙️ Settings</Link>
                </li>
                <li className="px-4 py-2 hover:bg-purple-100 cursor-pointer" onClick={handleLogout}>
                  ➡️ Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* 📸 Form */}
      <div className="flex justify-center items-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4"
        >
          <h2 className="text-xl font-bold text-purple-800 text-center">Add New Memory</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-4 py-2 rounded"
          />

          <textarea
            placeholder="Write a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            rows={4}
          ></textarea>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
          >
            Upload Memory
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemory;
