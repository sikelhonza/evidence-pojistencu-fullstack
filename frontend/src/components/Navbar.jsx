import { NavLink, useNavigate } from 'react-router-dom';

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/pojistenci" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Pojištěnci
        </NavLink>
      </div>
      <button onClick={onLogout} className="logout-btn">Odhlásit se</button>
    </nav>
  );
}

export default Navbar;