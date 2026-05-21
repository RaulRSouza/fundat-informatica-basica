import { useState } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

const FRASES = [
  { before: 'O', blank: 'CPU', after: 'é considerado o cérebro do computador.', options: ['CPU', 'RAM', 'SSD', 'GPU'], exp: 'A CPU (Unidade Central de Processamento) processa todas as instruções e é chamada de cérebro do computador.' },
  { before: 'A sigla SSD significa Solid-State', blank: 'Drive', after: '.', options: ['Drive', 'Disk', 'Data', 'Device'], exp: 'SSD = Solid-State Drive. "Solid-State" indica que não há partes móveis, apenas chips de memória flash.' },
  { before: 'O', blank: 'Linux', after: 'foi criado por Linus Torvalds em 1991.', options: ['Linux', 'Windows', 'Mac OS', 'Android'], exp: 'Linus Torvalds lançou o kernel Linux em 1991. Hoje é amplamente usado em servidores e dispositivos embarcados.' },
  { before: 'O', blank: 'Ransomware', after: 'é um ataque que sequestra dados e cobra resgate.', options: ['Ransomware', 'Phishing', 'Malware', 'Backup'], exp: 'Ransomware criptografa os arquivos da vítima e exige pagamento (geralmente em criptomoedas) para devolver o acesso.' },
  { before: 'A memória', blank: 'RAM', after: 'perde todos os dados ao desligar o computador.', options: ['RAM', 'HD', 'SSD', 'USB'], exp: 'A RAM é volátil: seus dados existem apenas enquanto há energia. Ao desligar, tudo é apagado.' },
  { before: 'O', blank: 'Firewall', after: 'controla o acesso entre redes, filtrando comunicações indesejadas.', options: ['Firewall', 'Antivírus', 'Backup', 'Driver'], exp: 'O firewall é uma barreira que monitora e filtra o tráfego de rede conforme regras de segurança definidas.' },
  { before: 'O Mac OS foi o primeiro sistema operacional com', blank: 'interface', after: 'gráfica para uso comercial.', options: ['interface', 'memória', 'driver', 'protocolo'], exp: 'Em 1984, a Apple lançou o Mac OS com interface gráfica (GUI), tornando o computador mais acessível ao público.' },
  { before: 'USB significa Universal Serial', blank: 'Bus', after: '.', options: ['Bus', 'Base', 'Bit', 'Byte'], exp: 'USB = Universal Serial Bus. "Bus" (barramento) refere-se ao caminho por onde os dados trafegam entre dispositivos.' },
  { before: 'O', blank: 'HD', after: 'armazena dados permanentemente mesmo sem energia elétrica.', options: ['HD', 'RAM', 'Cache', 'Registrador'], exp: 'O HD (Hard Disk Drive) é uma memória não volátil: guarda dados permanentemente usando discos magnéticos giratórios.' },
  { before: 'O', blank: 'Phishing', after: 'ocorre quando alguém clica em um link malicioso para roubar dados.', options: ['Phishing', 'Backup', 'Firewall', 'Antivírus'], exp: 'Phishing ("pescaria") é um ataque de engenharia social onde criminosos imitam sites ou e-mails legítimos para roubar informações.' },
  { before: 'A', blank: 'GPU', after: 'é responsável pelo processamento de imagens e vídeos.', options: ['GPU', 'CPU', 'RAM', 'SSD'], exp: 'GPU (Graphics Processing Unit) processa dados visuais com eficiência, essencial para jogos, design e vídeo.' },
  { before: 'O', blank: 'Malware', after: 'é um software criado para causar danos ou roubar informações.', options: ['Malware', 'Driver', 'Firewall', 'Backup'], exp: 'Malware é o termo genérico para qualquer software malicioso, incluindo vírus, trojans, ransomware e spyware.' },
  { before: 'A', blank: 'placa-mãe', after: 'é o componente que conecta e integra todos os outros.', options: ['placa-mãe', 'fonte', 'RAM', 'GPU'], exp: 'A placa-mãe (motherboard) é a placa principal que fornece os slots e conectores para todos os outros componentes.' },
  { before: 'O', blank: 'antivírus', after: 'detecta, previne e remove softwares maliciosos.', options: ['antivírus', 'firewall', 'driver', 'SO'], exp: 'O antivírus verifica arquivos e programas em busca de ameaças conhecidas, usando uma base de dados de assinaturas de vírus.' },
  { before: 'O sistema operacional gerencia o', blank: 'hardware', after: 'e fornece uma interface para o usuário.', options: ['hardware', 'internet', 'backup', 'phishing'], exp: 'O SO é o intermediário entre o usuário e o hardware: controla recursos do sistema e executa os aplicativos.' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function CompleteFrase({ onAddScore, onComplete, onNext, isCompleted }) {
  const [frases] = useState(() => shuffle(FRASES))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = frases[index]

  const handleSelect = (opt) => {
    if (selected !== null) return
    const correct = opt === current.blank
    const pts = correct ? 10 : -5
    setSelected(opt)
    setScore(s => s + pts)
    onAddScore(pts)
    setHistory(h => [...h, { correct }])
  }

  const advance = () => {
    if (index + 1 >= frases.length) {
      setFinished(true)
      onComplete()
    } else {
      setIndex(i => i + 1)
      setSelected(null)
    }
  }

  const reset = () => { setIndex(0); setSelected(null); setHistory([]); setScore(0); setFinished(false) }

  const correctCount = history.filter(h => h.correct).length
  const pct = finished ? Math.round((correctCount / frases.length) * 100) : 0

  if (finished) {
    return (
      <div className="space-y-6 pb-8">
        <div className={`rounded-2xl p-8 text-center text-white ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-fundat-500' : 'bg-red-500'}`}>
          <div className="text-5xl mb-3">✏️</div>
          <h2 className="text-2xl font-bold">Atividade concluída!</h2>
          <p className="text-4xl font-bold mt-2">{pct}%</p>
          <p className="opacity-90">{correctCount}/{frases.length} acertos</p>
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
          <h2 className="text-xl font-bold">✏️ Complete a Frase</h2>
          <span className="text-sm opacity-75">{index + 1}/{frases.length}</span>
        </div>
        <p className="text-petroleum-100 text-sm mt-1">Clique na palavra que completa corretamente a frase.</p>
        <div className="mt-2 flex gap-1">
          {frases.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < index ? (history[i]?.correct ? 'bg-green-400' : 'bg-red-400') : i === index ? 'bg-fundat-400' : 'bg-petroleum-700'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Frase com lacuna */}
        <p className="text-gray-800 text-lg leading-relaxed mb-6 font-medium text-center">
          {current.before}{' '}
          <span className={`inline-block px-3 py-0.5 rounded-lg border-2 border-dashed font-bold transition-all
            ${selected === null
              ? 'border-petroleum-400 text-petroleum-600 bg-petroleum-50 min-w-[80px]'
              : selected === current.blank
                ? 'border-green-400 text-green-700 bg-green-50'
                : 'border-red-400 text-red-700 bg-red-50'}`}>
            {selected !== null ? selected : '___'}
          </span>
          {' '}{current.after}
        </p>

        {/* Opções */}
        <div className="grid grid-cols-2 gap-3">
          {current.options.map(opt => {
            let style = 'bg-gray-50 border-gray-200 hover:border-petroleum-300 hover:bg-petroleum-50 cursor-pointer text-gray-800'
            if (selected !== null) {
              if (opt === current.blank) style = 'bg-green-50 border-green-400 text-green-800 font-bold'
              else if (opt === selected) style = 'bg-red-50 border-red-400 text-red-700'
              else style = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={selected !== null}
                className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${style}`}
              >
                {selected !== null && opt === current.blank && <CheckCircle className="inline mr-2 text-green-500" size={15} />}
                {selected !== null && opt === selected && opt !== current.blank && <XCircle className="inline mr-2 text-red-400" size={15} />}
                {opt}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className={`mt-4 p-4 rounded-xl text-sm ${selected === current.blank ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <p className="font-semibold mb-1">{selected === current.blank ? '✅ Correto!' : `❌ Incorreto! A resposta é "${current.blank}".`}</p>
            <p>{current.exp}</p>
          </div>
        )}
      </div>

      {selected !== null && (
        <button onClick={advance} className="flex items-center gap-2 bg-petroleum-500 hover:bg-petroleum-600 text-white font-bold px-6 py-3 rounded-xl">
          {index + 1 < frases.length ? 'Próxima frase' : 'Ver resultado'} <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
