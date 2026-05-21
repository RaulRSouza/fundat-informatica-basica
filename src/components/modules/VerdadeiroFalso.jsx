import { useState } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

const STATEMENTS = [
  { s: 'O SSD possui partes mecânicas em movimento.', answer: false, exp: 'FALSO. O SSD (Solid-State Drive) usa chips de memória flash sem partes móveis, ao contrário do HD tradicional.' },
  { s: 'A RAM perde os dados quando o computador é desligado.', answer: true, exp: 'VERDADEIRO. A RAM é uma memória volátil: precisa de energia constante e perde todo o conteúdo ao desligar.' },
  { s: 'O Windows foi o primeiro sistema operacional com interface gráfica.', answer: false, exp: 'FALSO. O Mac OS da Apple (1984) foi o primeiro SO comercial com interface gráfica. O Windows 1.0 veio em 1985.' },
  { s: 'O phishing ocorre por meio de links maliciosos em e-mails ou sites falsos.', answer: true, exp: 'VERDADEIRO. Phishing é um golpe que usa links e páginas falsas para enganar o usuário e roubar dados.' },
  { s: 'O backup serve para criar cópia de segurança dos dados.', answer: true, exp: 'VERDADEIRO. Backup é a prática de copiar dados para outro local para proteção em caso de perda ou dano.' },
  { s: 'O HD é mais rápido que o SSD.', answer: false, exp: 'FALSO. O SSD é significativamente mais rápido que o HD, pois não precisa de partes mecânicas para acessar dados.' },
  { s: 'USB significa Universal Serial Bus.', answer: true, exp: 'VERDADEIRO. USB = Universal Serial Bus. É um padrão de interface para conectar dispositivos ao computador.' },
  { s: 'O Linux foi criado por Bill Gates.', answer: false, exp: 'FALSO. O Linux foi criado por Linus Torvalds, em 1991. Bill Gates fundou a Microsoft e criou o Windows.' },
  { s: 'O firewall protege o computador contra acessos indevidos na rede.', answer: true, exp: 'VERDADEIRO. O firewall monitora e filtra o tráfego de rede, bloqueando conexões não autorizadas.' },
  { s: 'O processador (CPU) é a memória principal do computador.', answer: false, exp: 'FALSO. O processador é o "cérebro" do computador (processa dados). A memória principal é a RAM.' },
  { s: 'A RAM é uma memória volátil.', answer: true, exp: 'VERDADEIRO. Memória volátil significa que os dados são perdidos quando a energia é desligada.' },
  { s: 'O pendrive é um exemplo de hardware externo.', answer: true, exp: 'VERDADEIRO. Pendrive é um dispositivo de armazenamento portátil conectado externamente via USB.' },
  { s: 'O antivírus substitui completamente o firewall.', answer: false, exp: 'FALSO. Antivírus e firewall têm funções complementares. O antivírus remove malwares já existentes; o firewall filtra o tráfego de rede.' },
  { s: 'O Mac OS surgiu em 1984.', answer: true, exp: 'VERDADEIRO. O primeiro Macintosh com seu sistema operacional gráfico foi lançado pela Apple em 24 de janeiro de 1984.' },
  { s: 'Malware é um software desenvolvido para prejudicar o computador ou roubar dados.', answer: true, exp: 'VERDADEIRO. Malware (malicious software) é o termo geral para vírus, ransomware, spyware e outros softwares maliciosos.' },
  { s: 'A placa de vídeo (GPU) é a mesma coisa que a CPU.', answer: false, exp: 'FALSO. A GPU processa gráficos e imagens, enquanto a CPU realiza processamentos gerais. São componentes distintos.' },
  { s: 'O ransomware criptografa dados e cobra resgate para liberá-los.', answer: true, exp: 'VERDADEIRO. Ransomware = "ransom" (resgate) + "ware" (software). Bloqueia o acesso aos dados e exige pagamento.' },
  { s: 'O sistema operacional é um exemplo de software.', answer: true, exp: 'VERDADEIRO. O sistema operacional (Windows, Linux, Mac OS) é um software de sistema que gerencia o hardware e outros programas.' },
  { s: 'A memória ROM perde seus dados ao desligar o computador.', answer: false, exp: 'FALSO. ROM (Read-Only Memory) é uma memória permanente que mantém seus dados mesmo sem energia elétrica.' },
  { s: 'O HD utiliza discos magnéticos giratórios para armazenar dados.', answer: true, exp: 'VERDADEIRO. O HD (Hard Disk Drive) armazena dados em discos metálicos que giram em alta velocidade, usando magnetismo.' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function VerdadeiroFalso({ onAddScore, onComplete, onNext, isCompleted }) {
  const [statements] = useState(() => shuffle(STATEMENTS))
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState([])
  const [finished, setFinished] = useState(false)
  const [flipped, setFlipped] = useState(false)

  const current = statements[index]

  const handleAnswer = (userAnswer) => {
    if (answered !== null) return
    setFlipped(true)
    const correct = userAnswer === current.answer
    const pts = correct ? 10 : -5
    setScore(s => s + pts)
    onAddScore(pts)
    setAnswered(userAnswer)
    setHistory(h => [...h, { correct }])
  }

  const advance = () => {
    setFlipped(false)
    if (index + 1 >= statements.length) {
      setFinished(true)
      onComplete()
    } else {
      setIndex(i => i + 1)
      setAnswered(null)
      setTimeout(() => {}, 50)
    }
  }

  const reset = () => {
    setIndex(0); setAnswered(null); setScore(0); setHistory([]); setFinished(false); setFlipped(false)
  }

  const correctCount = history.filter(h => h.correct).length
  const pct = finished ? Math.round((correctCount / statements.length) * 100) : 0

  if (finished) {
    return (
      <div className="space-y-6 pb-8">
        <div className={`rounded-2xl p-8 text-center text-white ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-fundat-500' : 'bg-red-500'}`}>
          <div className="text-5xl mb-3">{pct >= 70 ? '🏆' : '💪'}</div>
          <h2 className="text-2xl font-bold">Atividade concluída!</h2>
          <p className="text-4xl font-bold mt-2">{pct}%</p>
          <p className="opacity-90">{correctCount}/{statements.length} acertos</p>
          <p className="text-sm opacity-80 mt-1">Pontos desta atividade: {score > 0 ? '+' : ''}{score}</p>
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

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">✅ Verdadeiro ou Falso?</h2>
          <span className="text-sm opacity-75">{index + 1}/{statements.length}</span>
        </div>
        <div className="mt-2 flex gap-1">
          {statements.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < index ? (history[i]?.correct ? 'bg-green-400' : 'bg-red-400') : i === index ? 'bg-fundat-400' : 'bg-petroleum-700'}`} />
          ))}
        </div>
      </div>

      {/* Card flip */}
      <div className={`card-flip ${flipped ? 'flipped' : ''}`} style={{ height: '220px' }}>
        <div className="card-flip-inner">
          {/* Frente: afirmação */}
          <div className="card-front bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-petroleum-700 font-mono text-xs uppercase tracking-widest mb-4">Afirmação {index + 1}</p>
            <p className="text-gray-800 font-semibold text-lg leading-snug">{current.s}</p>
          </div>
          {/* Verso: resposta */}
          <div className={`card-back rounded-xl p-6 flex flex-col items-center justify-center text-center
            ${answered === current.answer ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
            <div className="text-4xl mb-3">{answered === current.answer ? '✅' : '❌'}</div>
            <p className="font-bold text-lg mb-2">{current.answer ? 'VERDADEIRO' : 'FALSO'}</p>
            <p className="text-sm text-gray-700 leading-snug">{current.exp}</p>
          </div>
        </div>
      </div>

      {/* Botões V/F */}
      {answered === null && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center justify-center gap-3 py-5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <CheckCircle size={28} />
            Verdadeiro
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center justify-center gap-3 py-5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <XCircle size={28} />
            Falso
          </button>
        </div>
      )}

      {answered !== null && (
        <button
          onClick={advance}
          className="w-full flex items-center justify-center gap-2 bg-petroleum-500 hover:bg-petroleum-600 text-white font-bold px-6 py-3 rounded-xl"
        >
          {index + 1 < statements.length ? 'Próxima afirmação' : 'Ver resultado'}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
