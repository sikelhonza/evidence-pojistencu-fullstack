import { useState } from 'react';
import axios from 'axios';
import './Auth.css';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      onLoginSuccess();
    } catch (error) { alert("Přihlášení selhalo."); }
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