import { useState, useEffect, useRef, useCallback } from 'react'
import { Zap, ArrowRight, RotateCcw } from 'lucide-react'

const QUESTIONS = [
  { q: 'Qual é o "cérebro" do computador?', options: ['CPU', 'RAM', 'SSD', 'GPU'], answer: 0 },
  { q: 'RAM significa Random Access...?', options: ['Memory', 'Module', 'Machine', 'Mode'], answer: 0 },
  { q: 'O SSD tem partes móveis?', options: ['Não', 'Sim', 'Depende', 'Às vezes'], answer: 0 },
  { q: 'Quem criou o Linux?', options: ['Linus Torvalds', 'Bill Gates', 'Steve Jobs', 'Mark Zuckerberg'], answer: 0 },
  { q: 'O que faz o antivírus?', options: ['Detecta e elimina vírus', 'Acelera o PC', 'Faz backup', 'Filtra rede'], answer: 0 },
  { q: 'Phishing é um...?', options: ['Golpe por link falso', 'Tipo de vírus', 'Software gratuito', 'Componente'], answer: 0 },
  { q: 'Mac OS surgiu em que ano?', options: ['1984', '1991', '2001', '1975'], answer: 0 },
  { q: 'O que é backup?', options: ['Cópia de segurança', 'Tipo de vírus', 'Memória RAM', 'Placa de vídeo'], answer: 0 },
  { q: 'USB = Universal Serial...?', options: ['Bus', 'Base', 'Bit', 'Byte'], answer: 0 },
  { q: 'O HD usa discos...?', options: ['Magnéticos', 'Ópticos', 'Flash', 'Digitais'], answer: 0 },
]

const TIMER = 10

export default function QuizRelampago({ onAddScore, onComplete, onNext }) {
  const [questions] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5))
  const [index, setIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER)
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([]) // {correct, timeUsed, pts}
  const [finished, setFinished] = useState(false)
  const timerRef = useRef(null)

  const current = questions[index]

  const handleAnswer = useCallback((optIdx) => {
    if (selected !== null) return
    clearInterval(timerRef.current)
    const correct = optIdx === current.answer
    const timeUsed = TIMER - timeLeft
    const pts = correct ? (timeLeft >= 7 ? 20 : timeLeft >= 4 ? 15 : 10) : 0
    setSelected(optIdx)
    setResults(r => [...r, { correct, timeUsed, pts }])
    onAddScore(pts)
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true)
        onComplete()
      } else {
        setIndex(i => i + 1)
        setSelected(null)
        setTimeLeft(TIMER)
      }
    }, 1200)
  }, [selected, current, timeLeft, index, questions.length, onAddScore, onComplete])

  // Timer
  useEffect(() => {
    if (finished || selected !== null) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(-1) // tempo esgotado
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [index, finished, selected])

  const reset = () => {
    setIndex(0); setTimeLeft(TIMER); setSelected(null); setResults([]); setFinished(false)
  }

  const totalPts = results.reduce((s, r) => s + r.pts, 0)
  const correctCount = results.filter(r => r.correct).length
  const pct = Math.round((correctCount / questions.length) * 100)

  if (finished) {
    return (
      <div className="space-y-6 pb-8">
        <div className={`rounded-2xl p-8 text-center text-white ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-fundat-500' : 'bg-petroleum-500'}`}>
          <Zap size={48} className="mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold">Quiz Relâmpago concluído!</h2>
          <p className="text-5xl font-bold mt-2">{pct}%</p>
          <p className="opacity-90">{correctCount}/{questions.length} acertos</p>
          <p className="text-sm opacity-80 mt-1">+{totalPts} pontos bônus por velocidade!</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">Resumo por pergunta</h3>
          <div className="space-y-2">
            {questions.map((q, i) => {
              const r = results[i]
              return (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${r?.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span>{r?.correct ? '✅' : '❌'}</span>
                  <span className="flex-1 text-gray-700 truncate">{q.q}</span>
                  {r?.pts > 0 && <span className="text-green-600 font-bold text-xs">+{r.pts}</span>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={reset} className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-medium px-5 py-3 rounded-xl">
            <RotateCcw size={16} /> Refazer
          </button>
          <button onClick={onNext} className="flex items-center gap-2 bg-fundat-400 hover:bg-fundat-500 text-white font-bold px-6 py-3 rounded-xl ml-auto">
            Próximo <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  const timerPct = (timeLeft / TIMER) * 100
  const timerColor = timeLeft > 5 ? 'bg-green-500' : timeLeft > 3 ? 'bg-fundat-400' : 'bg-red-500'
  const pulse = timeLeft <= 3

  return (
    <div className="space-y-5 pb-8">
      {/* Header relâmpago */}
      <div className={`rounded-2xl p-6 text-white transition-colors ${timeLeft <= 3 ? 'bg-red-600' : 'bg-petroleum-500'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={20} className={pulse ? 'animate-ping text-fundat-300' : 'text-fundat-300'} />
            <h2 className="text-xl font-bold">⚡ Quiz Relâmpago!</h2>
          </div>
          <span className="text-sm opacity-75">{index + 1}/{questions.length}</span>
        </div>
        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-black/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerColor} ${pulse ? 'animate-pulse' : ''}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
          <span className={`text-2xl font-black w-10 text-right ${pulse ? 'text-red-200 animate-pulse' : ''}`}>{timeLeft}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p className="text-gray-800 font-bold text-xl leading-snug mb-5 text-center">{current.q}</p>
        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt, i) => {
            let style = 'bg-gray-50 border-gray-200 hover:border-petroleum-400 hover:bg-petroleum-50 cursor-pointer text-gray-800'
            if (selected !== null) {
              if (i === current.answer) style = 'bg-green-500 border-green-500 text-white font-bold'
              else if (i === selected) style = 'bg-red-500 border-red-500 text-white font-bold'
              else style = 'bg-gray-50 border-gray-200 text-gray-400 opacity-50'
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`px-4 py-4 rounded-xl border-2 text-sm font-semibold transition-all ${style}`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Indicadores de progresso */}
      <div className="flex gap-1.5">
        {questions.map((_, i) => {
          const r = results[i]
          return (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < index ? (r?.correct ? 'bg-green-400' : 'bg-red-400') : i === index ? 'bg-fundat-400' : 'bg-gray-200'}`} />
          )
        })}
      </div>
    </div>
  )
}
