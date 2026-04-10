import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

// 1. PŘIDÁNO: Musíme do komponenty přijmout onLoginSuccess jako parametr (prop)
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: email, 
        password: password
      });

      const { access, refresh } = response.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      setSuccess('Login successful!');
      
      onLoginSuccess(); 
      
    } catch (err) {
      setError('Invalid credentials or server error.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Přihlášení</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Uživatelské jméno:
            <input
              type="text" // Změněno na text, aby tě to nenutilo psát zavináč
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginBottom: '10px' }}
            />
          </label>
        </div>
        <div>
          <label>
            Heslo:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginBottom: '10px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
          Vstoupit do systému
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    </div>
  );
};

export default Login;