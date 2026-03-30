import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { menu } from '../data/menu'

export default function Order() {
  const { tavolo } = useParams()
  const navigate = useNavigate()
  const [carrello, setCarrello] = useState({})
  const [activeCategory, setActiveCategory] = useState(menu[0].categoria)
  const [note, setNote] = useState('')

  function addItem(item) {
    setCarrello((prev) => ({
      ...prev,
      [item.id]: {
        ...item,
        quantita: (prev[item.id]?.quantita || 0) + 1,
      },
    }))
  }

  function removeItem(itemId) {
    setCarrello((prev) => {
      const updated = { ...prev }
      if (updated[itemId]?.quantita > 1) {
        updated[itemId] = { ...updated[itemId], quantita: updated[itemId].quantita - 1 }
      } else {
        delete updated[itemId]
      }
      return updated
    })
  }

  const totaleItems = Object.values(carrello).reduce((sum, i) => sum + i.quantita, 0)
  const totale = Object.values(carrello).reduce((sum, i) => sum + i.prezzo * i.quantita, 0)

  function inviaOrdine() {
    if (totaleItems === 0) return
    const ordine = {
      tavolo,
      items: Object.values(carrello),
      note,
      totale,
      orario: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      numero: Math.floor(Math.random() * 900) + 100,
    }
    navigate('/ticket', { state: { ordine } })
  }

  const categoriaAttiva = menu.find((c) => c.categoria === activeCategory)

  return (
    <div className="page order-page">
      <div className="order-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ←
        </button>
        <div className="order-title">
          <span className="table-badge">Tavolo {tavolo}</span>
          <h2>Scegli cosa ordinare</h2>
        </div>
        {totaleItems > 0 && (
          <div className="cart-badge">{totaleItems}</div>
        )}
      </div>

      {/* Category tabs */}
      <div className="category-tabs">
        {menu.map((cat) => (
          <button
            key={cat.categoria}
            className={`category-tab ${activeCategory === cat.categoria ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.categoria)}
          >
            <span>{cat.emoji}</span>
            <span>{cat.categoria}</span>
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="menu-items">
        <h3 className="category-title">
          {categoriaAttiva.emoji} {categoriaAttiva.categoria}
        </h3>
        {categoriaAttiva.items.map((item) => {
          const qty = carrello[item.id]?.quantita || 0
          return (
            <div key={item.id} className={`menu-item ${qty > 0 ? 'selected' : ''}`}>
              <div className="item-info">
                <span className="item-name">{item.nome}</span>
                {item.descrizione && (
                  <span className="item-desc">{item.descrizione}</span>
                )}
                <span className="item-price">€{item.prezzo.toFixed(2)}</span>
              </div>
              <div className="item-controls">
                {qty > 0 ? (
                  <>
                    <button className="qty-btn" onClick={() => removeItem(item.id)}>−</button>
                    <span className="qty-count">{qty}</span>
                    <button className="qty-btn add" onClick={() => addItem(item)}>+</button>
                  </>
                ) : (
                  <button className="btn-add" onClick={() => addItem(item)}>+</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Cart summary */}
      {totaleItems > 0 && (
        <div className="cart-summary">
          <div className="cart-items-preview">
            {Object.values(carrello).map((item) => (
              <div key={item.id} className="cart-line">
                <span>{item.quantita}x {item.nome}</span>
                <span>€{(item.prezzo * item.quantita).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="note-section">
            <textarea
              placeholder="Note per la cucina (allergie, preferenze...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="note-input"
              rows={2}
            />
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              <span>Totale</span>
              <span className="total-amount">€{totale.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-large btn-order" onClick={inviaOrdine}>
              Invia Ordine →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
