import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

function PojistenecDetail({ isAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pojistenec, setPojistenec] = useState(null);
  const [pojistky, setPojistky] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    typ: 'zdravotni', nazev: '', castka: '', datum_zacatku: '', datum_konce: '', aktivni: true
  });

  const formatTyp = (typ) => {
    const typy = {
      'zdravotni': 'Zdravotní', 'zivotni': 'Životní',
      'automobilove': 'Automobilové', 'majetkove': 'Majetkové',
      'cestovni': 'Cestovní', 'urazove': 'Úrazové',
    };
    return typy[typ] || typ;
  };

  const formatCastka = (castka) => {
    return Number(castka).toLocaleString('cs-CZ') + ' Kč';
  };

  const fetchDetail = async () => {
    try {
      const response = await api.get(`/api/pojistenci/${id}/`);
      setPojistenec(response.data);
      setPojistky(response.data.pojistky || []);
    } catch (error) {
      console.error("Chyba při načítání:", error);
    }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/pojistky/', { ...formData, pojistenec: id });
      toast.success("Pojistka byla přidána!");
      setShowForm(false);
      setFormData({ typ: 'zdravotni', nazev: '', castka: '', datum_zacatku: '', datum_konce: '', aktivni: true });
      fetchDetail();
    } catch (error) {
      toast.error("Chyba při přidávání pojistky.");
    }
  };

  const smazPojistku = async (pojistkaId) => {
    toast((t) => (
      <span>
        Opravdu smazat pojistku?{' '}
        <button onClick={async () => {
          toast.dismiss(t.id);
          try {
            await api.delete(`/api/pojistky/${pojistkaId}/`);
            toast.success("Pojistka smazána.");
            fetchDetail();
          } catch {
            toast.error("Chyba při mazání.");
          }
        }} style={{ marginLeft: '10px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
          Smazat
        </button>
        <button onClick={() => toast.dismiss(t.id)}
          style={{ marginLeft: '6px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
          Zrušit
        </button>
      </span>
    ), { duration: 5000 });
  };

  if (!pojistenec) return <div className="container"><p style={{ color: '#555' }}>Načítám...</p></div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/pojistenci')} className="back-btn">← Zpět</button>

      <div className="detail-card">
        <h1>{pojistenec.jmeno} {pojistenec.prijmeni}</h1>
        <div className="detail-info">
          <div className="detail-row"><span className="detail-label">Email</span><span>{pojistenec.email}</span></div>
          <div className="detail-row"><span className="detail-label">Telefon</span><span>{pojistenec.telefon}</span></div>
          <div className="detail-row"><span className="detail-label">Věk</span><span>{pojistenec.vek} let</span></div>
        </div>
      </div>

      <div className="pojistky-section">
        <div className="pojistky-header">
          <h2>Pojistky</h2>
          {isAdmin && (
            <button className="submit-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Zrušit' : '+ Přidat pojistku'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-inputs-grid">
                <select name="typ" value={formData.typ} onChange={e => setFormData({...formData, typ: e.target.value})} className="form-select">
                  <option value="zdravotni">Zdravotní</option>
                  <option value="zivotni">Životní</option>
                  <option value="automobilove">Automobilové</option>
                  <option value="majetkove">Majetkové</option>
                  <option value="cestovni">Cestovní</option>
                  <option value="urazove">Úrazové</option>
                </select>
                <input placeholder="Název pojistky" value={formData.nazev} onChange={e => setFormData({...formData, nazev: e.target.value})} required />
                <input placeholder="Částka (Kč)" type="number" min="0" value={formData.castka} onChange={e => setFormData({...formData, castka: e.target.value})} required />
                <input placeholder="Datum začátku" type="date" value={formData.datum_zacatku} onChange={e => setFormData({...formData, datum_zacatku: e.target.value})} required />
                <input placeholder="Datum konce" type="date" value={formData.datum_konce} onChange={e => setFormData({...formData, datum_konce: e.target.value})} required />
              </div>
              <button type="submit" className="submit-btn">Uložit pojistku</button>
            </form>
          </div>
        )}

        {pojistky.length === 0 ? (
          <p style={{ color: '#555', marginTop: '20px' }}>Žádné pojistky.</p>
        ) : (
          <table className="main-table">
            <thead>
              <tr>
                <th>Typ</th><th>Název</th><th>Částka</th><th>Od</th><th>Do</th><th>Stav</th>
                {isAdmin && <th>Akce</th>}
              </tr>
            </thead>
            <tbody>
              {pojistky.map(p => (
                <tr key={p.id}>
                  <td>{formatTyp(p.typ)}</td>
                  <td>{p.nazev}</td>
                  <td>{formatCastka(p.castka)}</td>
                  <td>{p.datum_zacatku}</td>
                  <td>{p.datum_konce}</td>
                  <td style={{ color: p.aktivni ? '#4CAF50' : '#ff4d4d' }}>{p.aktivni ? 'Aktivní' : 'Neaktivní'}</td>
                  {isAdmin && (
                    <td><button onClick={() => smazPojistku(p.id)} className="btn-delete">Smazat</button></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PojistenecDetail;
