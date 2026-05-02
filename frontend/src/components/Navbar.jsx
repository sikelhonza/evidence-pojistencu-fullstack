import { NavLink, useNavigate } from 'react-router-dom';

function Navbar({ onLogout, uzivatel, isAdmin }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo" onClick={() => navigate('/')}>PojišťovnaApp</span>
        <div className="navbar-links">
          {isAdmin && (
          <NavLink to="/prehled" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Přehled
          </NavLink>)}
          {isAdmin && (
          <NavLink to="/pojistenci" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Pojištěnci
          </NavLink>)}
          <NavLink to="/muj-profil" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Můj Profil
          </NavLink>
        </div>
      </div>
      <div className="navbar-right">
        {uzivatel && (
          <span className="navbar-user">
            {uzivatel.jmeno} {uzivatel.prijmeni}
            {isAdmin && <span className="admin-badge">Admin</span>}
          </span>
        )}
        <button onClick={onLogout} className="logout-btn">Odhlásit se</button>
      </div>
    </nav>
  );
}

export default Navbar;