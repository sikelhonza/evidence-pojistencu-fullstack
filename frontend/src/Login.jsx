import { useState } from 'react';
import api from './api';
import './Auth.css';
import toast from 'react-hot-toast';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/login/', { username, password });
      onLoginSuccess();
    } catch (error) {
      toast.error("Přihlášení selhalo. Zkontroluj údaje.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Přihlášení</h2>
        <form onSubmit={handleLogin}>
          <div className="form-inputs-stack">
            <input placeholder="Uživatelské jméno" onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Heslo" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="submit-btn">Přihlásit</button>
        </form>
        <p className="switch-link" onClick={onSwitchToRegister}>Nemáš účet? Zaregistruj se.</p>
      </div>
    </div>
  );
}
export default Login;
