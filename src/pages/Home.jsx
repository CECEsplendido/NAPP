import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page home-page">
      <div className="home-hero">
        <div className="logo-container">
          <div className="logo-icon">🍽️</div>
          <h1 className="logo-text">NAPP</h1>
          <p className="logo-tagline">Ordina al tuo tavolo</p>
        </div>

        <div className="home-actions">
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate('/scanner')}
          >
            <span className="btn-icon">📷</span>
            Scansiona QR Tavolo
          </button>

          <div className="divider">
            <span>oppure inserisci il numero tavolo</span>
          </div>

          <TableInput />
        </div>
      </div>

      <div className="home-footer">
        <p>Scansiona il QR code sul tuo tavolo per iniziare l'ordine</p>
      </div>
    </div>
  )
}

function TableInput() {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const tavolo = e.target.tavolo.value.trim()
    if (tavolo) {
      navigate(`/ordine/${encodeURIComponent(tavolo)}`)
    }
  }

  return (
    <form className="table-input-form" onSubmit={handleSubmit}>
      <input
        type="number"
        name="tavolo"
        placeholder="Numero tavolo"
        min="1"
        max="99"
        className="table-input"
        required
      />
      <button type="submit" className="btn btn-secondary">
        Vai all'Ordine
      </button>
    </form>
  )
}
