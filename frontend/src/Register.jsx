import { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import toast from 'react-hot-toast'

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirm_password: '',
    jmeno: '', prijmeni: '', telefon: '', vek: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', formData);
      toast.success("Registrace proběhla úspěšně! Nyní se můžeš přihlásit.");
      onSwitchToLogin();
    } catch (error) {
      const message = error.response?.data?.password || "Registrace selhala. Zkontroluj údaje.";
      toast.error(message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Registrace</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-inputs-stack">
            <input name="username" placeholder="Uživatelské jméno" onChange={handleChange} required />
            <input name="jmeno" placeholder="Jméno" onChange={handleChange} required />
            <input name="prijmeni" placeholder="Příjmení" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="telefon" placeholder="Telefon" onChange={handleChange} required />
            <input name="vek" type="number" placeholder="Věk" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Heslo" onChange={handleChange} required />
            <input name="confirm_password" type="password" placeholder="Potvrdit heslo" onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-btn">Zaregistrovat se</button>
        </form>
        <p className="switch-link" onClick={onSwitchToLogin}>Už máš účet? Přihlaš se.</p>
      </div>
    </div>
  );
}

export default Register;