import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react'

// Todos os itens para classificar
const ALL_ITEMS = [
  // Hardware
  { id: 'teclado',       label: 'Teclado',            correct: 'hardware' },
  { id: 'mouse',         label: 'Mouse',              correct: 'hardware' },
  { id: 'monitor',       label: 'Monitor',            correct: 'hardware' },
  { id: 'impressora',    label: 'Impressora',         correct: 'hardware' },
  { id: 'webcam',        label: 'Webcam',             correct: 'hardware' },
  { id: 'hd',            label: 'HD',                 correct: 'hardware' },
  { id: 'ssd',           label: 'SSD',                correct: 'hardware' },
  { id: 'pendrive',      label: 'Pendrive',           correct: 'hardware' },
  { id: 'placa-mae',     label: 'Placa-mãe',          correct: 'hardware' },
  { id: 'cpu',           label: 'CPU',                correct: 'hardware' },
  { id: 'ram',           label: 'RAM',                correct: 'hardware' },
  { id: 'gpu',           label: 'GPU',                correct: 'hardware' },
  { id: 'roteador',      label: 'Roteador',           correct: 'hardware' },
  { id: 'scanner',       label: 'Scanner',            correct: 'hardware' },
  { id: 'caixa-som',     label: 'Caixa de Som',       correct: 'hardware' },
  { id: 'cd',            label: 'CD/DVD',             correct: 'hardware' },
  { id: 'fonte',         label: 'Fonte de Alimentação', correct: 'hardware' },
  { id: 'notebook',      label: 'Notebook',           correct: 'hardware' },
  { id: 'tablet',        label: 'Tablet',             correct: 'hardware' },
  { id: 'smartphone',    label: 'Smartphone',         correct: 'hardware' },
  // Software
  { id: 'windows11',     label: 'Windows 11',         correct: 'software' },
  { id: 'linux',         label: 'Linux',              correct: 'software' },
  { id: 'macos',         label: 'Mac OS',             correct: 'software' },
  { id: 'word',          label: 'Word',               correct: 'software' },
  { id: 'excel',         label: 'Excel',              correct: 'software' },
  { id: 'powerpoint',    label: 'PowerPoint',         correct: 'software' },
  { id: 'chrome',        label: 'Google Chrome',      correct: 'software' },
  { id: 'firefox',       label: 'Firefox',            correct: 'software' },
  { id: 'antivirus',     label: 'Antivírus',          correct: 'software' },
  { id: 'paint',         label: 'Paint',              correct: 'software' },
  { id: 'whatsapp',      label: 'WhatsApp',           correct: 'software' },
  { id: 'youtube',       label: 'YouTube',            correct: 'software' },
  { id: 'google',        label: 'Google',             correct: 'software' },
  { id: 'photoshop',     label: 'Photoshop',          correct: 'software' },
  { id: 'bloco',         label: 'Bloco de Notas',     correct: 'software' },
  { id: 'vlc',           label: 'VLC',                correct: 'software' },
  { id: 'spotify',       label: 'Spotify',            correct: 'software' },
  { id: 'gmail',         label: 'Gmail',              correct: 'software' },
  { id: 'android',       label: 'Android',            correct: 'software' },
  { id: 'ios',           label: 'iOS',                correct: 'software' },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function DragDrop({ onAddScore, onComplete, onNext, isCompleted }) {
  const [items] = useState(() => shuffle(ALL_ITEMS))
  const [placed, setPlaced] = useState({}) // id → { column, correct }
  const [draggedId, setDraggedId] = useState(null)
  const [selected, setSelected] = useState(null) // para clique mobile
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const unplaced = items.filter(item => !placed[item.id])
  const hardwareItems = items.filter(item => placed[item.id]?.column === 'hardware')
  const softwareItems = items.filter(item => placed[item.id]?.column === 'software')

  // — Drag & Drop desktop —
  const handleDragStart = (e, id) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  const handleDrop = useCallback((e, column) => {
    e.preventDefault()
    if (!draggedId) return
    placeItem(draggedId, column)
    setDraggedId(null)
  }, [draggedId, placed])

  // — Clique (mobile friendly) —
  const handleItemClick = (id) => {
    if (submitted) return
    if (placed[id]) {
      // Remove do lugar se clicar novamente
      setPlaced(prev => { const n = { ...prev }; delete n[id]; return n })
      return
    }
    if (selected === id) { setSelected(null); return }
    setSelected(id)
  }
  const handleColumnClick = (column) => {
    if (submitted || !selected) return
    placeItem(selected, column)
    setSelected(null)
  }

  const placeItem = (id, column) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    setPlaced(prev => ({ ...prev, [id]: { column } }))
  }

  const handleSubmit = () => {
    if (unplaced.length > 0) {
      alert(`Ainda faltam ${unplaced.length} item(ns) para classificar!`)
      return
    }
    let pts = 0
    const result = {}
    items.forEach(item => {
      const p = placed[item.id]
      const correct = p?.column === item.correct
      result[item.id] = { ...p, correct }
      pts += correct ? 10 : -5
    })
    setPlaced(result)
    setScore(pts)
    setSubmitted(true)
    setShowResult(true)
    onAddScore(pts)
    onComplete()
  }

  const handleReset = () => {
    setPlaced({})
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setSubmitted(false)
  }

  const correctCount = Object.values(placed).filter(p => p.correct).length
  const pct = submitted ? Math.round((correctCount / items.length) * 100) : 0

  const renderItem = (item) => {
    const p = placed[item.id]
    const isSelected = selected === item.id
    let bg = 'bg-white border-gray-200 hover:border-petroleum-300 hover:bg-petroleum-50'
    if (submitted && p) {
      bg = p.correct ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'
    } else if (isSelected) {
      bg = 'bg-fundat-50 border-fundat-400 scale-105 shadow-md'
    }
    return (
      <div
        key={item.id}
        draggable={!submitted}
        onDragStart={(e) => handleDragStart(e, item.id)}
        onClick={() => handleItemClick(item.id)}
        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium cursor-grab active:cursor-grabbing transition-all select-none ${bg}`}
      >
        {submitted && p && (p.correct ? '✅ ' : '❌ ')}
        {item.label}
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold">🖱️ Hardware ou Software?</h2>
        <p className="text-petroleum-100 text-sm mt-1">
          Arraste (ou clique) cada item para a coluna correta. São {items.length} itens no total.
        </p>
        {selected && (
          <p className="mt-2 text-fundat-300 text-sm font-semibold animate-pulse">
            ✋ "{items.find(i => i.id === selected)?.label}" selecionado — clique em uma coluna para colocar
          </p>
        )}
      </div>

      {/* Fila de itens não posicionados */}
      {!submitted && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
            Para classificar ({unplaced.length} restantes)
          </p>
          <div className="flex flex-wrap gap-2">
            {unplaced.map(renderItem)}
            {unplaced.length === 0 && (
              <p className="text-green-600 text-sm font-medium">Todos classificados! 👍 Agora clique em "Ver resultado".</p>
            )}
          </div>
        </div>
      )}

      {/* Colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'hardware', label: '🔧 Hardware', color: 'border-blue-300 bg-blue-50', header: 'bg-blue-500', items: hardwareItems },
          { key: 'software', label: '💾 Software', color: 'border-purple-300 bg-purple-50', header: 'bg-purple-500', items: softwareItems },
        ].map(col => (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.key)}
            onClick={() => handleColumnClick(col.key)}
            className={`rounded-xl border-2 min-h-[160px] transition-all ${col.color} ${selected ? 'cursor-pointer scale-[1.01] shadow-lg' : ''}`}
          >
            <div className={`${col.header} text-white text-sm font-bold px-4 py-2 rounded-t-[10px]`}>
              {col.label} ({col.items.length})
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              {col.items.map(renderItem)}
            </div>
          </div>
        ))}
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-3">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={unplaced.length > 0}
            className="flex items-center gap-2 bg-petroleum-500 hover:bg-petroleum-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            <CheckCircle size={18} />
            Ver resultado
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-medium px-5 py-3 rounded-xl transition-all"
        >
          <RotateCcw size={16} />
          Reiniciar
        </button>
        {submitted && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 bg-fundat-400 hover:bg-fundat-500 text-white font-bold px-6 py-3 rounded-xl transition-all ml-auto"
          >
            Próximo módulo
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Resultado */}
      {showResult && (
        <div className={`rounded-2xl p-6 text-white ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-fundat-500' : 'bg-red-500'}`}>
          <h3 className="text-xl font-bold mb-1">
            {pct >= 70 ? '🏆 Excelente!' : pct >= 50 ? '📈 Bom progresso!' : '💪 Continue praticando!'}
          </h3>
          <p className="text-lg">Acertos: {correctCount}/{items.length} ({pct}%)</p>
          <p className="text-sm opacity-90 mt-1">Pontos desta atividade: {score > 0 ? '+' : ''}{score}</p>
        </div>
      )}
    </div>
  )
}
