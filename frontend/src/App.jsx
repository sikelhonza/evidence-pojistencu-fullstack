import { useState, useEffect } from 'react'
import PojistenecForm from './PojistenecForm'
import axios from 'axios'
import './App.css'

function App() {
  const [pojistenci, setPojistenci] = useState([])
  const [editujiciPojistenec, setEditujiciPojistenec] = useState(null);

  const fetchPojistenci = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/pojistenci/')
      setPojistenci(response.data)
    } catch (error) {
      console.error("Chyba při načítání dat:", error)
    }
  }

  useEffect(() => {
    fetchPojistenci()
  }, [])

  const smazPojistence = async (id) => {
    if (window.confirm("Opravdu chcete tohoto pojištěnce smazat?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/pojistenci/${id}/`);
        fetchPojistenci();
      } catch (error) {
        console.error("Chyba při mazání:", error);
      }
    }
  };

  const vybratKEditaci = (osoba) => {
    setEditujiciPojistenec(osoba);
    // Tip: Dobré je vyrolovat nahoru k formuláři
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <h1>Evidence pojištěnců</h1>

      {/* TADY BYLA TA ZMĚNA - přidáváme editData a setEditData */}
      <PojistenecForm 
        onSuccess={fetchPojistenci} 
        editData={editujiciPojistenec} 
        setEditData={setEditujiciPojistenec} 
      />
      
      <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Jméno</th>
            <th>Příjmení</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Věk</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          {pojistenci.map(osoba => (
            <tr key={osoba.id}>
              <td>{osoba.jmeno}</td>
              <td>{osoba.prijmeni}</td>
              <td>{osoba.email}</td>
              <td>{osoba.telefon}</td>
              <td>{osoba.vek}</td>
              <td style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => vybratKEditaci(osoba)}
                  style={{ 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    marginRight: '8px',
                    border: 'none', 
                    padding: '5px 10px', 
                    cursor: 'pointer',
                    borderRadius: '4px' 
                  }}
                >
                  Upravit
                </button>
                <button 
                  onClick={() => smazPojistence(osoba.id)}
                  style={{ 
                    backgroundColor: '#ff4d4d', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    cursor: 'pointer',
                    borderRadius: '4px' 
                  }}
                >
                  Smazat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App