import { useState, useEffect } from 'react';
import axios from 'axios';
import './PojistenecForm.css';

function PojistenecForm({ onSuccess, editData, setEditData }) {
  const [formData, setFormData] = useState({ jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' });

  // Sledujeme, zda se změnila editData (když klikneš na "Upravit")
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editData) {
        // Režim EDITACE (PUT)
        await axios.put(`http://127.0.0.1:8000/api/pojistenci/${editData.id}/`, formData, config);
        setEditData(null); // Reset po úpravě
      } else {
        // Režim PŘIDÁNÍ (POST)
        await axios.post('http://127.0.0.1:8000/api/pojistenci/', formData, config);
      }
      setFormData({ jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' });
      onSuccess(); // Obnoví tabulku
    } catch (error) {
      console.error("Chyba při ukládání:", error);
    }
  };

  return (
    <div className="form-card">
      <h2>{editData ? "Upravit pojištěnce" : "Přidat nového pojištěnce"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-inputs-grid">
          <input placeholder="Jméno" value={formData.jmeno} onChange={e => setFormData({...formData, jmeno: e.target.value})} required />
          <input placeholder="Příjmení" value={formData.jmeno} onChange={e => setFormData({...formData, prijmeni: e.target.value})} required />
          <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input placeholder="Telefon" value={formData.telefon} onChange={e => setFormData({...formData, telefon: e.target.value})} required />
          <input placeholder="Věk" type="number" value={formData.vek} onChange={e => setFormData({...formData, vek: e.target.value})} required />
        </div>
        <button type="submit" className="submit-btn">
          {editData ? "Uložit změny" : "Uložit pojištěnce"}
        </button>
        {editData && <button onClick={() => setEditData(null)} style={{marginLeft: '10px'}}>Zrušit</button>}
      </form>
    </div>
  );
}
export default PojistenecForm;