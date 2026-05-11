import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PojistenecForm from '../PojistenecForm';
import api from '../api';
import toast from 'react-hot-toast';

function Pojistenci({ isAdmin, onLogout }) {
  const [pojistenci, setPojistenci] = useState([]);
  const [editujiciPojistenec, setEditujiciPojistenec] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchPojistenci = async () => {
    try {
      const response = await api.get('/api/pojistenci/');
      setPojistenci(response.data);
    } catch (error) {
      if (error.response?.status === 401) onLogout();
    }
  };

  useEffect(() => { fetchPojistenci(); }, []);

  const filtrovaniPojistenci = pojistenci.filter(osoba => {
    const hledanyText = searchQuery.toLowerCase();
    const jmeno = String(osoba.jmeno).toLowerCase();
    const prijmeni = String(osoba.prijmeni).toLowerCase();
    const celeJmeno = `${jmeno} ${prijmeni}`;
    const email = String(osoba.email).toLowerCase();
    const telefon = String(osoba.telefon);
    const vek = String(osoba.vek);
    return (
      jmeno.includes(hledanyText) || prijmeni.includes(hledanyText) ||
      celeJmeno.includes(hledanyText) || email.includes(hledanyText) ||
      telefon.includes(hledanyText) || vek.includes(hledanyText)
    );
  });

  const smazPojistence = async (e, id) => {
    e.stopPropagation();
    toast((t) => (
      <span>
        Opravdu smazat pojištěnce?{' '}
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              await api.delete(`/api/pojistenci/${id}/`);
              toast.success("Pojištěnec byl smazán.");
              fetchPojistenci();
            } catch (error) {
              console.error("Chyba při mazání:", error);
              toast.error("Chyba při mazání.");
            }
          }}
          style={{ marginLeft: '10px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}
        >
          Smazat
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{ marginLeft: '6px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}
        >
          Zrušit
        </button>
      </span>
    ), { duration: 5000 });
  };

  const vybratKEditaci = (e, osoba) => {
    e.stopPropagation();
    setEditujiciPojistenec(osoba);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <h1>Evidence pojištěnců</h1>

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
              <th>Jméno</th><th>Příjmení</th><th>Email</th>
              <th>Telefon</th><th>Věk</th>
              {isAdmin && <th>Akce</th>}
            </tr>
          </thead>
          <tbody>
            {filtrovaniPojistenci.map(osoba => (
              <tr
                key={osoba.id}
                onClick={() => navigate(`/pojistenci/${osoba.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>{osoba.jmeno}</td>
                <td>{osoba.prijmeni}</td>
                <td>{osoba.email}</td>
                <td>{osoba.telefon}</td>
                <td>{osoba.vek}</td>
                {isAdmin && (
                  <td className="actions-cell">
                    <button onClick={(e) => vybratKEditaci(e, osoba)} className="btn-edit">Upravit</button>
                    <button onClick={(e) => smazPojistence(e, osoba.id)} className="btn-delete">Smazat</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Pojistenci;
