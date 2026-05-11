import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function UserDashboard() {
  const [pojistenec, setPojistenec] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPojistenec = async () => {
      try {
        const response = await api.get('/api/me/');
        setPojistenec(response.data);
      } catch (error) {
        console.error('Error fetching pojistenec:', error);
        navigate('/login');
      }
    };
    fetchPojistenec();
  }, [navigate]);

  const formatTyp = (typ) => {
    const typy = {
      'zdravotni': 'Zdravotní', 'zivotni': 'Životní',
      'automobilove': 'Automobilové', 'majetkove': 'Majetkové',
      'cestovni': 'Cestovní', 'urazove': 'Úrazové',
    };
    return typy[typ] || typ;
  };

  const formatCastka = (castka) => Number(castka).toLocaleString('cs-CZ') + ' Kč';

  const dnyDoVyprseni = (datum) => {
    const dnes = new Date();
    const konec = new Date(datum);
    return Math.ceil((konec - dnes) / (1000 * 60 * 60 * 24));
  };

  if (!pojistenec) return <div className="container"><p style={{ color: '#555' }}>Načítám...</p></div>;

  const aktivniPojistky = pojistenec.pojistky?.filter(p => p.aktivni) || [];
  const brzyVyprsi = aktivniPojistky.filter(p => dnyDoVyprseni(p.datum_konce) <= 30 && dnyDoVyprseni(p.datum_konce) > 0);
  const nejblizsiVyprseni = aktivniPojistky.sort((a, b) => new Date(a.datum_konce) - new Date(b.datum_konce))[0];

  return (
    <div className="container">
      <h1>Můj profil</h1>

      <div className="detail-card">
        <h2 style={{ color: '#fff', fontWeight: 300, marginTop: 0, marginBottom: '25px', fontSize: '1.3rem' }}>Osobní údaje</h2>
        <div className="detail-info">
          <div className="detail-row"><span className="detail-label">Jméno</span><span>{pojistenec.jmeno} {pojistenec.prijmeni}</span></div>
          <div className="detail-row"><span className="detail-label">Email</span><span>{pojistenec.email}</span></div>
          <div className="detail-row"><span className="detail-label">Telefon</span><span>{pojistenec.telefon}</span></div>
          <div className="detail-row"><span className="detail-label">Věk</span><span>{pojistenec.vek} let</span></div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: '30px' }}>
        <div className="stat-card">
          <span className="stat-number">{aktivniPojistky.length}</span>
          <span className="stat-label">Aktivní pojistky</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: brzyVyprsi.length > 0 ? '#ff4d4d' : '#ff6b2b' }}>{brzyVyprsi.length}</span>
          <span className="stat-label">Brzy vyprší</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ fontSize: '1.5rem' }}>
            {nejblizsiVyprseni ? new Date(nejblizsiVyprseni.datum_konce).toLocaleDateString('cs-CZ') : '—'}
          </span>
          <span className="stat-label">Nejbližší vypršení</span>
        </div>
      </div>

      {brzyVyprsi.length > 0 && (
        <div className="warning-banner">
          Máte {brzyVyprsi.length} pojistku/pojistky které vyprší do 30 dní!
        </div>
      )}

      <div className="pojistky-section" style={{ marginTop: '40px' }}>
        <div className="pojistky-header">
          <h2 style={{ color: '#fff', fontWeight: 300, fontSize: '1.5rem' }}>Moje pojistky</h2>
        </div>

        {aktivniPojistky.length === 0 ? (
          <p style={{ color: '#555' }}>Nemáte žádné aktivní pojistky.</p>
        ) : (
          <table className="main-table">
            <thead>
              <tr>
                <th>Typ</th><th>Název</th><th>Částka</th><th>Od</th><th>Do</th><th>Zbývá dní</th>
              </tr>
            </thead>
            <tbody>
              {aktivniPojistky.map(p => {
                const zbyvaDni = dnyDoVyprseni(p.datum_konce);
                return (
                  <tr key={p.id}>
                    <td>{formatTyp(p.typ)}</td>
                    <td>{p.nazev}</td>
                    <td>{formatCastka(p.castka)}</td>
                    <td>{p.datum_zacatku}</td>
                    <td>{p.datum_konce}</td>
                    <td style={{ color: zbyvaDni <= 30 ? '#ff4d4d' : zbyvaDni <= 90 ? '#ff6b2b' : '#4CAF50' }}>
                      {zbyvaDni > 0 ? `${zbyvaDni} dní` : 'Vypršela'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
