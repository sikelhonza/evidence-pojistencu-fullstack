import { useState, useEffect } from 'react'
import axios from 'axios'
import './PojistenecForm.css';

function PojistenecForm({ onSuccess, editData, setEditData }) {
  const [formData, setFormData] = useState({
    jmeno: '',
    prijmeni: '',
    email: '',
    telefon: '',
    vek: ''
  })

  useEffect(() => {
    if (editData) {
      setFormData(editData)
    } else {
      setFormData({ jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' })
    }
  }, [editData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // --- KLÍČOVÁ ÚPRAVA: Získání tokenu a nastavení hlaviček ---
      const accessToken = localStorage.getItem('access');
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      if (editData) {
        // UPDATE: Posíláme data + config s tokenem
        await axios.put(`http://127.0.0.1:8000/api/pojistenci/${editData.id}/`, formData, config)
        setEditData(null)
      } else {
        // CREATE: Posíláme data + config s tokenem
        await axios.post('http://127.0.0.1:8000/api/pojistenci/', formData, config)
      }
      
      setFormData({ jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' })
      onSuccess() 
    } catch (error) {
      console.error("Chyba při ukládání:", error)
      alert("Chyba při ukládání. Zkontrolujte, zda jste stále přihlášeni.")
    }
  }

  return (
    <div className="form-card"> 
      <h3>{editData ? "Upravit pojištěnce" : "Přidat nového pojištěnce"}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-inputs-grid">
          <input name="jmeno" placeholder="Jméno" value={formData.jmeno} onChange={handleChange} required />
          <input name="prijmeni" placeholder="Příjmení" value={formData.prijmeni} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="telefon" placeholder="Telefon" value={formData.telefon} onChange={handleChange} />
          <input name="vek" type="number" placeholder="Věk" value={formData.vek} onChange={handleChange} required />
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="submit-btn">
            {editData ? "Uložit změny" : "Uložit pojištěnce"}
          </button>
          
          {editData && (
            <button type="button" onClick={() => setEditData(null)} className="cancel-btn">
              Zrušit
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default PojistenecForm