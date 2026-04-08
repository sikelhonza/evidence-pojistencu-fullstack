import { useState, useEffect } from 'react'
import axios from 'axios'

function PojistenecForm({ onSuccess, editData, setEditData }) {
  const [formData, setFormData] = useState({
    jmeno: '',
    prijmeni: '',
    email: '',
    telefon: '',
    vek: ''
  })

  // --- 1. SLEDOVÁNÍ ZMĚN (useEffect) ---
  // Toto se spustí pokaždé, když v App.jsx klikneš na "Upravit"
  useEffect(() => {
    if (editData) {
      setFormData(editData) // Vyplní formulář daty pojištěnce
    } else {
      // Pokud editData zmizí (např. po uložení), vyprázdníme formulář
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
      if (editData) {
        // --- 2. ROZHODOVÁNÍ (UPDATE) ---
        // Pokud upravujeme, posíláme PUT na adresu s konkrétním ID
        await axios.put(`http://127.0.0.1:8000/api/pojistenci/${editData.id}/`, formData)
        setEditData(null) // Resetujeme stav editace v App.jsx
      } else {
        // --- 2. ROZHODOVÁNÍ (CREATE) ---
        // Pokud neupravujeme, posíláme klasický POST
        await axios.post('http://127.0.0.1:8000/api/pojistenci/', formData)
      }
      
      setFormData({ jmeno: '', prijmeni: '', email: '', telefon: '', vek: '' })
      onSuccess() // Obnovíme tabulku v App.jsx
    } catch (error) {
      console.error("Chyba při ukládání:", error)
    }
  }

  return (
    <div style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>{editData ? "Upravit pojištěnce" : "Přidat nového pojištěnce"}</h3>
      
      <form onSubmit={handleSubmit}>
        <input name="jmeno" placeholder="Jméno" value={formData.jmeno} onChange={handleChange} required />
        <input name="prijmeni" placeholder="Příjmení" value={formData.prijmeni} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="telefon" placeholder="Telefon" value={formData.telefon} onChange={handleChange} />
        <input name="vek" type="number" placeholder="Věk" value={formData.vek} onChange={handleChange} required />
        
        <div style={{ marginTop: '10px' }}>
          <button type="submit" style={{ backgroundColor: editData ? '#4CAF50' : '#008CBA', color: 'white' }}>
            {editData ? "Uložit změny" : "Uložit pojištěnce"}
          </button>
          
          {/* Tlačítko pro zrušení editace */}
          {editData && (
            <button 
              type="button" 
              onClick={() => setEditData(null)} 
              style={{ marginLeft: '10px', backgroundColor: '#555' }}
            >
              Zrušit
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default PojistenecForm