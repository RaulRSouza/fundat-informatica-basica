import { useState, useRef, useEffect } from 'react'
import { ArrowRight, RotateCcw, CheckCircle } from 'lucide-react'

const PAIRS = [
  { left: 'Windows 11',    right: 'Sistema Operacional da Microsoft' },
  { left: 'Linux',         right: 'Criado por Linus Torvalds' },
  { left: 'Mac OS',        right: 'Sistema da Apple, 1º com interface gráfica' },
  { left: 'RAM',           right: 'Memória de acesso aleatório, volátil' },
  { left: 'SSD',           right: 'Armazenamento sem partes móveis' },
  { left: 'CPU',           right: 'Unidade Central de Processamento' },
  { left: 'Ransomware',    right: 'Sequestra dados e cobra resgate' },
  { left: 'Phishing',      right: 'Golpe por link falso em e-mail ou site' },
  { left: 'Firewall',      right: 'Filtra comunicações indesejadas na rede' },
  { left: 'Backup',        right: 'Cópia de segurança dos dados' },
  { left: 'GPU',           right: 'Responsável pelo processamento gráfico' },
  { left: 'Antivírus',     right: 'Previne, detecta e elimina vírus' },
  { left: 'Placa-mãe',     right: 'Conecta e interliga todos os componentes' },
  { left: 'USB',           right: 'Universal Serial Bus' },
  { left: 'HD',            right: 'Hard Disk, usa discos magnéticos' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

const PAIR_COLORS = [
  'bg-blue-500 text-white', 'bg-purple-500 text-white', 'bg-green-600 text-white',
  'bg-orange-500 text-white', 'bg-pink-500 text-white', 'bg-teal-500 text-white',
  'bg-red-500 text-white', 'bg-indigo-500 text-white', 'bg-yellow-500 text-white',
  'bg-cyan-500 text-white', 'bg-lime-600 text-white', 'bg-rose-500 text-white',
  'bg-violet-500 text-white', 'bg-amber-600 text-white', 'bg-sky-500 text-white',
]

export default function Associacao({ onAddScore, onComplete, onNext, isCompleted }) {
  const [leftItems] = useState(() => shuffle(PAIRS).map((p, i) => ({ ...p, idx: i })))
  const [rightItems] = useState(() => shuffle(PAIRS.map((p, i) => ({ right: p.right, idx: i }))))
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [matched, setMatched] = useState([]) // [{leftIdx, rightIdx, pairId, color}]
  const [errors, setErrors] = useState([])
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [shake, setShake] = useState(null)

  const pairColors = useRef(PAIR_COLORS.slice(0, PAIRS.length))

  const getMatchForLeft = (idx) => matched.find(m => m.leftIdx === idx)
  const getMatchForRight = (idx) => matched.find(m => m.rightIdx === idx)
  const isError = (side, idx) => errors.some(e => e[side] === idx)

  const handleLeftClick = (idx) => {
    if (getMatchForLeft(idx)) return
    setSelectedLeft(idx === selectedLeft ? null : idx)
  }

  const handleRightClick = (rightIdx) => {
    if (getMatchForRight(rightIdx)) return
    if (selectedLeft === null) return

    const leftItem = leftItems.find(l => l.idx === selectedLeft)
    const rightItem = rightItems.find(r => r.idx === rightIdx)
    const originalPair = PAIRS.find(p => p.left === leftItem.left)

    if (originalPair.right === rightItem.right) {
      // Acerto
      const matchColor = pairColors.current[matched.length % pairColors.current.length]
      const newMatched = [...matched, { leftIdx: selectedLeft, rightIdx, color: matchColor }]
      setMatched(newMatched)
      setSelectedLeft(null)
      setScore(s => s + 10)
      onAddScore(10)
      if (newMatched.length === PAIRS.length) {
        setFinished(true)
        onComplete()
      }
    } else {
      // Erro
      setErrors([{ left: selectedLeft, right: rightIdx }])
      setShake(rightIdx)
      setScore(s => s - 5)
      onAddScore(-5)
      setTimeout(() => { setErrors([]); setShake(null) }, 800)
    }
  }

  const reset = () => {
    setSelectedLeft(null)
    setMatched([])
    setErrors([])
    setScore(0)
    setFinished(false)
  }

  const pct = Math.round((matched.length / PAIRS.length) * 100)

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold">🔗 Combine os Pares</h2>
        <p className="text-petroleum-100 text-sm mt-1">
          Clique em um item da esquerda, depois clique no par correto à direita.
          {selectedLeft !== null && <span className="ml-2 text-fundat-300 font-semibold animate-pulse">→ Agora clique na definição correspondente</span>}
        </p>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span>✅ {matched.length}/{PAIRS.length} pares</span>
          <div className="flex-1 h-1.5 bg-petroleum-700 rounded-full overflow-hidden">
            <div className="h-full bg-fundat-400 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span>{pct}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Coluna esquerda */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">Termos</p>
          {leftItems.map(item => {
            const match = getMatchForLeft(item.idx)
            const isSelected = selectedLeft === item.idx
            const isErr = isError('left', item.idx)
            let style = 'bg-white border-gray-200 text-gray-800 hover:border-petroleum-300 hover:bg-petroleum-50 cursor-pointer'
            if (match) style = `${match.color} border-transparent font-semibold`
            else if (isSelected) style = 'bg-fundat-50 border-fundat-400 text-fundat-800 font-semibold scale-105 shadow-md cursor-pointer'
            else if (isErr) style = 'bg-red-50 border-red-400 text-red-700 cursor-pointer'
            return (
              <button
                key={item.idx}
                onClick={() => !match && handleLeftClick(item.idx)}
                className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm text-left transition-all ${style}`}
              >
                {match && <CheckCircle className="inline mr-1.5 text-white/70" size={13} />}
                {item.left}
              </button>
            )
          })}
        </div>

        {/* Coluna direita */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">Definições</p>
          {rightItems.map(item => {
            const match = getMatchForRight(item.idx)
            const isErr = isError('right', item.idx)
            const isShaking = shake === item.idx
            let style = `bg-white border-gray-200 text-gray-800 ${selectedLeft !== null && !match ? 'hover:border-petroleum-300 hover:bg-petroleum-50 cursor-pointer' : 'cursor-default'}`
            if (match) style = `${match.color} border-transparent font-semibold`
            else if (isErr) style = 'bg-red-50 border-red-400 text-red-700'
            return (
              <button
                key={item.idx}
                onClick={() => !match && handleRightClick(item.idx)}
                className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm text-left transition-all ${style} ${isShaking ? 'shake' : ''}`}
              >
                {match && <CheckCircle className="inline mr-1.5 text-white/70" size={13} />}
                {item.right}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={reset} className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-medium px-5 py-3 rounded-xl">
          <RotateCcw size={16} /> Reiniciar
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
          <h3 className="text-xl font-bold">Todos os pares encontrados!</h3>
          <p className="mt-1 opacity-90">Pontos: {score > 0 ? '+' : ''}{score}</p>
        </div>
      )}
    </div>
  )
}
