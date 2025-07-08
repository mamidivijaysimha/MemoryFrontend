import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Home from './components/Home';
import AddMemory from './components/AddMemory'; // ✅ Import the new component
import Profile from './components/Profile';
import EditMemory from './components/EditMemory';
import Settings from './components/Settings';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<AddMemory />} /> {/* ✅ AddMemory route */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit/:id" element={<EditMemory />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </Router>
  );
};

export default App;
