import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import Order from './pages/Order'
import Ticket from './pages/Ticket'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/ordine/:tavolo" element={<Order />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
