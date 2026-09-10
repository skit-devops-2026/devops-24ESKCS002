// pages/AboutPage.jsx — Your original about.html converted to React
import { NavLink } from 'react-router-dom'
import Header from '../components/Header'

export default function AboutPage() {
  return (
    <>
      <Header activePage="about" />

      {/* About Hero */}
      <section style={{ padding: '120px 150px 40px 150px', maxWidth: 1000 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 48 }}>
          About PlacementHub
        </h1>
        <p style={{ marginTop: 20, fontSize: 18, color: '#7a7570', lineHeight: 1.7 }}>
          PlacementHub is a modern platform designed to simplify and strengthen the
          connection between students, institutes, and recruiters. Our goal is to create
          a single ecosystem where career opportunities, academic institutions, and
          industry professionals collaborate efficiently.
        </p>
      </section>

      {/* Mission */}
      <section style={{ padding: '40px 150px', maxWidth: 1000 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32 }}>Our Mission</h2>
        <p style={{ marginTop: 15, color: '#7a7570', lineHeight: 1.8 }}>
          Our mission is to bridge the gap between education and employment by providing
          a streamlined platform where students can showcase their skills, recruiters
          can discover talented candidates, and institutes can manage placement
          activities more effectively.
        </p>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 150px' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32 }}>Why PlacementHub?</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 30,
          marginTop: 40
        }}>
          <div className="feature-card">🔒<small>Secure Platform</small></div>
          <div className="feature-card">👩🏻‍💻<small>User Friendly</small></div>
          <div className="feature-card">✅<small>Verified Recruiters</small></div>
          <div className="feature-card">🎓<small>Campus Focused</small></div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '60px 150px', maxWidth: 1000 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32 }}>Our Story</h2>
        <p style={{ marginTop: 20, color: '#7a7570', lineHeight: 1.8 }}>
          PlacementHub was created with the vision of simplifying campus placements.
          Traditional placement systems often involve scattered information, manual
          processes, and communication gaps between institutes and companies.
        </p>
        <p style={{ marginTop: 16, color: '#7a7570', lineHeight: 1.8 }}>
          PlacementHub solves this by bringing everything into one organized digital
          platform. Students can discover opportunities, recruiters can connect with
          verified talent, and institutes can manage placement activities with ease.
        </p>
      </section>

      <footer>© 2026 PlacementHub — Connecting Talent with Opportunity</footer>
    </>
  )
}