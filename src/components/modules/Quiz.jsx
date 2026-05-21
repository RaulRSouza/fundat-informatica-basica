import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

const ALL_QUESTIONS = [
  { q: 'O que é hardware?', options: ['Parte física do computador','Programa instalado no PC','Sistema operacional','Arquivo digital'], answer: 0, exp: 'Hardware são todos os componentes físicos e tangíveis do computador, como teclado, mouse, monitor e CPU.' },
  { q: 'Qual é o "cérebro" do computador?', options: ['CPU','RAM','HD','GPU'], answer: 0, exp: 'A CPU (Unidade Central de Processamento) é responsável por executar instruções e processar dados — é o cérebro do computador.' },
  { q: 'O que significa a sigla RAM?', options: ['Random Access Memory','Read All Memory','Rapid Access Module','Remote Access Memory'], answer: 0, exp: 'RAM = Random Access Memory (Memória de Acesso Aleatório). É a memória temporária usada pelo sistema enquanto trabalha.' },
  { q: 'Qual sistema operacional foi criado por Linus Torvalds?', options: ['Linux','Windows','Mac OS','Android'], answer: 0, exp: 'Linus Torvalds criou o kernel Linux em 1991, que é a base do sistema operacional Linux.' },
  { q: 'O que é phishing?', options: ['Roubo de senhas por link falso','Tipo de vírus que apaga arquivos','Programa de backup automático','Componente de rede'], answer: 0, exp: 'Phishing é uma técnica de golpe onde criminosos enviam links ou e-mails falsos para roubar dados pessoais e senhas.' },
  { q: 'Qual tipo de armazenamento NÃO possui partes móveis?', options: ['SSD','HD','DVD','CD'], answer: 0, exp: 'O SSD (Solid-State Drive) usa memória flash e não tem peças mecânicas em movimento, sendo mais rápido e resistente que o HD.' },
  { q: 'O que faz o firewall?', options: ['Bloqueia acessos indevidos na rede','Apaga vírus do computador','Acelera a internet','Faz backup dos dados'], answer: 0, exp: 'O firewall monitora e filtra o tráfego de rede, bloqueando acessos não autorizados e comunicações suspeitas.' },
  { q: 'Qual foi o primeiro sistema operacional com interface gráfica?', options: ['Mac OS','Windows','Linux','MS-DOS'], answer: 0, exp: 'O Mac OS da Apple, lançado em 1984, foi o primeiro SO de uso comercial com interface gráfica (janelas, ícones e mouse).' },
  { q: 'O que significa USB?', options: ['Universal Serial Bus','United System Base','Ultra Speed Bridge','Unified Software Bus'], answer: 0, exp: 'USB = Universal Serial Bus. É um padrão de conexão amplamente usado para conectar periféricos ao computador.' },
  { q: 'O que é backup?', options: ['Cópia de segurança dos dados','Tipo de vírus','Programa antivírus','Memória temporária'], answer: 0, exp: 'Backup é a cópia de segurança dos seus dados, guardada em local separado para recuperação em caso de perda ou dano.' },
  { q: 'O que é software?', options: ['Conjunto de programas e sistemas','Componente físico do PC','Tipo de memória','Porta de conexão'], answer: 0, exp: 'Software é o conjunto de programas, sistemas e instruções que fazem o hardware funcionar e executar tarefas.' },
  { q: 'Qual memória PERDE os dados ao desligar o computador?', options: ['RAM','HD','SSD','Pendrive'], answer: 0, exp: 'A RAM é uma memória volátil: ela precisa de energia elétrica constante e perde todos os dados quando o computador é desligado.' },
  { q: 'O que é ransomware?', options: ['Vírus que sequestra dados e cobra resgate','Programa de proteção','Tipo de backup','Componente de hardware'], answer: 0, exp: 'Ransomware é um malware que criptografa os dados da vítima e exige pagamento (resgate) para devolver o acesso.' },
  { q: 'Qual empresa criou o Windows?', options: ['Microsoft','Apple','Google','IBM'], answer: 0, exp: 'O Windows foi criado pela Microsoft, fundada por Bill Gates e Paul Allen, e lançado comercialmente em 1985.' },
  { q: 'O que é GPU?', options: ['Unidade de Processamento Gráfico','Memória de vídeo','Placa de rede','Fonte de energia'], answer: 0, exp: 'GPU (Graphics Processing Unit) é o processador responsável pelo processamento gráfico, essencial para jogos e edição de vídeo.' },
  { q: 'Onde o sistema operacional geralmente é instalado?', options: ['HD ou SSD','RAM','GPU','CPU'], answer: 0, exp: 'O sistema operacional é instalado em uma memória permanente, geralmente o HD ou SSD, onde os dados ficam mesmo sem energia.' },
  { q: 'O que é malware?', options: ['Software malicioso que prejudica o computador','Programa de backup','Tipo de firewall','Componente de hardware'], answer: 0, exp: 'Malware (malicious software) é qualquer software desenvolvido com a intenção de prejudicar sistemas ou roubar dados.' },
  { q: 'O que é a placa-mãe?', options: ['Componente que interliga todos os outros','Memória principal','Processador principal','Fonte de alimentação'], answer: 0, exp: 'A placa-mãe é o componente central que conecta e permite a comunicação entre todos os outros componentes do computador.' },
  { q: 'Qual a ordem correta das unidades de armazenamento (menor para maior)?', options: ['KB, MB, GB, TB','MB, KB, GB, TB','GB, MB, KB, TB','TB, GB, MB, KB'], answer: 0, exp: 'A ordem crescente é: KB (kilobyte) → MB (megabyte) → GB (gigabyte) → TB (terabyte).' },
  { q: 'O que faz o antivírus?', options: ['Detecta, previne e remove vírus','Acelera o processador','Aumenta a memória RAM','Gerencia a rede'], answer: 0, exp: 'O antivírus é um software de segurança que detecta, previne e remove vírus e outros malwares do computador.' },
  { q: 'O Mac OS foi lançado em qual ano?', options: ['1984','1991','2001','1975'], answer: 0, exp: 'O Macintosh System Software (Mac OS) foi lançado pela Apple em 24 de janeiro de 1984, junto com o primeiro Macintosh.' },
  { q: 'O que é a memória cache?', options: ['Memória ultrarrápida próxima ao processador','Tipo de HD','Memória de vídeo','Memória de backup'], answer: 0, exp: 'A memória cache é uma memória muito rápida e pequena, localizada dentro ou muito próxima do processador, usada para agilizar o acesso a dados frequentes.' },
  { q: 'Qual componente transforma energia elétrica da tomada para uso interno?', options: ['Fonte de alimentação','CPU','RAM','GPU'], answer: 0, exp: 'A fonte de alimentação converte a corrente alternada (CA) da tomada em corrente contínua (CC) nos voltagens necessários para os componentes.' },
  { q: 'O que é um driver?', options: ['Programa que permite o SO usar um hardware','Tipo de vírus','Memória flash','Conector de rede'], answer: 0, exp: 'Driver (ou controlador de dispositivo) é um programa que permite ao sistema operacional se comunicar corretamente com um hardware específico.' },
  { q: 'Qual sistema operacional é de código aberto (open source)?', options: ['Linux','Windows','Mac OS','iOS'], answer: 0, exp: 'O Linux é open source: seu código-fonte é público e pode ser modificado por qualquer pessoa. É amplamente usado em servidores.' },
]

