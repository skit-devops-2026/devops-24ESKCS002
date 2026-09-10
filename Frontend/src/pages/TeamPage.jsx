// pages/TeamPage.jsx — Your original team.html converted to React
import Header from '../components/Header'

const TEAM = [
  { emoji: '👨‍💻', name: 'Rahul Saini',    role: 'Developer', roll: '24ESKCA104' },
  { emoji: '👨‍💻', name: 'Rishi Sharma',   role: 'Developer', roll: '24ESKCA105' },
  { emoji: '👩‍💻', name: 'Purvi Jain',     role: 'Developer', roll: '24ESKCA103' },
  { emoji: '👨‍💻', name: 'Tanishq Jangid', role: 'Developer', roll: '24ESKCA124' },
]

export default function TeamPage() {
  return (
    <>
      <Header activePage="team" />

      <section style={{ padding: '120px 120px' }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 42,
          marginBottom: 10
        }}>
          Our Team
        </h1>
        <p style={{ color: '#7a7570', marginBottom: 60 }}>
          Meet the team behind PlacementHub
        </p>

        {/* Team grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 30
        }}>
          {TEAM.map((member) => (
            <div key={member.roll} style={{
              background: '#fff',
              border: '1px solid #e2ded9',
              borderRadius: 16,
              padding: 30,
              textAlign: 'center',
              transition: '0.3s',
              cursor: 'default'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: '#c8e6e0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30,
                margin: 'auto',
                marginBottom: 15
              }}>
                {member.emoji}
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                {member.name}
              </div>
              <div style={{ fontSize: 14, color: '#7a7570', marginBottom: 10 }}>
                {member.role}
              </div>
              <div style={{ fontSize: 13, color: '#444' }}>
                Roll No: {member.roll}
              </div>
            </div>
          ))}
        </div>

        {/* Batch info */}
        <div style={{
          marginTop: 60,
          padding: 25,
          borderRadius: 12,
          background: '#f7f7f7',
          border: '1px solid #e2ded9',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: 10 }}>Batch Details</h3>
          <p style={{ color: '#7a7570', lineHeight: 2 }}>
            B.Tech CSE (AI)<br />
            Section: AI-B<br />
            Group: 2
          </p>
        </div>
      </section>

      <footer>© 2026 PlacementHub — Connecting Talent with Opportunity</footer>
    </>
  )
}