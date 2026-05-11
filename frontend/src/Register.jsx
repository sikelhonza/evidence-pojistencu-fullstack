import { useState } from 'react';
import api from './api';
import './Auth.css';
import toast from 'react-hot-toast'

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirm_password: '',
    jmeno: '', prijmeni: '', telefon: '', vek: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username || formData.username.length < 3)
      newErrors.username = 'Min. 3 znaky.';
    if (!formData.jmeno)
      newErrors.jmeno = 'Jméno je povinné.';
    if (!formData.prijmeni)
      newErrors.prijmeni = 'Příjmení je povinné.';
    if (!formData.telefon || !/^\+?[\d\s\-]{9,20}$/.test(formData.telefon))
      newErrors.telefon = 'Neplatné telefonní číslo.';
    const vek = Number(formData.vek);
    if (!formData.vek || vek < 1 || vek > 120)
      newErrors.vek = 'Věk musí být 1–120.';
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'Heslo musí mít min. 8 znaků.';
    else if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = 'Hesla se neshodují.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await api.post('/api/register/', formData);
      toast.success("Registrace proběhla úspěšně! Nyní se můžeš přihlásit.");
      onSwitchToLogin();
    } catch (error) {
      const data = error.response?.data;
      if (data && typeof data === 'object') {
        setErrors(data);
        const firstError = Object.values(data)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error("Registrace selhala. Zkontroluj údaje.");
      }
    }
  };

  const field = (name, placeholder, type = 'text', extra = {}) => (
    <div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        style={errors[name] ? { borderColor: '#ff4d4d' } : {}}
        {...extra}
      />
      {errors[name] && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', margin: '2px 0 0' }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Registrace</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-inputs-stack">
            {field('username', 'Uživatelské jméno')}
            {field('jmeno', 'Jméno')}
            {field('prijmeni', 'Příjmení')}
            {field('email', 'Email', 'email')}
            {field('telefon', 'Telefon', 'tel')}
            {field('vek', 'Věk', 'number', { min: 1, max: 120 })}
            {field('password', 'Heslo', 'password', { minLength: 8 })}
            {field('confirm_password', 'Potvrdit heslo', 'password')}
          </div>
          <button type="submit" className="submit-btn">Zaregistrovat se</button>
        </form>
        <p className="switch-link" onClick={onSwitchToLogin}>Už máš účet? Přihlaš se.</p>
      </div>
    </div>
  );
}

export default Register;
