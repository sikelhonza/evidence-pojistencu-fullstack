import { useState, useEffect } from 'react';
import api from './api';
import './PojistenecForm.css';
import toast from 'react-hot-toast';

const emptyForm = { jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' };

function PojistenecForm({ onSuccess, editData, setEditData }) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData(emptyForm);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await api.put(`/api/pojistenci/${editData.id}/`, formData);
        setEditData(null);
        toast.success("Pojištěnec byl upraven!");
      } else {
        await api.post('/api/pojistenci/', formData);
        toast.success("Pojištěnec byl přidán!");
      }
      setFormData(emptyForm);
      onSuccess();
    } catch (error) {
      console.error("Chyba při ukládání:", error);
      if (error.response?.status === 400) {
        toast.error("Neplatné údaje. Zkontroluj formulář.");
      } else {
        toast.error("Server není dostupný. Zkus to znovu.");
      } 
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: name === "vek" ? (value === "" ? "" : Number(value)) : value
    }));
  };

  return (
    <div className="form-card">
      <h2>{editData ? "Upravit pojištěnce" : "Přidat nového pojištěnce"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-inputs-grid">
          <input name="jmeno" placeholder="Jméno" value={formData.jmeno} onChange={handleInputChange} required />
          <input name="prijmeni" placeholder="Příjmení" value={formData.prijmeni} onChange={handleInputChange} required />
          <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleInputChange} required />
          <input name="telefon" placeholder="Telefon" value={formData.telefon} onChange={handleInputChange} required />
          <input name="vek" placeholder="Věk" type="number" min="1" max="120" value={formData.vek} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Ukládání..." : editData ? "Uložit změny" : "Přidat pojištěnce"}
        </button>
        {editData && <button type="button" onClick={() => {
          setEditData(null);
          setFormData(emptyForm);
        }} style={{marginLeft: '10px'}}>Zrušit</button>}
      </form>
    </div>
  );
}
export default PojistenecForm;
