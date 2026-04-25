import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/pojistenci/', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = response.data;
        const vekyCisla = data.map(o => o.vek).filter(v => v > 0);
        setStats({
          celkem: data.length,
          prumernyVek: vekyCisla.length ? Math.round(vekyCisla.reduce((a, b) => a + b, 0) / vekyCisla.length) : 0,
          nejmladsí: vekyCisla.length ? Math.min(...vekyCisla) : 0,
          nejstarsi: vekyCisla.length ? Math.max(...vekyCisla) : 0,
        });
      } catch (error) {
        console.error("Chyba při načítání statistik:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>

      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.celkem}</span>
            <span className="stat-label">Celkem pojištěnců</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.prumernyVek}</span>
            <span className="stat-label">Průměrný věk</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.nejmladsí}</span>
            <span className="stat-label">Nejmladší věk</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.nejstarsi}</span>
            <span className="stat-label">Nejstarší věk</span>
          </div>
        </div>
      ) : (
        <p style={{ color: '#555' }}>Načítám statistiky...</p>
      )}

      <button className="submit-btn" style={{ marginTop: '40px', maxWidth: '300px' }} onClick={() => navigate('/pojistenci')}>
        Zobrazit pojištěnce
      </button>
    </div>
  );
}

export default Dashboard;