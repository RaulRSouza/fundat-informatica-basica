import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, RotateCcw, Clock, Hash } from 'lucide-react'

const PAIRS = [
  { id: 'cpu',       a: 'CPU',         b: 'Cérebro do computador 🧠' },
  { id: 'ram',       a: 'RAM',         b: 'Memória temporária ⚡' },
  { id: 'ssd',       a: 'SSD',         b: 'Armazenamento sem peças móveis 💾' },
  { id: 'hd',        a: 'HD',          b: 'Disco rígido magnético 🖥️' },
  { id: 'gpu',       a: 'GPU',         b: 'Processamento gráfico 🎮' },
  { id: 'firewall',  a: 'Firewall',    b: 'Barreira contra invasões 🔥' },
  { id: 'phishing',  a: 'Phishing',    b: 'Golpe por link falso 🎣' },
  { id: 'backup',    a: 'Backup',      b: 'Cópia de segurança 📦' },
]

function buildCards() {
  const cards = []
  PAIRS.forEach(p => {
    cards.push({ uid: p.id + '-a', pairId: p.id, text: p.a, side: 'a' })
    cards.push({ uid: p.id + '-b', pairId: p.id, text: p.b, side: 'b' })
  })
  return cards.sort(() => Math.random() - 0.5)
}

export default function JogoDaMemoria({ onAddScore, onComplete, onNext, isCompleted }) {
  const [cards, setCards] = useState(() => buildCards())
  const [flipped, setFlipped] = useState([])   // uids virados
  const [matched, setMatched] = useState([])   // pairIds combinados
  const [attempts, setAttempts] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)
  const [finished, setFinished] = useState(false)
  const [locked, setLocked] = useState(false)

  // Cronômetro
  useEffect(() => {
    if (!running || finished) return
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [running, finished])

  const handleFlip = useCallback((uid) => {
    if (locked || finished) return
    if (flipped.includes(uid) || matched.includes(cards.find(c => c.uid === uid)?.pairId)) return
    if (flipped.length === 2) return

    const newFlipped = [...flipped, uid]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1)
      setLocked(true)
      const [a, b] = newFlipped.map(id => cards.find(c => c.uid === id))
      if (a.pairId === b.pairId) {
        // Acerto
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
        }, 600)
      } else {
        // Erro
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 1000)
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

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const pairColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500']
  const pairColorMap = Object.fromEntries(PAIRS.map((p, i) => [p.id, pairColors[i % pairColors.length]]))

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
            <span>Tempo: <strong>{formatTime(seconds)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>✅ {matched.length}/{PAIRS.length} pares</span>
          </div>
        </div>
      </div>

      {/* Grade 4x4 */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.uid)
          const isMatched = matched.includes(card.pairId)
          const show = isFlipped || isMatched
          return (
            <div
              key={card.uid}
              onClick={() => !show && handleFlip(card.uid)}
              className={`card-flip cursor-pointer aspect-square rounded-xl shadow-sm transition-transform hover:scale-105 ${isMatched ? 'opacity-80' : ''} ${show ? 'flipped' : ''}`}
              style={{ minHeight: '72px' }}
            >
              <div className="card-flip-inner">
                {/* Verso (frente mostrada = costas da carta) */}
                <div className="card-front bg-petroleum-500 rounded-xl flex items-center justify-center text-3xl text-white/30 font-bold select-none">
                  ?
                </div>
                {/* Frente (conteúdo) */}
                <div className={`card-back ${isMatched ? pairColorMap[card.pairId] : 'bg-white border-2 border-petroleum-300'} rounded-xl flex items-center justify-center p-2 text-center select-none`}>
                  <span className={`text-xs font-bold leading-tight ${isMatched ? 'text-white' : 'text-petroleum-700'}`}>
                    {card.text}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
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
          <p className="mt-1 opacity-90">Tempo: {formatTime(seconds)} · Tentativas: {attempts}</p>
          <p className="text-sm opacity-80 mt-1">+50 pontos bônus por completar!</p>
        </div>
      )}
    </div>
  )
}
