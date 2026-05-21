import { useState, useCallback, useRef } from 'react'
import { ArrowRight, RotateCcw, Clock } from 'lucide-react'
import { useEffect } from 'react'

const WORDS = ['HARDWARE', 'SOFTWARE', 'PROCESSADOR', 'MEMORIA', 'BACKUP', 'VIRUS', 'FIREWALL', 'WINDOWS', 'LINUX', 'PENDRIVE', 'MONITOR', 'TECLADO', 'ANTIVIRUS', 'PHISHING', 'NOTEBOOK']

const GRID_SIZE = 14
const COLORS = ['bg-red-400', 'bg-blue-400', 'bg-green-500', 'bg-purple-400', 'bg-orange-400', 'bg-pink-400', 'bg-teal-400', 'bg-indigo-400', 'bg-yellow-500', 'bg-cyan-500', 'bg-lime-500', 'bg-rose-400', 'bg-violet-400', 'bg-amber-400', 'bg-sky-400']

function buildGrid(words) {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''))
  const placed = [] // [{word, cells:[{r,c}], colorClass}]

  const directions = [
    [0, 1], [1, 0], [1, 1], [-1, 1], // horizontal, vertical, diag↘, diag↗
  ]

  for (let wi = 0; wi < words.length; wi++) {
    const word = words[wi]
    let success = false
    let attempts = 0
    while (!success && attempts < 200) {
      attempts++
      const [dr, dc] = directions[Math.floor(Math.random() * directions.length)]
      const r = Math.floor(Math.random() * GRID_SIZE)
      const c = Math.floor(Math.random() * GRID_SIZE)
      const cells = []
      let fits = true
      for (let i = 0; i < word.length; i++) {
        const nr = r + dr * i, nc = c + dc * i
        if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) { fits = false; break }
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { fits = false; break }
        cells.push({ r: nr, c: nc })
      }
      if (fits) {
        cells.forEach(({ r, c }, i) => { grid[r][c] = word[i] })
        placed.push({ word, cells, colorClass: COLORS[wi % COLORS.length] })
        success = true
      }
    }
  }

  // Preenche espaços vazios com letras aleatórias
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * letters.length)]
    }
  }
  return { grid, placed }
}

export default function CacaPalavras({ onAddScore, onComplete, onNext }) {
  const [{ grid, placed }] = useState(() => buildGrid(WORDS))
  const [found, setFound] = useState([]) // word strings
  const [selecting, setSelecting] = useState([]) // [{r,c}] células clicadas
  const [highlighted, setHighlighted] = useState({}) // `${r},${c}` → colorClass
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)
  const [finished, setFinished] = useState(false)
  const [firstCell, setFirstCell] = useState(null)

  // Timer
  useEffect(() => {
    if (!running || finished) return
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [running, finished])

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const getCellKey = (r, c) => `${r},${c}`

  const checkSelection = useCallback((cells) => {
    if (cells.length < 2) return
    // Verificar se as células formam uma linha reta
    const word = cells.map(({ r, c }) => grid[r][c]).join('')
    const wordRev = word.split('').reverse().join('')

    const matchWord = WORDS.find(w => w === word || w === wordRev)
    if (matchWord && !found.includes(matchWord)) {
      const colorClass = placed.find(p => p.word === matchWord)?.colorClass || 'bg-green-500'
      const newHighlighted = { ...highlighted }
      cells.forEach(({ r, c }) => { newHighlighted[getCellKey(r, c)] = colorClass })
      setHighlighted(newHighlighted)
      const newFound = [...found, matchWord]
      setFound(newFound)
      onAddScore(15)
      if (newFound.length === WORDS.length) {
        setRunning(false)
        setFinished(true)
        onComplete()
      }
    }
  }, [grid, found, highlighted, placed, onAddScore, onComplete])

  const handleCellClick = (r, c) => {
    if (finished) return
    if (!firstCell) {
      setFirstCell({ r, c })
      setSelecting([{ r, c }])
    } else {
      // Calcula linha entre firstCell e ({r,c})
      const dr = r - firstCell.r
      const dc = c - firstCell.c
      const len = Math.max(Math.abs(dr), Math.abs(dc))
      if (len === 0) { setFirstCell(null); setSelecting([]); return }
      // Verifica se é reta (horizontal, vertical ou diagonal)
      const stepR = dr === 0 ? 0 : dr / Math.abs(dr)
      const stepC = dc === 0 ? 0 : dc / Math.abs(dc)
      if (Math.abs(dr) !== 0 && Math.abs(dc) !== 0 && Math.abs(dr) !== Math.abs(dc)) {
        // Não é reta — resetar
        setFirstCell({ r, c })
        setSelecting([{ r, c }])
        return
      }
      const cells = []
      for (let i = 0; i <= len; i++) {
        cells.push({ r: firstCell.r + stepR * i, c: firstCell.c + stepC * i })
      }
      checkSelection(cells)
      setFirstCell(null)
      setSelecting([])
    }
  }

  const reset = () => {
    setFound([])
    setSelecting([])
    setHighlighted({})
    setSeconds(0)
    setRunning(true)
    setFinished(false)
    setFirstCell(null)
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">🔍 Caça-palavras: Informática Básica</h2>
          <div className="flex items-center gap-1.5 text-sm">
            <Clock size={14} className="text-fundat-300" />
            <span>{formatTime(seconds)}</span>
          </div>
        </div>
        <p className="text-petroleum-100 text-sm mt-1">
          Clique na 1ª letra e depois na última letra da palavra para selecioná-la. ({found.length}/{WORDS.length} encontradas)
        </p>
        {firstCell && (
          <p className="text-fundat-300 text-sm mt-1 font-semibold animate-pulse">
            ✋ Início selecionado em ({firstCell.r},{firstCell.c}) — clique na última letra da palavra
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Grade */}
        <div className="overflow-x-auto flex-1">
          <div
            className="inline-grid gap-0.5 select-none"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const key = getCellKey(r, c)
                const color = highlighted[key]
                const isFirst = firstCell?.r === r && firstCell?.c === c
                return (
                  <button
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    className={`
                      w-8 h-8 md:w-9 md:h-9 rounded text-xs md:text-sm font-bold font-mono transition-all
                      ${color ? `${color} text-white scale-105` : isFirst ? 'bg-fundat-400 text-white scale-110 shadow-md' : 'bg-white hover:bg-petroleum-50 text-gray-800 border border-gray-100'}
                    `}
                  >
                    {letter}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Lista de palavras */}
        <div className="lg:w-48">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Palavras ({found.length}/{WORDS.length})</p>
          <div className="space-y-1.5">
            {WORDS.map(w => {
              const f = found.includes(w)
              const colorClass = f ? placed.find(p => p.word === w)?.colorClass : ''
              return (
                <div key={w} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${f ? `${colorClass} text-white` : 'bg-gray-100 text-gray-600'}`}>
                  <span>{f ? '✅' : '○'}</span>
                  <span className={f ? 'line-through opacity-80' : ''}>{w}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={reset} className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-medium px-5 py-3 rounded-xl">
          <RotateCcw size={16} /> Novo jogo
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
          <h3 className="text-xl font-bold">Todas as palavras encontradas!</h3>
          <p className="mt-1 opacity-90">Tempo: {formatTime(seconds)}</p>
        </div>
      )}
    </div>
  )
}
