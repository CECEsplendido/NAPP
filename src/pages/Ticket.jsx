import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function Ticket() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const ticketRef = useRef(null)

  useEffect(() => {
    if (!state?.ordine) {
      navigate('/')
    }
  }, [state, navigate])

  if (!state?.ordine) return null

  const { ordine } = state
  const { tavolo, items, note, totale, orario, numero } = ordine

  function nuovoOrdine() {
    navigate(`/ordine/${tavolo}`)
  }

  function tornaHome() {
    navigate('/')
  }

  return (
    <div className="page ticket-page">
      <div className="ticket-success">
        <div className="success-icon">✅</div>
        <h2>Ordine Inviato!</h2>
        <p>Il tuo ordine è stato ricevuto dalla cucina</p>
      </div>

      <div className="ticket-card" ref={ticketRef}>
        <div className="ticket-header">
          <div className="ticket-logo">🍽️ NAPP</div>
          <div className="ticket-meta">
            <div className="ticket-number">Ordine #{numero}</div>
            <div className="ticket-info">
              <span>Tavolo {tavolo}</span>
              <span>·</span>
              <span>{orario}</span>
            </div>
          </div>
        </div>

        <div className="ticket-divider dashed" />

        <div className="ticket-items">
          {items.map((item) => (
            <div key={item.id} className="ticket-item">
              <div className="ticket-item-left">
                <span className="ticket-qty">{item.quantita}x</span>
                <span className="ticket-name">{item.nome}</span>
              </div>
              <span className="ticket-item-price">
                €{(item.prezzo * item.quantita).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {note && (
          <>
            <div className="ticket-divider" />
            <div className="ticket-note">
              <span className="note-label">Note:</span>
              <span className="note-text">{note}</span>
            </div>
          </>
        )}

        <div className="ticket-divider dashed" />

        <div className="ticket-totals">
          <div className="ticket-total-line subtotal">
            <span>Subtotale</span>
            <span>€{totale.toFixed(2)}</span>
          </div>
          <div className="ticket-total-line servizio">
            <span>Coperto (per persona)</span>
            <span>incluso</span>
          </div>
          <div className="ticket-total-line grand-total">
            <span>Totale</span>
            <span>€{totale.toFixed(2)}</span>
          </div>
        </div>

        <div className="ticket-divider" />

        <div className="ticket-footer">
          <p>Grazie per aver scelto NAPP!</p>
          <p className="ticket-code">
            Il cameriere porterà il tuo ordine al tavolo.
          </p>
        </div>
      </div>

      <div className="ticket-status">
        <div className="status-steps">
          <div className="status-step active">
            <div className="step-dot active" />
            <span>Ordine ricevuto</span>
          </div>
          <div className="status-line" />
          <div className="status-step">
            <div className="step-dot" />
            <span>In preparazione</span>
          </div>
          <div className="status-line" />
          <div className="status-step">
            <div className="step-dot" />
            <span>In arrivo</span>
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        <button className="btn btn-outline" onClick={nuovoOrdine}>
          + Aggiungi altri piatti
        </button>
        <button className="btn btn-primary" onClick={tornaHome}>
          Home
        </button>
      </div>
    </div>
  )
}
