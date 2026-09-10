// pages/HomePage.jsx — Your original landing page, converted to React
import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function HomePage() {
  return (
    <>
      <Header activePage="home" />

      <div className="mainpg">
        <section className="hero">
          <h1>Connect, Learn &amp; <br />Grow Together</h1>
          <p>
            PlacementHub brings institutes, students, and recruiters onto
            one clean platform — making every connection count.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-solid">Get Started</Link>
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
          </div>
        </section>

        <section id="heroimg">
          <div className="hero-right">
            <div className="img-frame">
              <div className="card-grid">
                <div className="feature-card">🔒<small>Secured</small></div>
                <div className="feature-card">👩🏻‍💻<small>User<br />Friendly</small></div>
                <div className="feature-card">✅<small>Verified<br />Recruiters</small></div>
                <div className="feature-card">🎓<small>Campus<br />Centric</small></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer>© 2026 PlacementHub — Connecting Talent with Opportunity</footer>
    </>
  )
}