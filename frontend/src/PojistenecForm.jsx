import { useState, useEffect } from 'react';
import axios from 'axios';
import './PojistenecForm.css';
import toast from 'react-hot-toast';

function PojistenecForm({ onSuccess, editData, setEditData }) {
  const [formData, setFormData] = useState({ jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' });

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
        await axios.put(`http://127.0.0.1:8000/api/pojistenci/${editData.id}/`, formData, config);
        setEditData(null);
        toast.success("Pojištěnec byl upraven!");
      } else {
        await axios.post('http://127.0.0.1:8000/api/pojistenci/', formData, config);
        toast.success("Pojištěnec byl přidán!");
      }
      setFormData({ jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' });
      onSuccess();
    } catch (error) {
      console.error("Chyba při ukládání:", error);
      toast.error("Chyba při ukládání. Zkontroluj údaje.");
    }
  };

  return (
    <div className="form-card">
      <h2>{editData ? "Upravit pojištěnce" : "Přidat nového pojištěnce"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-inputs-grid">
          <input placeholder="Jméno" value={formData.jmeno} onChange={e => setFormData({...formData, jmeno: e.target.value})} required />
          <input placeholder="Příjmení" value={formData.prijmeni} onChange={e => setFormData({...formData, prijmeni: e.target.value})} required />
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