import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, RotateCcw, Clock, Hash } from 'lucide-react'

// Imagens do Wikimedia Commons — domínio público, sem API key
const PAIRS = [
  {
    id: 'cpu',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Intel_80486DX2_bottom.jpg/240px-Intel_80486DX2_bottom.jpg',
    termLabel: 'CPU',
    def: 'Cérebro do computador',
    defEmoji: '🧠',
    color: '#3b82f6',
    fallback: '🖥️',
  },
  {
    id: 'ram',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Swissbit_2GB_PC2-5300U-555.jpg/240px-Swissbit_2GB_PC2-5300U-555.jpg',
    termLabel: 'RAM',
    def: 'Memória temporária — perde dados ao desligar',
    defEmoji: '⚡',
    color: '#8b5cf6',
    fallback: '💬',
  },
  {
    id: 'ssd',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Super_Talent_2.5in_SATA_SSD_SAM.jpg/240px-Super_Talent_2.5in_SATA_SSD_SAM.jpg',
    termLabel: 'SSD',
    def: 'Armazenamento rápido sem peças móveis',
    defEmoji: '💾',
    color: '#10b981',
    fallback: '💿',
  },
  {
    id: 'hd',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Seagate_ST33232A_hard_disk_inner_view.jpg/240px-Seagate_ST33232A_hard_disk_inner_view.jpg',
    termLabel: 'HD',
    def: 'Disco rígido com partes mecânicas giratórias',
    defEmoji: '🔄',
    color: '#f97316',
    fallback: '🔧',
  },
  {
    id: 'gpu',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/MSI_GeForce_GTX_1050_Ti_4GT_OC.jpg/240px-MSI_GeForce_GTX_1050_Ti_4GT_OC.jpg',
    termLabel: 'GPU',
    def: 'Responsável pelo processamento gráfico',
    defEmoji: '🎮',
    color: '#ec4899',
    fallback: '🖼️',
  },
  {
    id: 'firewall',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lock-Combination.jpg/240px-Lock-Combination.jpg',
    termLabel: 'Firewall',
    def: 'Filtra e bloqueia acessos indesejados na rede',
    defEmoji: '🔥',
    color: '#ef4444',
    fallback: '🛡️',
  },
  {
    id: 'phishing',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/240px-Tsunami_by_hokusai_19th_century.jpg',
    termLabel: 'Phishing',
    def: 'Golpe por link falso para roubar dados',
    defEmoji: '🎣',
    color: '#f59e0b',
    fallback: '⚠️',
  },
  {
    id: 'backup',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Usb-thumb-drive-3.0.jpg/240px-Usb-thumb-drive-3.0.jpg',
    termLabel: 'Backup',
    def: 'Cópia de segurança dos dados',
    defEmoji: '📦',
    color: '#06b6d4',
    fallback: '☁️',
  },
]

function buildCards() {
  const cards = []
  PAIRS.forEach(p => {
    cards.push({ uid: p.id + '-img', pairId: p.id, type: 'img' })
    cards.push({ uid: p.id + '-def', pairId: p.id, type: 'def' })
  })
  return cards.sort(() => Math.random() - 0.5)
}

function ImgCard({ pair, matched }) {
  const [error, setError] = useState(false)
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
      background: matched ? pair.color : '#f1f5f9',
      border: `3px solid ${pair.color}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {!error ? (
        <img
          src={pair.img}
          alt={pair.termLabel}
          onError={() => setError(true)}
          style={{ width: '100%', height: '75%', objectFit: 'cover', display: 'block' }}
          crossOrigin="anonymous"
        />
      ) : (
        <span style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: 6 }}>
          {pair.fallback}
        </span>
      )}
      <div style={{
        background: pair.color,
        width: '100%', textAlign: 'center',
        padding: '5px 4px',
        fontSize: '0.8rem', fontWeight: 800,
        color: '#fff', letterSpacing: '0.05em',
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {pair.termLabel}
      </div>
    </div>
  )
}

function DefCard({ pair, matched }) {
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 12,
      background: matched ? pair.color : '#fff',
      border: `3px solid ${pair.color}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '10px', textAlign: 'center', gap: 6,
    }}>
      <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{pair.defEmoji}</span>
      <span style={{
        fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.35,
        color: matched ? '#fff' : '#1f2937',
      }}>
        {pair.def}
      </span>
    </div>
  )
}

