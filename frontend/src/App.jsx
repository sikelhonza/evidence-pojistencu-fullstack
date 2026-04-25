import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './pages/Dashboard';
import Pojistenci from './pages/Pojistenci';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAdmin = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      const response = await axios.get('http://127.0.0.1:8000/api/me/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setIsAdmin(response.data.is_staff);
    } catch (error) {
      console.error("Chyba při zjišťování oprávnění:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) checkAdmin();
  }, [isLoggedIn]);

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  // Obalující layout pro přihlášené stránky
const PrivateLayout = ({ children }) => {
  if (!isLoggedIn) return <Navigate to="/login" />;
  return (
    <>
      <Navbar onLogout={logout} />
      {children}
    </>
  );
};

  return (
    <Routes>
      <Route path="/login" element={
        isLoggedIn ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => navigate('/register')} />
      } />
      <Route path="/register" element={
        isLoggedIn ? <Navigate to="/" /> : <Register onSwitchToLogin={() => navigate('/login')} />
      } />
      <Route path="/" element={
        <PrivateLayout><Dashboard /></PrivateLayout>
      } />
      <Route path="/pojistenci" element={
        <PrivateLayout><Pojistenci isAdmin={isAdmin} onLogout={logout} /></PrivateLayout>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;