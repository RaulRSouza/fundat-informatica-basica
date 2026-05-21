import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, RotateCcw, Clock, Hash, Cpu, Database, HardDrive, Monitor, Shield, Fish, Cloud, Server } from 'lucide-react'

// Cada par: carta VISUAL (ícone estilizado) ↔ carta DEFINIÇÃO
const PAIRS = [
  {
    id: 'cpu',
    Icon: Cpu,
    termLabel: 'CPU',
    bg: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    def: 'Cérebro do computador — executa todas as instruções',
    defEmoji: '🧠',
    light: '#dbeafe',
    dark: '#1d4ed8',
  },
  {
    id: 'ram',
    Icon: Database,
    termLabel: 'RAM',
    bg: 'linear-gradient(135deg,#6d28d9,#8b5cf6)',
    def: 'Memória temporária — perde dados ao desligar',
    defEmoji: '⚡',
    light: '#ede9fe',
    dark: '#6d28d9',
  },
  {
    id: 'ssd',
    Icon: HardDrive,
    termLabel: 'SSD',
    bg: 'linear-gradient(135deg,#065f46,#10b981)',
    def: 'Armazenamento sem partes móveis, rápido e silencioso',
    defEmoji: '💾',
    light: '#d1fae5',
    dark: '#065f46',
  },
  {
    id: 'hd',
    Icon: Server,
    termLabel: 'HD',
    bg: 'linear-gradient(135deg,#b45309,#f97316)',
    def: 'Disco magnético com partes mecânicas giratórias',
    defEmoji: '🔄',
    light: '#ffedd5',
    dark: '#b45309',
  },
  {
    id: 'gpu',
    Icon: Monitor,
    termLabel: 'GPU',
    bg: 'linear-gradient(135deg,#9d174d,#ec4899)',
    def: 'Processamento gráfico: jogos, vídeo e 3D',
    defEmoji: '🎮',
    light: '#fce7f3',
    dark: '#9d174d',
  },
  {
    id: 'firewall',
    Icon: Shield,
    termLabel: 'Firewall',
    bg: 'linear-gradient(135deg,#991b1b,#ef4444)',
    def: 'Filtra comunicações indesejadas e bloqueia invasões',
    defEmoji: '🔥',
    light: '#fee2e2',
    dark: '#991b1b',
  },
  {
    id: 'phishing',
    Icon: Fish,
    termLabel: 'Phishing',
    bg: 'linear-gradient(135deg,#b45309,#f59e0b)',
    def: 'Golpe por link falso para roubar senhas e dados',
    defEmoji: '🎣',
    light: '#fef3c7',
    dark: '#b45309',
  },
  {
    id: 'backup',
    Icon: Cloud,
    termLabel: 'Backup',
    bg: 'linear-gradient(135deg,#0e7490,#06b6d4)',
    def: 'Cópia de segurança dos dados em outro dispositivo',
    defEmoji: '📦',
    light: '#cffafe',
    dark: '#0e7490',
  },
]

function buildCards() {
  const cards = []
  PAIRS.forEach(p => {
    cards.push({ uid: p.id + '-visual', pairId: p.id, type: 'visual' })
    cards.push({ uid: p.id + '-def',    pairId: p.id, type: 'def'    })
  })
  return cards.sort(() => Math.random() - 0.5)
}

// Carta visual: gradiente + ícone grande + label
function VisualCard({ pair, matched }) {
  const Icon = pair.Icon
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
      background: matched ? pair.bg : pair.light,
      border: `3px solid ${pair.dark}`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Área do "ícone/foto" */}
      <div style={{
        flex: 1,
        background: pair.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={52} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />
      </div>
      {/* Label inferior */}
      <div style={{
        background: pair.dark,
        textAlign: 'center',
        padding: '6px 4px',
        fontSize: '0.82rem',
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '0.05em',
      }}>
        {pair.termLabel}
      </div>
    </div>
  )
}

// Carta definição: fundo claro + emoji + texto
function DefCard({ pair, matched }) {
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 12,
      background: matched ? pair.bg : '#fff',
      border: `3px solid ${pair.dark}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '10px', textAlign: 'center', gap: 8,
    }}>
      <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{pair.defEmoji}</span>
      <span style={{
        fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.4,
        color: matched ? '#fff' : '#1f2937',
      }}>
        {pair.def}
      </span>
    </div>
  )
}

// Carta com animação de flip
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
          background: 'linear-gradient(135deg,#0d6e8a 0%,#065f6b 100%)',
          borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8,
          userSelect: 'none', cursor: 'pointer',
        }}>
          <span style={{ fontSize: '2.8rem', opacity: 0.25 }}>?</span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.12em' }}>
            CLIQUE
          </span>
        </div>

        {/* Verso — conteúdo */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          {card.type === 'visual'
            ? <VisualCard pair={pair} matched={isMatched} />
            : <DefCard   pair={pair} matched={isMatched} />
          }
        </div>
      </div>
    </div>
  )
}

export default function JogoDaMemoria({ onAddScore, onComplete, onNext }) {
  const [cards, setCards]     = useState(() => buildCards())
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [seconds, setSeconds]   = useState(0)
  const [running, setRunning]   = useState(true)
  const [finished, setFinished] = useState(false)
  const [locked, setLocked]     = useState(false)

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

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const pairMap = Object.fromEntries(PAIRS.map(p => [p.id, p]))

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold">🃏 Jogo da Memória — Componentes do Computador</h2>
        <p className="text-petroleum-100 text-sm mt-1">
          Encontre os 8 pares: <strong>componente</strong> ↔ <strong>definição</strong>. Clique para virar.
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
