import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditMemory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8081/api/memories`)
      .then(res => res.json())
      .then(data => {
        const memory = data.find((m: any) => m.id === id);
        if (memory) {
          setDescription(memory.description);
        } else {
          alert('Memory not found');
          navigate('/profile');
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/profile');
      });
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!description.trim()) return alert('Description cannot be empty');

    const res = await fetch(`http://localhost:8081/api/memories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description })
    });

    if (res.ok) {
      alert('Memory updated successfully!');
      navigate('/profile');
    } else {
      alert('Failed to update memory');
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 text-purple-800 flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-6">✏️ Edit Memory</h2>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={5}
        className="w-full max-w-xl p-4 border border-purple-300 rounded-md mb-4"
        placeholder="Update your memory description..."
      />
      <button
        onClick={handleUpdate}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        Update
      </button>
    </div>
  );
};

export default EditMemory;
