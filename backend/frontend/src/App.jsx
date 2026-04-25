import { useState, useEffect } from 'react'
import PojistenecForm from './PojistenecForm'
import Login from './Login'
import axios from 'axios'
import './App.css'

function App() {
  const [pojistenci, setPojistenci] = useState([])
  const [editujiciPojistenec, setEditujiciPojistenec] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchPojistenci = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) return;

      const response = await axios.get('http://127.0.0.1:8000/api/pojistenci/', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setPojistenci(response.data);
    } catch (error) {
      console.error("Chyba při načítání dat:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchPojistenci()
    }
  }, [isLoggedIn])

  const smazPojistence = async (id) => {
    if (window.confirm("Opravdu chcete tohoto pojištěnce smazat?")) {
      try {
        const accessToken = localStorage.getItem('access');
        await axios.delete(`http://127.0.0.1:8000/api/pojistenci/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        fetchPojistenci();
      } catch (error) {
        console.error("Chyba při mazání:", error);
      }
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setPojistenci([]);
    setEditujiciPojistenec(null);
  };

  const vybratKEditaci = (osoba) => {
    setEditujiciPojistenec(osoba);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="container">
      {/* Tlačítko odhlásit s třídou pro lepší CSS kontrolu */}
      <div className="top-nav">
        <button onClick={logout} className="logout-btn">
          Odhlásit se
        </button>
      </div>
      
      <h1>Evidence pojištěnců</h1>

      <PojistenecForm 
        onSuccess={fetchPojistenci} 
        editData={editujiciPojistenec} 
        setEditData={setEditujiciPojistenec} 
      />
      
      {/* Smazán border="1" a přidána className */}
      <table className="main-table">
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
              <td className="actions-cell">
                <button 
                  onClick={() => vybratKEditaci(osoba)}
                  className="btn-edit"
                >
                  Upravit
                </button>
                <button 
                  onClick={() => smazPojistence(osoba.id)}
                  className="btn-delete"
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