const TIMER_SECONDS = 20
const QUESTIONS_PER_ROUND = 15

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function Quiz({ onAddScore, onComplete, onNext, isCompleted }) {
  const [questions] = useState(() => shuffle(ALL_QUESTIONS).slice(0, QUESTIONS_PER_ROUND))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showExp, setShowExp] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState([])
  const timerRef = useRef(null)

  const current = questions[index]

  const advance = useCallback(() => {
    if (index + 1 >= questions.length) {
      setFinished(true)
      onComplete()
    } else {
      setIndex(i => i + 1)
      setSelected(null)
      setShowExp(false)
      setTimeLeft(TIMER_SECONDS)
    }
  }, [index, questions.length, onComplete])

  const handleAnswer = useCallback((optIdx) => {
    if (selected !== null) return
    clearInterval(timerRef.current)
    setSelected(optIdx)
    setShowExp(true)
    const correct = optIdx === current.answer
    const pts = correct ? 10 : -5
    setScore(s => s + pts)
    onAddScore(pts)
    setAnswers(prev => [...prev, { correct }])
  }, [selected, current, onAddScore])

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

  const correctCount = answers.filter(a => a.correct).length
  const pct = Math.round((correctCount / questions.length) * 100)
  const classification = pct >= 71 ? { label: 'Expert 🏆', color: 'text-green-600', bg: 'bg-green-50' }
    : pct >= 41 ? { label: 'Em desenvolvimento 📈', color: 'text-fundat-600', bg: 'bg-fundat-50' }
    : { label: 'Iniciante 🌱', color: 'text-blue-600', bg: 'bg-blue-50' }

  if (finished) {
    return (
      <div className="space-y-6 pb-8">
        <div className={`rounded-2xl p-8 text-center ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-fundat-500' : 'bg-petroleum-500'} text-white`}>
          <div className="text-5xl mb-3">{pct >= 70 ? '🏆' : pct >= 40 ? '📈' : '🌱'}</div>
          <h2 className="text-2xl font-bold">Quiz concluído!</h2>
          <p className="text-4xl font-bold mt-2">{pct}%</p>
          <p className="opacity-90 mt-1">{correctCount} de {questions.length} acertos</p>
          <div className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-bold bg-white/20`}>
            {classification.label}
          </div>
          <p className="mt-3 text-sm opacity-80">Pontos acumulados neste quiz: {score > 0 ? '+' : ''}{score}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setAnswers([]); setIndex(0); setSelected(null); setShowExp(false); setTimeLeft(TIMER_SECONDS); setScore(0); setFinished(false) }}
            className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-medium px-5 py-3 rounded-xl">
            <RotateCcw size={16} /> Refazer
          </button>
          <button onClick={onNext} className="flex items-center gap-2 bg-fundat-400 hover:bg-fundat-500 text-white font-bold px-6 py-3 rounded-xl ml-auto">
            Próximo <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  const timerPct = (timeLeft / TIMER_SECONDS) * 100
  const timerColor = timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-fundat-400' : 'bg-red-500'

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold">❓ Quiz: Teste seus conhecimentos</h2>
          <span className="text-sm opacity-75">{index + 1}/{questions.length}</span>
        </div>
        {/* Timer bar */}
        <div className="mt-3 flex items-center gap-3">
          <Clock size={16} className={timeLeft <= 5 ? 'animate-pulse text-red-300' : 'text-petroleum-200'} />
          <div className="flex-1 h-2 bg-petroleum-700 rounded-full overflow-hidden">
            <div className={`h-full ${timerColor} rounded-full transition-all duration-1000`} style={{ width: `${timerPct}%` }} />
          </div>
          <span className={`text-sm font-bold w-8 text-right ${timeLeft <= 5 ? 'text-red-300 animate-pulse' : ''}`}>{timeLeft}s</span>
        </div>
        {/* Progresso questões */}
        <div className="mt-2 flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i < index ? 'bg-white/60' : i === index ? 'bg-fundat-400' : 'bg-petroleum-700'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p className="text-gray-800 font-semibold text-lg leading-snug mb-5">{current.q}</p>
        <div className="grid gap-3">
          {current.options.map((opt, i) => {
            let style = 'bg-gray-50 border-gray-200 hover:border-petroleum-300 hover:bg-petroleum-50 cursor-pointer'
            if (selected !== null) {
              if (i === current.answer) style = 'bg-green-50 border-green-400 text-green-800 font-semibold'
              else if (i === selected && selected !== current.answer) style = 'bg-red-50 border-red-400 text-red-800'
              else style = 'bg-gray-50 border-gray-200 opacity-60'
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${style}`}
              >
                <span className="font-bold mr-2 text-gray-400">{String.fromCharCode(65 + i)}.</span>
                {opt}
                {selected !== null && i === current.answer && <CheckCircle className="inline ml-2 text-green-500" size={16} />}
                {selected !== null && i === selected && selected !== current.answer && <XCircle className="inline ml-2 text-red-400" size={16} />}
              </button>
            )
          })}
        </div>

        {showExp && (
          <div className={`mt-4 p-4 rounded-xl text-sm ${selected === current.answer ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <p className="font-semibold mb-1">{selected === current.answer ? '✅ Correto!' : '❌ Incorreto!'}</p>
            <p>{current.exp}</p>
          </div>
        )}
      </div>

      {selected !== null && (
        <button
          onClick={advance}
          className="flex items-center gap-2 bg-petroleum-500 hover:bg-petroleum-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
        >
          {index + 1 < questions.length ? 'Próxima pergunta' : 'Ver resultado'}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
