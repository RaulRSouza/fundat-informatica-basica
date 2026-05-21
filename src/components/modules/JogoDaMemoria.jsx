import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, RotateCcw, Clock, Hash } from 'lucide-react'

// Cada par: carta com FOTO do componente ↔ carta com DEFINIÇÃO
const PAIRS = [
  {
    id: 'cpu',
    img: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&h=300&fit=crop&auto=format',
    imgAlt: 'Processador CPU',
    termLabel: 'CPU',
    def: 'Cérebro do computador',
    defEmoji: '🧠',
    color: '#3b82f6',
  },
  {
    id: 'ram',
    img: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=300&h=300&fit=crop&auto=format',
    imgAlt: 'Memória RAM',
    termLabel: 'RAM',
    def: 'Memória temporária — perde dados ao desligar',
    defEmoji: '⚡',
    color: '#8b5cf6',
  },
  {
    id: 'ssd',
    img: 'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=300&h=300&fit=crop&auto=format',
    imgAlt: 'SSD drive',
    termLabel: 'SSD',
    def: 'Armazenamento rápido sem peças móveis',
    defEmoji: '💾',
    color: '#10b981',
  },
  {
    id: 'hd',
    img: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=300&h=300&fit=crop&auto=format',
    imgAlt: 'HD Hard Disk',
    termLabel: 'HD',
    def: 'Disco rígido com partes mecânicas giratórias',
    defEmoji: '🔄',
    color: '#f97316',
  },
  {
    id: 'gpu',
    img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&h=300&fit=crop&auto=format',
    imgAlt: 'Placa de vídeo GPU',
    termLabel: 'GPU',
    def: 'Responsável pelo processamento gráfico',
    defEmoji: '🎮',
    color: '#ec4899',
  },
  {
    id: 'firewall',
    img: 'https://images.unsplash.com/photo-1614064641938-3bbdc4d7f598?w=300&h=300&fit=crop&auto=format',
    imgAlt: 'Firewall segurança',
    termLabel: 'Firewall',
    def: 'Filtra e bloqueia acessos indesejados na rede',
    defEmoji: '🔥',
    color: '#ef4444',
  },
  {
    id: 'phishing',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&h=300&fit=crop&auto=format',
    imgAlt: 'Phishing ataque hacker',
    termLabel: 'Phishing',
    def: 'Golpe por link falso para roubar dados',
    defEmoji: '🎣',
    color: '#f59e0b',
  },
  {
    id: 'backup',
    img: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=300&h=300&fit=crop&auto=format',
    imgAlt: 'Backup armazenamento em nuvem',
    termLabel: 'Backup',
    def: 'Cópia de segurança dos dados',
    defEmoji: '📦',
    color: '#06b6d4',
  },
]

// Emoji fallback caso a imagem não carregue
const FALLBACK_EMOJIS = {
  cpu: '🖥️', ram: '💬', ssd: '💾', hd: '💿',
  gpu: '🖼️', firewall: '🛡️', phishing: '⚠️', backup: '☁️',
}

function buildCards() {
  const cards = []
  PAIRS.forEach(p => {
    // carta A = imagem
    cards.push({ uid: p.id + '-img', pairId: p.id, type: 'img' })
    // carta B = definição
    cards.push({ uid: p.id + '-def', pairId: p.id, type: 'def' })
  })
  return cards.sort(() => Math.random() - 0.5)
}

// Carta com imagem
function ImgCard({ pair, matched }) {
  const [error, setError] = useState(false)
  const color = pair.color
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
      background: matched ? color : '#f8fafc',
      border: matched ? 'none' : `2px solid ${color}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {!error ? (
        <img
          src={pair.img}
          alt={pair.imgAlt}
          onError={() => setError(true)}
          style={{ width: '100%', height: '70%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <span style={{ fontSize: '2rem', lineHeight: 1 }}>{FALLBACK_EMOJIS[pair.id]}</span>
      )}
      <span style={{
        fontSize: '0.65rem', fontWeight: 700, color: matched ? '#fff' : color,
        paddingTop: 4, paddingBottom: 4, letterSpacing: '0.05em',
      }}>
        {pair.termLabel}
      </span>
    </div>
  )
}

// Carta com definição
function DefCard({ pair, matched }) {
  const color = pair.color
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 12,
      background: matched ? color : '#fff',
      border: matched ? 'none' : `2px solid ${color}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '6px', textAlign: 'center',
    }}>
      <span style={{ fontSize: '1.6rem', lineHeight: 1, marginBottom: 4 }}>{pair.defEmoji}</span>
      <span style={{
        fontSize: '0.6rem', fontWeight: 600, lineHeight: 1.3,
        color: matched ? '#fff' : '#374151',
      }}>
        {pair.def}
      </span>
    </div>
  )
}

// Carta individual com flip
function Card({ card, pair, isFlipped, isMatched, onClick }) {
  const show = isFlipped || isMatched
  return (
    <div
      onClick={onClick}
      style={{ perspective: '800px', cursor: show ? 'default' : 'pointer', height: 110 }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.45s ease',
        transform: show ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Frente — logo "?" */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          background: '#0d6e8a', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', color: 'rgba(255,255,255,0.2)', fontWeight: 700,
          userSelect: 'none',
        }}>
          ?
        </div>

        {/* Verso — conteúdo */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 12, overflow: 'hidden',
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
    setCards(buildCards()); setFlipped([]); setMatched([]); setAttempts(0)
    setSeconds(0); setRunning(true); setFinished(false); setLocked(false)
  }

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const pairMap = Object.fromEntries(PAIRS.map(p => [p.id, p]))

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold">🃏 Jogo da Memória — Componentes do Computador</h2>
        <p className="text-petroleum-100 text-sm mt-1">
          Encontre os 8 pares: <strong>foto do componente</strong> ↔ <strong>definição</strong>. Clique para virar.
        </p>
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

      <div className="grid grid-cols-4 gap-2 md:gap-3">
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
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold">Parabéns! Você completou o jogo!</h3>
          <p className="mt-1 opacity-90">Tempo: {fmt(seconds)} · Tentativas: {attempts}</p>
          <p className="text-sm opacity-80 mt-1">+50 pontos bônus!</p>
        </div>
      )}
    </div>
  )
}
