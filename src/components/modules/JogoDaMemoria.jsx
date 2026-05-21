import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, RotateCcw, Clock, Hash } from 'lucide-react'

const PAIRS = [
  { id: 'cpu',      a: 'CPU',       b: 'Cérebro do computador 🧠' },
  { id: 'ram',      a: 'RAM',       b: 'Memória temporária ⚡' },
  { id: 'ssd',      a: 'SSD',       b: 'Sem peças móveis 💾' },
  { id: 'hd',       a: 'HD',        b: 'Disco magnético 🖥️' },
  { id: 'gpu',      a: 'GPU',       b: 'Processamento gráfico 🎮' },
  { id: 'firewall', a: 'Firewall',  b: 'Barreira de rede 🔥' },
  { id: 'phishing', a: 'Phishing',  b: 'Golpe por link falso 🎣' },
  { id: 'backup',   a: 'Backup',    b: 'Cópia de segurança 📦' },
]

const PAIR_COLORS = {
  cpu:      '#3b82f6',
  ram:      '#8b5cf6',
  ssd:      '#10b981',
  hd:       '#f97316',
  gpu:      '#ec4899',
  firewall: '#ef4444',
  phishing: '#f59e0b',
  backup:   '#06b6d4',
}

function buildCards() {
  const cards = []
  PAIRS.forEach(p => {
    cards.push({ uid: p.id + '-a', pairId: p.id, text: p.a })
    cards.push({ uid: p.id + '-b', pairId: p.id, text: p.b })
  })
  return cards.sort(() => Math.random() - 0.5)
}

// Carta individual com flip via inline styles
function Card({ card, isFlipped, isMatched, onClick }) {
  const show = isFlipped || isMatched
  const color = PAIR_COLORS[card.pairId]

  return (
    <div
      onClick={onClick}
      style={{ perspective: '800px', cursor: show ? 'default' : 'pointer' }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '80px',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s ease',
          transform: show ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Frente — lado escondido (?) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: '#0d6e8a',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            color: 'rgba(255,255,255,0.25)',
            fontWeight: 700,
            userSelect: 'none',
          }}
        >
          ?
        </div>

        {/* Verso — conteúdo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: isMatched ? color : '#fff',
            border: isMatched ? 'none' : `2px solid ${color}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              lineHeight: 1.3,
              color: isMatched ? '#fff' : color,
            }}
          >
            {card.text}
          </span>
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
    if (!card) return
    if (flipped.includes(uid) || matched.includes(card.pairId)) return
    if (flipped.length === 2) return

    const newFlipped = [...flipped, uid]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1)
      setLocked(true)
      const [cardA, cardB] = newFlipped.map(id => cards.find(c => c.uid === id))

      if (cardA.pairId === cardB.pairId) {
        const newMatched = [...matched, cardA.pairId]
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
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 1100)
      }
    }
  }, [cards, flipped, matched, locked, finished, onAddScore, onComplete])

  const reset = () => {
    setCards(buildCards())
    setFlipped([])
    setMatched([])
    setAttempts(0)
    setSeconds(0)
    setRunning(true)
    setFinished(false)
    setLocked(false)
  }

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold">🃏 Jogo da Memória — Componentes do Computador</h2>
        <p className="text-petroleum-100 text-sm mt-1">Encontre os 8 pares. Clique nas cartas para virá-las.</p>
        <div className="flex items-center gap-6 mt-3 text-sm">
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

      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <Card
            key={card.uid}
            card={card}
            isFlipped={flipped.includes(card.uid)}
            isMatched={matched.includes(card.pairId)}
            onClick={() => handleFlip(card.uid)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-medium px-5 py-3 rounded-xl"
        >
          <RotateCcw size={16} /> Jogar novamente
        </button>
        {finished && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 bg-fundat-400 hover:bg-fundat-500 text-white font-bold px-6 py-3 rounded-xl ml-auto"
          >
            Próximo <ArrowRight size={16} />
          </button>
        )}
      </div>

      {finished && (
        <div className="bg-green-500 text-white rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold">Parabéns! Você completou o jogo!</h3>
          <p className="mt-1 opacity-90">Tempo: {fmt(seconds)} · Tentativas: {attempts}</p>
          <p className="text-sm opacity-80 mt-1">+50 pontos bônus!</p>
        </div>
      )}
    </div>
  )
}
