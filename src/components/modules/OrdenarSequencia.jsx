import { useState } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, GripVertical } from 'lucide-react'

const EXERCISES = [
  {
    id: 'geracoes',
    title: 'Gerações dos computadores',
    instruction: 'Ordene da 1ª para a 4ª geração:',
    items: [
      '1ª Geração — Válvulas',
      '2ª Geração — Transistores',
      '3ª Geração — Circuitos Integrados',
      '4ª Geração — Microprocessadores',
    ],
    exp: 'A evolução foi: válvulas eletrônicas (anos 40-50) → transistores (50-60) → circuitos integrados (60-70) → microprocessadores (70-atual).',
  },
  {
    id: 'armazenamento',
    title: 'Unidades de armazenamento',
    instruction: 'Ordene do menor para o maior:',
    items: ['Kilobyte (KB)', 'Megabyte (MB)', 'Gigabyte (GB)', 'Terabyte (TB)', 'Petabyte (PB)'],
    exp: '1 KB = 1.024 bytes · 1 MB = 1.024 KB · 1 GB = 1.024 MB · 1 TB = 1.024 GB · 1 PB = 1.024 TB.',
  },
  {
    id: 'windows',
    title: 'Evolução do Windows',
    instruction: 'Ordene do mais antigo para o mais recente:',
    items: ['MS-DOS', 'Windows 3.0', 'Windows XP', 'Windows 7', 'Windows 10', 'Windows 11'],
    exp: 'MS-DOS (1981) → Win 3.0 (1990) → Win XP (2001) → Win 7 (2009) → Win 10 (2015) → Win 11 (2021).',
  },
  {
    id: 'montagem',
    title: 'Montagem de um computador',
    instruction: 'Ordene os passos na sequência correta:',
    items: [
      'Selecionar os componentes',
      'Instalar na caixa (gabinete)',
      'Conectar todos os cabos',
      'Instalar o Sistema Operacional',
      'Instalar os drivers',
    ],
    exp: 'Primeiro escolhe-se os componentes compatíveis, monta-se no gabinete, conectam-se os cabos, instala-se o SO e por último os drivers dos dispositivos.',
  },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function ExerciseItem({ exercise, onScore }) {
  const [order, setOrder] = useState(() => shuffle(exercise.items))
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  const handleDragStart = (i) => setDragIdx(i)
  const handleDragOver = (e, i) => { e.preventDefault(); setDragOver(i) }
  const handleDrop = (e, i) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setDragOver(null); return }
    const newOrder = [...order]
    const item = newOrder.splice(dragIdx, 1)[0]
    newOrder.splice(i, 0, item)
    setOrder(newOrder)
    setDragIdx(null)
    setDragOver(null)
    setChecked(false)
  }

  // Mobile: troca adjacente com botões ↑ ↓
  const moveUp = (i) => {
    if (i === 0) return
    const newOrder = [...order]
    ;[newOrder[i - 1], newOrder[i]] = [newOrder[i], newOrder[i - 1]]
    setOrder(newOrder)
    setChecked(false)
  }
  const moveDown = (i) => {
    if (i === order.length - 1) return
    const newOrder = [...order]
    ;[newOrder[i], newOrder[i + 1]] = [newOrder[i + 1], newOrder[i]]
    setOrder(newOrder)
    setChecked(false)
  }

  const verify = () => {
    const isCorrect = order.every((item, i) => item === exercise.items[i])
    setChecked(true)
    setCorrect(isCorrect)
    onScore(isCorrect ? 20 : -5)
  }

  const reset = () => {
    setOrder(shuffle(exercise.items))
    setChecked(false)
    setCorrect(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-1">{exercise.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{exercise.instruction}</p>

      <div className="space-y-2">
        {order.map((item, i) => {
          let style = 'bg-gray-50 border-gray-200 text-gray-700'
          if (checked) {
            style = item === exercise.items[i]
              ? 'bg-green-50 border-green-400 text-green-800'
              : 'bg-red-50 border-red-400 text-red-700'
          } else if (dragOver === i) {
            style = 'bg-fundat-50 border-fundat-400 text-fundat-800 scale-105'
          }
          return (
            <div
              key={item}
              draggable={!checked}
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing ${style}`}
            >
              <GripVertical size={16} className="text-gray-300 flex-shrink-0 hidden sm:block" />
              <span className="text-sm font-medium leading-snug flex-1">{item}</span>
              {/* Botões mobile */}
              {!checked && (
                <div className="flex flex-col gap-0.5 sm:hidden">
                  <button onClick={() => moveUp(i)} className="p-0.5 text-gray-400 hover:text-petroleum-600 disabled:opacity-20" disabled={i === 0}>▲</button>
                  <button onClick={() => moveDown(i)} className="p-0.5 text-gray-400 hover:text-petroleum-600 disabled:opacity-20" disabled={i === order.length - 1}>▼</button>
                </div>
              )}
              {checked && (
                item === exercise.items[i]
                  ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  : <XCircle size={16} className="text-red-400 flex-shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      {checked && (
        <div className={`mt-4 p-3 rounded-xl text-sm ${correct ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <p className="font-semibold">{correct ? '✅ Perfeito! Ordem correta!' : '❌ Não está certo. Veja a ordem correta:'}</p>
          {!correct && (
            <ol className="mt-2 space-y-0.5">
              {exercise.items.map((item, i) => <li key={i} className="text-xs">{i + 1}. {item}</li>)}
            </ol>
          )}
          <p className="mt-2 text-xs opacity-80">{exercise.exp}</p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {!checked && (
          <button onClick={verify} className="flex items-center gap-1.5 bg-petroleum-500 hover:bg-petroleum-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">
            <CheckCircle size={14} /> Verificar
          </button>
        )}
        <button onClick={reset} className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-500 text-sm px-4 py-2 rounded-lg">
          <RotateCcw size={14} /> Embaralhar
        </button>
      </div>
    </div>
  )
}

export default function OrdenarSequencia({ onAddScore, onComplete, onNext, isCompleted }) {
  const [scores, setScores] = useState({})
  const totalDone = Object.keys(scores).length

  const handleScore = (id, pts) => {
    setScores(prev => {
      const updated = { ...prev, [id]: pts }
      onAddScore(pts)
      if (Object.keys(updated).length === EXERCISES.length) onComplete()
      return updated
    })
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold">🔢 Ordene Corretamente</h2>
        <p className="text-petroleum-100 text-sm mt-1">Arraste (ou use ▲▼ no celular) para reordenar os itens. Depois clique em "Verificar".</p>
        <p className="text-sm mt-2 opacity-75">{totalDone}/{EXERCISES.length} exercícios verificados</p>
      </div>

      <div className="space-y-5">
        {EXERCISES.map(ex => (
          <ExerciseItem key={ex.id} exercise={ex} onScore={(pts) => handleScore(ex.id, pts)} />
        ))}
      </div>

      {totalDone === EXERCISES.length && (
        <button onClick={onNext} className="flex items-center gap-2 bg-fundat-400 hover:bg-fundat-500 text-white font-bold px-6 py-3 rounded-xl">
          Próximo módulo <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
