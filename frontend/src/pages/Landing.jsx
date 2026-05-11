import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing({ isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-logo">PojišťovnaApp</div>
        <div className="landing-nav-btns">
          {isLoggedIn ? (
            <button onClick={() => navigate('/muj-profil')} className="landing-btn-solid">Přejít do aplikace</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="landing-btn-outline">Přihlásit se</button>
              <button onClick={() => navigate('/register')} className="landing-btn-solid">Registrovat se</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Správa pojištění<br />
            <span className="landing-accent">jednoduše a přehledně</span>
          </h1>
          <p className="landing-hero-sub">
            Moderní systém pro evidenci pojištěnců a jejich pojistek. Vše na jednom místě.
          </p>
          <div className="landing-hero-btns">
            {isLoggedIn ? (
              <button onClick={() => navigate('/muj-profil')} className="landing-btn-solid landing-btn-lg">Přejít do aplikace</button>
            ) : (
              <>
                <button onClick={() => navigate('/register')} className="landing-btn-solid landing-btn-lg">Začít zdarma</button>
                <button onClick={() => navigate('/login')} className="landing-btn-outline landing-btn-lg">Přihlásit se</button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features">
        <h2 className="landing-section-title">Co nabízíme</h2>
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <span className="landing-feature-icon">👤</span>
            <h3>Evidence pojištěnců</h3>
            <p>Přehledná správa všech pojištěnců s možností vyhledávání a filtrování.</p>
          </div>
          <div className="landing-feature-card">
            <span className="landing-feature-icon">📋</span>
            <h3>Správa pojistek</h3>
            <p>Každý pojištěnec má přehled svých pojistek: životní, automobilové, cestovní a další...</p>
          </div>
          <div className="landing-feature-card">
            <span className="landing-feature-icon">📊</span>
            <h3>Dashboard a statistiky</h3>
            <p>Admin přehled s klíčovými statistikami a přehledem nedávné aktivity.</p>
          </div>
          <div className="landing-feature-card">
            <span className="landing-feature-icon">🔒</span>
            <h3>Zabezpečený přístup</h3>
            <p>Bezpečné přihlášení s JWT tokeny. Admin a uživatelské role oddělené.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Připraveni začít?</h2>
        <p>Registrace je zdarma a trvá méně než minutu.</p>
        {isLoggedIn ? (
          <button onClick={() => navigate('/muj-profil')} className="landing-btn-solid landing-btn-lg">Přejít do aplikace</button>
        ) : (
          <button onClick={() => navigate('/register')} className="landing-btn-solid landing-btn-lg">Registrovat se</button>
        )}
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>© 2026 PojišťovnaApp. Všechna práva vyhrazena.</p>
      </footer>

    </div>
  );
}

export default Landing;