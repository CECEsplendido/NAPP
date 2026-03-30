import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'

export default function Scanner() {
  const navigate = useNavigate()
  const scannerRef = useRef(null)
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    startScanner(scanner)

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(() => {})
      }
    }
  }, [])

  function startScanner(scanner) {
    setScanning(true)
    setError(null)

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleQRCode(decodedText, scanner)
        },
        () => {}
      )
      .catch((err) => {
        setScanning(false)
        setError('Impossibile accedere alla fotocamera. Verifica i permessi.')
        console.error(err)
      })
  }

  function handleQRCode(text, scanner) {
    scanner.stop().catch(() => {})

    // Supporta vari formati QR:
    // - "tavolo:5"
    // - "5"
    // - "table=5"
    // - URL con ?tavolo=5 o ?table=5 o /ordine/5
    let tavolo = null

    const urlMatch = text.match(/[?&](tavolo|table)=(\d+)/i)
    if (urlMatch) {
      tavolo = urlMatch[2]
    } else if (text.match(/\/ordine\/(\d+)/i)) {
      tavolo = text.match(/\/ordine\/(\d+)/i)[1]
    } else if (text.match(/^tavolo[:=]\s*(\d+)$/i)) {
      tavolo = text.match(/^tavolo[:=]\s*(\d+)$/i)[1]
    } else if (text.match(/^table[:=]\s*(\d+)$/i)) {
      tavolo = text.match(/^table[:=]\s*(\d+)$/i)[1]
    } else if (text.match(/^\d+$/)) {
      tavolo = text.trim()
    }

    if (tavolo) {
      navigate(`/ordine/${tavolo}`)
    } else {
      setError(`QR non riconosciuto: "${text}". Usa un QR del tavolo.`)
      setScanning(false)
      setTimeout(() => startScanner(scannerRef.current), 2000)
    }
  }

  return (
    <div className="page scanner-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Indietro
        </button>
        <h2>Scansiona QR Tavolo</h2>
      </div>

      <div className="scanner-container">
        <div id="qr-reader" className="qr-reader" />

        {!error && scanning && (
          <div className="scanner-hint">
            <p>Inquadra il QR code sul tuo tavolo</p>
            <div className="scanner-animation" />
          </div>
        )}

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => startScanner(scannerRef.current)}
            >
              Riprova
            </button>
          </div>
        )}
      </div>

      <div className="scanner-demo">
        <p>Per test, usa uno di questi QR di esempio:</p>
        <div className="demo-buttons">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className="btn btn-outline"
              onClick={() => navigate(`/ordine/${n}`)}
            >
              Tavolo {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
