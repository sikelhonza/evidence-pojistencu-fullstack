import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const formatTyp = (typ) => {
    const typy = {
      'zdravotni': 'Zdravotní', 'zivotni': 'Životní',
      'automobilove': 'Automobilové', 'majetkove': 'Majetkové',
      'cestovni': 'Cestovní', 'urazove': 'Úrazové',
    };
    return typy[typ] || typ;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin-stats/');
        setStats(response.data);
      } catch (error) {
        console.error("Chyba při načítání statistik:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="container"><p style={{ color: '#555' }}>Načítám...</p></div>;

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.celkem_pojistencu}</span>
          <span className="stat-label">Celkem pojištěnců</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.celkem_pojistek}</span>
          <span className="stat-label">Celkem pojistek</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.aktivni_pojistky}</span>
          <span className="stat-label">Aktivní pojistky</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: stats.brzy_vyprsi > 0 ? '#ff4d4d' : '#ff6b2b' }}>
            {stats.brzy_vyprsi}
          </span>
          <span className="stat-label">Brzy vyprší</span>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Pojistky podle typu</h2>
        <div className="typy-grid">
          {Object.entries(stats.typy).map(([typ, pocet]) => (
            <div key={typ} className="typ-card">
              <span className="typ-pocet">{pocet}</span>
              <span className="typ-nazev">{formatTyp(typ)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-two-col">
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Poslední registrace</h2>
          <table className="main-table">
            <thead>
              <tr><th>Jméno</th><th>Příjmení</th><th>Email</th></tr>
            </thead>
            <tbody>
              {stats.posledni_registrace.map((p, i) => (
                <tr key={i}>
                  <td>{p.jmeno}</td>
                  <td>{p.prijmeni}</td>
                  <td>{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Nedávno přidané pojistky</h2>
          <table className="main-table">
            <thead>
              <tr><th>Název</th><th>Typ</th><th>Pojištěnec</th><th>Do</th></tr>
            </thead>
            <tbody>
              {stats.posledni_pojistky.map((p, i) => (
                <tr key={i}>
                  <td>{p.nazev}</td>
                  <td>{formatTyp(p.typ)}</td>
                  <td>{p.pojistenec}</td>
                  <td>{p.datum_konce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="submit-btn" style={{ marginTop: '40px' }} onClick={() => navigate('/pojistenci')}>
        Zobrazit všechny pojištěnce
      </button>
    </div>
  );
}

export default Dashboard;
