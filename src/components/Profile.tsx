import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Memory = {
  id: string;
  imageUrl: string;
  description: string;
  likes: number;
  comments: { text: string; username: string }[];
  postedBy: string;
  likedBy?: string[];
};

const Profile: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/');
      return;
    }
    setUser(storedUsername);

    fetch('http://localhost:8081/api/memories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const userMemories = data.filter((m: Memory) => m.postedBy === storedUsername);
          setMemories(userMemories);
        }
      });
  }, [navigate]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this memory?');
    if (!confirm) return;

    await fetch(`http://localhost:8081/api/memories/${id}`, { method: 'DELETE' });
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-purple-100 text-purple-800 font-sans">
      {/* ✅ Header */}
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
                    <Link to="/home">🏠 Home</Link> {/* ✅ Added Home link */}
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

      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">👤 {user}'s Profile</h2>

        {memories.length === 0 ? (
          <p className="text-lg text-purple-600">You haven’t posted any memories yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memories.map(memory => (
              <div key={memory.id} className="bg-white rounded-lg shadow-md p-4 relative">
                <div className="absolute right-4 top-4 flex gap-2">
                <button
                onClick={() => navigate(`/edit/${memory.id}`)}
                title="Edit"
                className="text-blue-600 hover:text-blue-800 text-xl"
                >
                ✏️
                </button>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    title="Delete"
                    className="text-red-600 hover:text-red-800 text-xl"
                  >
                    🗑️
                  </button>
                </div>

                <img
                  src={memory.imageUrl}
                  alt="Memory"
                  className="w-full h-64 object-contain rounded-md mb-3 bg-white"
                />
                <p className="text-lg font-semibold">{memory.description}</p>
                <p className="text-sm text-purple-500">Likes: {memory.likes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
