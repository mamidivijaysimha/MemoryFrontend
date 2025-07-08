import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Memory = {
  id: string;
  imageUrl: string;
  description: string;
  likes: number;
  comments: { text: string; username: string }[]; // ✅ FIXED
  postedBy: string;
  likedBy?: string[];
};


type User = {
  username: string;
};

const Home: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUser({ username: storedUsername });
    } else {
      navigate('/');
    }
  }, [navigate]);

useEffect(() => {
  fetch('http://localhost:8081/api/memories')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setMemories(data);
      } else {
        console.error("Unexpected response:", data);
        setMemories([]); // fallback to empty list
      }
    })
    .catch(err => {
      console.error('Error fetching memories:', err);
      setMemories([]); // fallback
    });
}, []);


  const handleLike = async (id: string) => {
    if (!user) return;

    const res = await fetch(`http://localhost:8081/api/memories/${id}/like?username=${user.username}`, {
      method: 'POST'
    });

    if (res.ok) {
      const updatedMemory = await res.json();
      setMemories(prev => prev.map(m => (m.id === id ? updatedMemory : m)));
    } else {
      const msg = await res.text();
      alert(msg);
    }
  };

  const handleCommentChange = (id: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleAddComment = async (id: string) => {
    const comment = commentInputs[id];
    if (!comment?.trim() || !user) return;

    const res = await fetch(`http://localhost:8081/api/memories/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment, username: user.username })
    });

    if (res.ok) {
      const updatedMemory = await res.json();
      setMemories(prev =>
        prev.map(m => (m.id === id ? updatedMemory : m))
      );
      setCommentInputs(prev => ({ ...prev, [id]: '' }));
    } else {
      const msg = await res.text();
      alert(msg);
    }
  };

  const toggleComments = (id: string) => {
    setShowComments(prev => ({ ...prev, [id]: !prev[id] }));
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
                  👤 {user?.username || 'Not Logged In'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {memories.map(memory => {
          const hasLiked = user && memory.likedBy?.includes(user.username);

          return (
            <div key={memory.id} className="bg-white shadow-md rounded-xl p-4">
              <img
                src={memory.imageUrl}
                alt="memory"
                className="w-full h-64 object-contain rounded-md mb-4 bg-white"
              />

              <p className="mb-2 text-center text-purple-800 text-lg font-medium">
                {memory.description}
              </p>
              <p className="text-sm text-center text-purple-500 mb-2">Posted by: {memory.postedBy}</p>

              <div className="flex justify-center gap-6 items-center mb-4">
                <button
                  onClick={() => handleLike(memory.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-lg transition ${
                    hasLiked ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
                  } text-white`}
                >
                  {hasLiked ? '❤️' : '❤️'} <span>Like ({memory.likes})</span>
                </button>

                <button
                  onClick={() => toggleComments(memory.id)}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md border border-purple-300 hover:bg-purple-600 transition text-lg"
                  title="Toggle Comments"
                >
                  💬 <span>Comment</span>
                </button>
              </div>

              {showComments[memory.id] && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mt-2">
                  <ul className="mb-2 space-y-1 text-sm">
                    {(memory.comments as { text: string; username: string }[]).map((c, index) => (
                      <li key={index} className="bg-white p-2 rounded border border-purple-100">
                        <strong>{c.username}:</strong> {c.text}
                      </li>
                    ))}

                  </ul>

                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[memory.id] || ''}
                      onChange={e => handleCommentChange(memory.id, e.target.value)}
                      className="flex-1 border rounded px-3 py-2"
                    />
                    <button
                      onClick={() => handleAddComment(memory.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
