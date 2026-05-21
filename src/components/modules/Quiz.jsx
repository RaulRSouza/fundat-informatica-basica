import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

const ALL_QUESTIONS = [
  {
    q: 'O que é um sistema computacional?',
    options: ['União de hardware e software que trabalham juntos', 'Apenas os componentes físicos do computador', 'Somente os programas instalados no PC', 'O sistema operacional do computador'],
    answer: 0,
    exp: 'Sistema computacional = Hardware (parte física) + Software (parte lógica). Como um carro: sem motor (hardware) ou sem combustível (software), não funciona.',
  },
  {
    q: 'O que é hardware?',
    options: ['Parte física e tangível do computador', 'Programas instalados no computador', 'O sistema operacional', 'A conexão com a internet'],
    answer: 0,
    exp: 'Hardware é tudo que você pode tocar fisicamente: teclado, mouse, monitor, CPU, HD. É o "corpo" da máquina.',
  },
  {
    q: 'O que é software?',
    options: ['Programas e instruções que fazem o hardware funcionar', 'A parte física do computador', 'O processador do computador', 'O armazenamento de dados'],
    answer: 0,
    exp: 'Software é a parte intangível — programas e instruções que dizem ao hardware o que fazer. Exemplos: Windows, Word, Chrome.',
  },
  {
    q: 'Qual componente é chamado de "cérebro" do computador?',
    options: ['CPU (Processador)', 'Memória RAM', 'HD', 'Placa de vídeo (GPU)'],
    answer: 0,
    exp: 'A CPU (Unidade Central de Processamento) executa todas as instruções e processa os dados. É o "cérebro" que toma decisões e executa tarefas.',
  },
  {
    q: 'Para que serve a placa-mãe?',
    options: ['Conectar e permitir comunicação entre todos os componentes', 'Processar as imagens do computador', 'Armazenar dados permanentemente', 'Fornecer energia para o computador'],
    answer: 0,
    exp: 'A placa-mãe conecta processador, RAM, armazenamento e GPU, distribuindo energia e dados. É como uma "avenida principal por onde todas as informações passam".',
  },
  {
    q: 'Qual é a principal vantagem do SSD sobre o HD?',
    options: ['É muito mais rápido e não tem partes móveis', 'É mais barato por GB', 'Tem maior capacidade de armazenamento', 'Faz barulho menor apenas'],
    answer: 0,
    exp: 'O SSD usa chips de memória flash (sem partes móveis): é silencioso, rápido, mais resistente e usa menos energia. "Instalar o Windows em SSD melhora MUITO o desempenho!"',
  },
  {
    q: 'O que significa a sigla RAM?',
    options: ['Random Access Memory', 'Read All Memory', 'Rapid Access Module', 'Remote Access Memory'],
    answer: 0,
    exp: 'RAM = Random Access Memory (Memória de Acesso Aleatório). Armazena temporariamente os dados dos programas em uso.',
  },
  {
    q: 'A memória RAM é classificada como:',
    options: ['Memória volátil — perde dados ao desligar', 'Memória permanente — guarda dados sem energia', 'Memória óptica — usa laser', 'Memória mecânica — tem discos giratórios'],
    answer: 0,
    exp: 'A RAM é volátil: precisa de energia constante. Quando o computador é desligado, todos os dados são apagados. Por isso os programas abertos são perdidos.',
  },
  {
    q: 'Qual é um exemplo de dispositivo de ENTRADA?',
    options: ['Teclado', 'Monitor', 'Impressora', 'Caixa de som'],
    answer: 0,
    exp: 'Dispositivos de entrada levam dados para o computador: teclado, mouse, microfone, scanner, webcam. Monitor, impressora e caixa de som são dispositivos de SAÍDA.',
  },
  {
    q: 'Quem criou o sistema operacional Linux?',
    options: ['Linus Torvalds', 'Bill Gates', 'Steve Jobs', 'Mark Zuckerberg'],
    answer: 0,
    exp: 'Linus Torvalds, estudante finlandês, criou o Linux em 1991. O nome vem de "Linus" + "Unix". É gratuito, de código aberto e base do Android.',
  },
  {
    q: 'Qual empresa desenvolveu o sistema operacional Windows?',
    options: ['Microsoft', 'Apple', 'Google', 'IBM'],
    answer: 0,
    exp: 'O Windows foi desenvolvido pela Microsoft (Bill Gates). Está presente em mais de 90% dos PCs do mundo. Antes do Windows existia o MS-DOS.',
  },
  {
    q: 'O que é ransomware?',
    options: ['Vírus que sequestra dados e exige pagamento para liberá-los', 'Programa que protege o computador', 'Tipo de backup automático', 'Antivírus gratuito'],
    answer: 0,
    exp: 'Ransomware "tranca" os arquivos com criptografia e exige pagamento (resgate). "Como um ladrão que tranca sua casa por dentro e pede resgate pela chave."',
  },
  {
    q: 'O que é phishing?',
    options: ['Golpe por link falso que rouba senhas e dados pessoais', 'Vírus que apaga arquivos', 'Programa de proteção contra invasões', 'Método de backup em nuvem'],
    answer: 0,
    exp: 'Phishing usa e-mails e sites falsos para enganar usuários e roubar informações. "É como um anzol — a isca parece real, mas é uma armadilha."',
  },
  {
    q: 'O que faz o firewall?',
    options: ['Controla e filtra acessos indesejados entre redes', 'Remove vírus do computador', 'Faz cópia de segurança dos dados', 'Acelera a conexão com a internet'],
    answer: 0,
    exp: 'O firewall é um mecanismo que monitora o tráfego de rede, filtrando comunicações indesejadas e impedindo que intrusos acessem ou alterem a rede interna.',
  },
  {
    q: 'O que é backup?',
    options: ['Cópia de segurança dos dados em outro dispositivo', 'Tipo de vírus perigoso', 'Programa antivírus', 'Tipo de memória temporária'],
    answer: 0,
    exp: 'Backup é fazer uma cópia dos dados para recuperação em caso de falha de hardware, vírus ou acidente. Protege contra perdas irreversíveis.',
  },
  {
    q: 'O que é malware?',
    options: ['Nome genérico para qualquer software malicioso', 'Tipo de antivírus avançado', 'Programa de backup automático', 'Tipo de firewall especial'],
    answer: 0,
    exp: 'Malware (malicious software) é o termo geral para vírus, ransomware, spyware, adware — qualquer software que prejudica o sistema ou rouba dados.',
  },
  {
    q: 'Para que serve a GPU (placa de vídeo)?',
    options: ['Processar e gerar imagens, vídeos e gráficos', 'Armazenar dados permanentemente', 'Controlar a memória RAM', 'Gerenciar a conexão de rede'],
    answer: 0,
    exp: 'A GPU realiza cálculos gráficos complexos, sendo essencial para jogos, edição de vídeo, renderização 3D e até inteligência artificial.',
  },
  {
    q: 'O que significa a sigla USB?',
    options: ['Universal Serial Bus', 'United Software Base', 'Ultra Speed Bridge', 'Unified Serial Buffer'],
    answer: 0,
    exp: 'USB = Universal Serial Bus. Tornou mais simples a conexão de dispositivos ao computador: pendrives, mouses, teclados, câmeras, impressoras e muito mais.',
  },
  {
    q: 'Para que serve a fonte de alimentação do computador?',
    options: ['Fornecer energia elétrica para todos os componentes', 'Processar dados do sistema', 'Armazenar dados temporariamente', 'Conectar à internet'],
    answer: 0,
    exp: 'A fonte converte a corrente da tomada nos voltagens corretos. "Funciona como o coração energético do computador. Se ela falhar, todas as peças podem ser afetadas."',
  },
  {
    q: 'O que significa a sigla SSD?',
    options: ['Solid-State Drive', 'Serial Speed Disk', 'System Storage Device', 'Solid Serial Data'],
    answer: 0,
    exp: 'SSD = Solid-State Drive. "Solid-State" indica ausência de partes móveis — usa chips de memória flash, sendo muito mais rápido e resistente que o HD.',
  },
  {
    q: 'Qual sistema operacional é gratuito e de código aberto (open source)?',
    options: ['Linux', 'Windows', 'Mac OS', 'iOS'],
    answer: 0,
    exp: 'O Linux é free e open source: qualquer pessoa pode usar, modificar e distribuir. A distribuição mais indicada para iniciantes é o Ubuntu.',
  },
  {
    q: 'O que é o sistema operacional?',
    options: ['Programa principal que gerencia hardware e outros programas', 'Um tipo de vírus perigoso', 'A memória principal do computador', 'O processador do computador'],
    answer: 0,
    exp: 'O SO (Windows, Linux, Mac OS) é o "chão da casa" — gerencia hardware, executa programas e fornece a interface para o usuário interagir com o computador.',
  },
  {
    q: 'Antes do Windows, qual sistema a Microsoft utilizava?',
    options: ['MS-DOS', 'Unix', 'Linux', 'CP/M'],
    answer: 0,
    exp: 'O MS-DOS (Microsoft Disk Operating System) funcionava apenas com texto, sem janelas gráficas. O Windows surgiu para trazer a interface visual.',
  },
  {
    q: 'Qual tipo de memória guarda dados permanentemente mesmo sem energia?',
    options: ['HD ou SSD (memória secundária)', 'RAM', 'Cache do processador', 'Registrador'],
    answer: 0,
    exp: 'HD e SSD são memórias secundárias não voláteis: guardam dados permanentemente. A RAM é volátil — perde tudo ao desligar.',
  },
  {
    q: 'O que é DRAM (Dynamic RAM)?',
    options: ['Tipo mais comum de RAM — alta capacidade, mais acessível', 'RAM exclusiva para servidores', 'Memória de vídeo dedicada', 'RAM de altíssima velocidade usada no processador'],
    answer: 0,
    exp: 'DRAM (Dynamic RAM) é o tipo mais comum de memória principal. É de alta capacidade e mais barata, mas um pouco mais lenta que a SRAM (Static RAM).',
  },
]

