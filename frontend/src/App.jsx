import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import Pojistenci from './pages/Pojistenci';
import PojistenecDetail from './pages/PojistenecDetail';
import Landing from './pages/Landing';
import api from './api';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uzivatel, setUzivatel] = useState(null);
  const navigate = useNavigate();
  const isLoggedInRef = useRef(null);

  const logout = async () => {
    try {
      await api.post('/api/auth/logout/');
    } catch {}
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUzivatel(null);
    navigate('/');
  };

  const loadUser = async () => {
    try {
      const response = await api.get('/api/me/');
      setIsAdmin(response.data.is_staff);
      setUzivatel({
        jmeno: response.data.jmeno,
        prijmeni: response.data.prijmeni,
        pojistenec_id: response.data.pojistenec_id,
      });
      setIsLoggedIn(true);
      return response.data;
    } catch {
      setIsLoggedIn(false);
      return null;
    }
  };

  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  useEffect(() => {
    loadUser();

    const handleSessionExpired = () => {
      if (isLoggedInRef.current !== true) return;
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUzivatel(null);
      navigate('/login', { replace: true });
    };
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  const handleLoginSuccess = async () => {
    const data = await loadUser();
    if (data) {
      navigate(data.is_staff ? '/prehled' : '/muj-profil');
    }
  };

  if (isLoggedIn === null) {
    return <div className="container"><p style={{ color: '#555' }}>Načítám...</p></div>;
  }

  const PrivateLayout = ({ children }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return (
      <>
        <Navbar onLogout={logout} uzivatel={uzivatel} isAdmin={isAdmin} />
        {children}
      </>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Landing isLoggedIn={isLoggedIn} />} />
      <Route path="/login" element={
        isLoggedIn ? <Navigate to="/muj-profil" /> : <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => navigate('/register')} />
      } />
      <Route path="/register" element={
        isLoggedIn ? <Navigate to="/muj-profil" /> : <Register onSwitchToLogin={() => navigate('/login')} />
      } />
      <Route path="/prehled" element={
        <PrivateLayout>{isAdmin ? <Dashboard /> : <Navigate to="/muj-profil" />}</PrivateLayout>
      } />
      <Route path="/pojistenci" element={
        <PrivateLayout>{isAdmin ? <Pojistenci isAdmin={isAdmin} onLogout={logout} /> : <Navigate to="/muj-profil" />}</PrivateLayout>
      } />
      <Route path="/muj-profil" element={
        <PrivateLayout><UserDashboard /></PrivateLayout>
      } />
      <Route path="/pojistenci/:id" element={
        <PrivateLayout><PojistenecDetail isAdmin={isAdmin} /></PrivateLayout>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