function Card({ card, pair, isFlipped, isMatched, onClick }) {
  const show = isFlipped || isMatched
  return (
    <div
      onClick={onClick}
      style={{ perspective: '900px', cursor: show ? 'default' : 'pointer', height: 160 }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        transform: show ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Frente — "?" */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #0d6e8a 0%, #0a5870 100%)',
          borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 6,
          userSelect: 'none', cursor: 'pointer',
        }}>
          <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>?</span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.1em' }}>
            CLIQUE
          </span>
        </div>

        {/* Verso — conteúdo */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {card.type === 'img'
            ? <ImgCard pair={pair} matched={isMatched} />
            : <DefCard pair={pair} matched={isMatched} />
          }
        </div>
      </div>
    </div>
  )
}

export default function JogoDaMemoria({ onAddScore, onComplete, onNext }) {
  const [cards, setCards] = useState(() => buildCards())
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)
  const [finished, setFinished] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (!running || finished) return
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [running, finished])

  const handleFlip = useCallback((uid) => {
    if (locked || finished) return
    const card = cards.find(c => c.uid === uid)
    if (!card || flipped.includes(uid) || matched.includes(card.pairId)) return
    if (flipped.length === 2) return

    const newFlipped = [...flipped, uid]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1)
      setLocked(true)
      const [a, b] = newFlipped.map(id => cards.find(c => c.uid === id))
      if (a.pairId === b.pairId) {
        const newMatched = [...matched, a.pairId]
        setTimeout(() => {
          setMatched(newMatched)
          setFlipped([])
          setLocked(false)
          if (newMatched.length === PAIRS.length) {
            setRunning(false)
            setFinished(true)
            onAddScore(50)
            onComplete()
          }
        }, 700)
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false) }, 1100)
      }
    }
  }, [cards, flipped, matched, locked, finished, onAddScore, onComplete])

  const reset = () => {
    setCards(buildCards()); setFlipped([]); setMatched([])
    setAttempts(0); setSeconds(0); setRunning(true)
    setFinished(false); setLocked(false)
  }

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const pairMap = Object.fromEntries(PAIRS.map(p => [p.id, p]))

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold">🃏 Jogo da Memória — Componentes do Computador</h2>
        <p className="text-petroleum-100 text-sm mt-1">
          Encontre os 8 pares: <strong>foto do componente</strong> ↔ <strong>definição</strong>
        </p>
        <div className="flex flex-wrap items-center gap-5 mt-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Hash size={14} className="text-fundat-300" />
            <span>Tentativas: <strong>{attempts}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-fundat-300" />
            <span>Tempo: <strong>{fmt(seconds)}</strong></span>
          </div>
          <span>✅ {matched.length}/{PAIRS.length} pares</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(card => (
          <Card
            key={card.uid}
            card={card}
            pair={pairMap[card.pairId]}
            isFlipped={flipped.includes(card.uid)}
            isMatched={matched.includes(card.pairId)}
            onClick={() => handleFlip(card.uid)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={reset} className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-medium px-5 py-3 rounded-xl">
          <RotateCcw size={16} /> Jogar novamente
        </button>
        {finished && (
          <button onClick={onNext} className="flex items-center gap-2 bg-fundat-400 hover:bg-fundat-500 text-white font-bold px-6 py-3 rounded-xl ml-auto">
            Próximo <ArrowRight size={16} />
          </button>
        )}
      </div>

      {finished && (
        <div className="bg-green-500 text-white rounded-2xl p-6 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold">Parabéns! Você completou o jogo!</h3>
          <p className="mt-2 opacity-90 text-lg">Tempo: {fmt(seconds)} · Tentativas: {attempts}</p>
          <p className="text-sm opacity-80 mt-1">+50 pontos bônus!</p>
        </div>
      )}
    </div>
  )
}
