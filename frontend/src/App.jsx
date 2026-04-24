import { useState, useEffect } from 'react'
import PojistenecForm from './PojistenecForm'
import Login from './Login'
import Register from './Register'
import axios from 'axios'
import './App.css'

function App() {
  const [pojistenci, setPojistenci] = useState([])
  const [editujiciPojistenec, setEditujiciPojistenec] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const [showRegister, setShowRegister] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // ← nový stav

  const fetchPojistenci = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) return;
      const response = await axios.get('http://127.0.0.1:8000/api/pojistenci/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setPojistenci(response.data);
    } catch (error) {
      console.error("Chyba při načítání dat:", error);
      if (error.response && error.response.status === 401) logout();
    }
  }

  const checkAdmin = async () => { // ← zjisti jestli je admin
    try {
      const accessToken = localStorage.getItem('access');
      const response = await axios.get('http://127.0.0.1:8000/api/me/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setIsAdmin(response.data.is_staff);
    } catch (error) {
      console.error("Chyba při zjišťování oprávnění:", error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchPojistenci();
      checkAdmin(); // ← zavolej při přihlášení
    }
  }, [isLoggedIn])

  const filtrovaniPojistenci = pojistenci.filter(osoba => {
    const hledanyText = searchQuery.toLowerCase();
    const jmeno = String(osoba.jmeno).toLowerCase();
    const prijmeni = String(osoba.prijmeni).toLowerCase();
    const celeJmeno = `${jmeno} ${prijmeni}`;
    const email = String(osoba.email).toLowerCase();
    const telefon = String(osoba.telefon);
    const vek = String(osoba.vek);
    return (
      jmeno.includes(hledanyText) ||
      prijmeni.includes(hledanyText) ||
      celeJmeno.includes(hledanyText) ||
      email.includes(hledanyText) ||
      telefon.includes(hledanyText) ||
      vek.includes(hledanyText)
    );
  });

  const smazPojistence = async (id) => {
    if (window.confirm("Opravdu chcete tohoto pojištěnce smazat?")) {
      try {
        const accessToken = localStorage.getItem('access');
        await axios.delete(`http://127.0.0.1:8000/api/pojistenci/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        fetchPojistenci();
      } catch (error) {
        console.error("Chyba při mazání:", error);
      }
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false); // ← resetuj admin stav
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
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login
        onLoginSuccess={() => setIsLoggedIn(true)}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="container">
      <div className="top-nav">
        <button onClick={logout} className="logout-btn">Odhlásit se</button>
      </div>

      <h1>Evidence pojištěnců</h1>

      {/* ← formulář vidí jen admin */}
      {isAdmin && (
        <PojistenecForm
          onSuccess={fetchPojistenci}
          editData={editujiciPojistenec}
          setEditData={setEditujiciPojistenec}
        />
      )}

      <div className="main-table-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Hledat pojištěnce..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table className="main-table">
          <thead>
            <tr>
              <th>Jméno</th>
              <th>Příjmení</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Věk</th>
              {/* ← sloupec Akce vidí jen admin */}
              {isAdmin && <th>Akce</th>}
            </tr>
          </thead>
          <tbody>
            {filtrovaniPojistenci.map(osoba => (
              <tr key={osoba.id}>
                <td>{osoba.jmeno}</td>
                <td>{osoba.prijmeni}</td>
                <td>{osoba.email}</td>
                <td>{osoba.telefon}</td>
                <td>{osoba.vek}</td>
                {/* ← tlačítka vidí jen admin */}
                {isAdmin && (
                  <td className="actions-cell">
                    <button onClick={() => vybratKEditaci(osoba)} className="btn-edit">Upravit</button>
                    <button onClick={() => smazPojistence(osoba.id)} className="btn-delete">Smazat</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App