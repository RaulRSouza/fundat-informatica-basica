import { useState } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

const STATEMENTS = [
  { s: 'Sistema computacional é a união de hardware e software trabalhando juntos.', answer: true,  exp: 'VERDADEIRO. Hardware (parte física) + Software (parte lógica) = Sistema Computacional. Um não funciona sem o outro.' },
  { s: 'Software é a parte física do computador, como teclado e monitor.', answer: false, exp: 'FALSO. Software é a parte intangível — programas e instruções. Hardware é a parte física que você pode tocar.' },
  { s: 'A CPU é chamada de "cérebro" do computador.', answer: true,  exp: 'VERDADEIRO. A CPU (Unidade Central de Processamento) executa todas as instruções e processa os dados do computador.' },
  { s: 'O HD é mais rápido que o SSD.', answer: false, exp: 'FALSO. O SSD é muito mais rápido que o HD. Usa chips de memória flash sem partes móveis, enquanto o HD tem discos magnéticos giratórios.' },
  { s: 'A memória RAM perde todos os dados quando o computador é desligado.', answer: true,  exp: 'VERDADEIRO. A RAM é volátil: precisa de energia elétrica constante. Ao desligar, todo o conteúdo armazenado é perdido.' },
  { s: 'O monitor é um exemplo de dispositivo de saída.', answer: true,  exp: 'VERDADEIRO. Dispositivos de saída exibem resultados ao usuário: monitor, impressora, caixa de som e projetor. O teclado e o mouse são dispositivos de entrada.' },
  { s: 'O Linux foi criado por Bill Gates.', answer: false, exp: 'FALSO. O Linux foi criado por Linus Torvalds em 1991. Bill Gates fundou a Microsoft e criou o Windows.' },
  { s: 'O Windows está presente em mais de 90% dos computadores pessoais do mundo.', answer: true,  exp: 'VERDADEIRO. O Windows é o sistema operacional mais usado no mundo, desenvolvido pela Microsoft desde 1981.' },
  { s: 'O ransomware sequestra dados e exige pagamento para liberá-los.', answer: true,  exp: 'VERDADEIRO. Ransomware criptografa os arquivos da vítima e exige pagamento (resgate). "Como um ladrão que tranca sua casa por dentro."' },
  { s: 'O firewall é um programa que remove vírus do computador.', answer: false, exp: 'FALSO. O firewall controla e filtra o tráfego de rede, bloqueando acessos indesejados. Quem remove vírus é o antivírus.' },
  { s: 'Backup é uma cópia de segurança dos dados feita em outro dispositivo.', answer: true,  exp: 'VERDADEIRO. Backup protege contra perda de dados por falha de hardware, vírus ou acidentes — é uma segunda opção de recuperação.' },
  { s: 'O SSD possui partes mecânicas em movimento, como discos giratórios.', answer: false, exp: 'FALSO. O SSD (Solid-State Drive) usa chips de memória flash, sem nenhuma peça mecânica. Por isso é mais rápido, silencioso e resistente.' },
  { s: 'USB significa Universal Serial Bus.', answer: true,  exp: 'VERDADEIRO. USB = Universal Serial Bus. Simplificou a conexão de dispositivos ao computador, como pendrives, mouses e câmeras.' },
  { s: 'A placa-mãe conecta e permite a comunicação entre todos os componentes do computador.', answer: true,  exp: 'VERDADEIRO. A placa-mãe é a "avenida principal" — conecta processador, RAM, armazenamento e GPU, distribuindo energia e dados.' },
  { s: 'A memória RAM é permanente e guarda dados mesmo sem energia elétrica.', answer: false, exp: 'FALSO. A RAM é volátil: perde todos os dados ao desligar. Memórias permanentes (não voláteis) são HD e SSD.' },
  { s: 'O Linux é gratuito e de código aberto (open source).', answer: true,  exp: 'VERDADEIRO. O Linux é free e open source — qualquer pessoa pode usar, modificar e distribuir. A versão mais popular para iniciantes é o Ubuntu.' },
  { s: 'Malware é um software criado para prejudicar o computador ou roubar dados.', answer: true,  exp: 'VERDADEIRO. Malware (malicious software) é o termo genérico que inclui vírus, ransomware, spyware, adware e outros programas maliciosos.' },
  { s: 'A GPU (placa de vídeo) é responsável apenas pelo armazenamento de dados.', answer: false, exp: 'FALSO. A GPU é responsável pelo processamento gráfico: jogos, edição de vídeo, renderização 3D e inteligência artificial.' },
  { s: 'Phishing usa links e sites falsos para roubar senhas e dados pessoais.', answer: true,  exp: 'VERDADEIRO. Phishing ("pescaria") usa e-mails e páginas falsas para enganar usuários. "A isca parece real, mas é uma armadilha."' },
  { s: 'Antes do Windows existia o MS-DOS, que funcionava apenas com comandos de texto.', answer: true,  exp: 'VERDADEIRO. O MS-DOS (1981) não tinha interface gráfica — o usuário digitava comandos de texto. O Windows trouxe janelas e ícones.' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function VerdadeiroFalso({ onAddScore, onComplete, onNext }) {
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
    }
  }

  const reset = () => { setIndex(0); setAnswered(null); setScore(0); setHistory([]); setFinished(false); setFlipped(false) }

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
          <p className="text-sm opacity-80 mt-1">Pontos: {score > 0 ? '+' : ''}{score}</p>
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
          <div className="card-front bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-petroleum-700 font-mono text-xs uppercase tracking-widest mb-4">Afirmação {index + 1}</p>
            <p className="text-gray-800 font-semibold text-lg leading-snug">{current.s}</p>
          </div>
          <div className={`card-back rounded-xl p-6 flex flex-col items-center justify-center text-center ${answered === current.answer ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
            <div className="text-4xl mb-3">{answered === current.answer ? '✅' : '❌'}</div>
            <p className="font-bold text-lg mb-2">{current.answer ? 'VERDADEIRO' : 'FALSO'}</p>
            <p className="text-sm text-gray-700 leading-snug">{current.exp}</p>
          </div>
        </div>
      </div>

      {answered === null && (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleAnswer(true)}
            className="flex items-center justify-center gap-3 py-5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-md transition-all hover:scale-105 active:scale-95">
            <CheckCircle size={28} /> Verdadeiro
          </button>
          <button onClick={() => handleAnswer(false)}
            className="flex items-center justify-center gap-3 py-5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-md transition-all hover:scale-105 active:scale-95">
            <XCircle size={28} /> Falso
          </button>
        </div>
      )}

      {answered !== null && (
        <button onClick={advance} className="w-full flex items-center justify-center gap-2 bg-petroleum-500 hover:bg-petroleum-600 text-white font-bold px-6 py-3 rounded-xl">
          {index + 1 < statements.length ? 'Próxima afirmação' : 'Ver resultado'} <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