const TIMER_SECONDS = 45
const QUESTIONS_PER_ROUND = 15

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function Quiz({ onAddScore, onComplete, onNext }) {
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

  useEffect(() => {
    if (finished || selected !== null) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(-1)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [index, finished, selected])

  const correctCount = answers.filter(a => a.correct).length
  const pct = Math.round((correctCount / questions.length) * 100)
  const classification =
    pct >= 71 ? { label: 'Expert 🏆', bg: 'bg-green-500' }
    : pct >= 41 ? { label: 'Em desenvolvimento 📈', bg: 'bg-fundat-500' }
    : { label: 'Iniciante 🌱', bg: 'bg-petroleum-500' }

  if (finished) {
    return (
      <div className="space-y-6 pb-8">
        <div className={`rounded-2xl p-8 text-center text-white ${classification.bg}`}>
          <div className="text-5xl mb-3">{pct >= 70 ? '🏆' : pct >= 40 ? '📈' : '🌱'}</div>
          <h2 className="text-2xl font-bold">Quiz concluído!</h2>
          <p className="text-4xl font-bold mt-2">{pct}%</p>
          <p className="opacity-90 mt-1">{correctCount} de {questions.length} acertos</p>
          <div className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-bold bg-white/20">
            {classification.label}
          </div>
          <p className="mt-3 text-sm opacity-80">Pontos desta rodada: {score > 0 ? '+' : ''}{score}</p>
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
  const timerColor = timeLeft > 20 ? 'bg-green-500' : timeLeft > 10 ? 'bg-fundat-400' : 'bg-red-500'
  const urgent = timeLeft <= 10

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-petroleum-500 text-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold">❓ Quiz: Teste seus conhecimentos</h2>
          <span className="text-sm opacity-75">{index + 1}/{questions.length}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Clock size={16} className={urgent ? 'animate-pulse text-red-300' : 'text-petroleum-200'} />
          <div className="flex-1 h-2.5 bg-petroleum-700 rounded-full overflow-hidden">
            <div className={`h-full ${timerColor} rounded-full transition-all duration-1000`} style={{ width: `${timerPct}%` }} />
          </div>
          <span className={`text-sm font-bold w-10 text-right ${urgent ? 'text-red-300 animate-pulse' : ''}`}>{timeLeft}s</span>
        </div>
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
              <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${style}`}>
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
        <button onClick={advance} className="flex items-center gap-2 bg-petroleum-500 hover:bg-petroleum-600 text-white font-bold px-6 py-3 rounded-xl">
          {index + 1 < questions.length ? 'Próxima pergunta' : 'Ver resultado'} <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
