import { useState } from 'react'
import { Printer, Trophy, BarChart2, ArrowLeft } from 'lucide-react'

const MODULE_NAMES = {
  dragdrop:       '🖱️ Hardware ou Software?',
  quiz:           '❓ Quiz',
  verdadeirofalso:'✅ Verdadeiro ou Falso?',
  memoria:        '🃏 Jogo da Memória',
  completefrase:  '✏️ Complete a Frase',
  associacao:     '🔗 Combine os Pares',
  cacapalavras:   '🔍 Caça-palavras',
  ordenar:        '🔢 Ordene Corretamente',
  relampago:      '⚡ Quiz Relâmpago',
  certificado:    '🏆 Seu Desempenho',
}

export default function Certificado({ totalScore, completedModules, modules, onAddScore, onComplete }) {
  const [name, setName] = useState('')
  const [showCert, setShowCert] = useState(false)

  const pct = Math.round((completedModules.length / modules.length) * 100)
  const classification =
    pct >= 71 ? { label: 'Expert 🏆', color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
    : pct >= 41 ? { label: 'Em desenvolvimento 📈', color: 'text-fundat-600', bg: 'bg-fundat-50 border-fundat-200' }
    : { label: 'Iniciante 🌱', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' }

  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  const handlePrint = () => {
    if (!name.trim()) { alert('Digite seu nome para o certificado!'); return }
    setShowCert(true)
    setTimeout(() => window.print(), 300)
  }

  // Marca como concluído ao acessar
  useState(() => { onComplete() })

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-br from-petroleum-500 to-petroleum-700 text-white rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <Trophy size={40} className="text-fundat-400" />
          <div>
            <h2 className="text-2xl font-bold">Seu Desempenho</h2>
            <p className="text-petroleum-200 text-sm">Resumo completo das atividades</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-fundat-300">{totalScore}</p>
            <p className="text-xs text-petroleum-200 mt-1">pontos totais</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-fundat-300">{completedModules.length}/{modules.length}</p>
            <p className="text-xs text-petroleum-200 mt-1">módulos completos</p>
          </div>
          <div className={`col-span-2 md:col-span-1 ${classification.bg} border rounded-xl p-4 text-center`}>
            <p className={`text-xl font-black ${classification.color}`}>{classification.label}</p>
            <p className="text-xs text-gray-500 mt-1">classificação</p>
          </div>
        </div>
      </div>

      {/* Gráfico de progresso por módulo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-petroleum-500" />
          Progresso por atividade
        </h3>
        <div className="space-y-3">
          {modules.filter(m => m.id !== 'certificado').map(mod => {
            const done = completedModules.includes(mod.id)
            return (
              <div key={mod.id} className="flex items-center gap-3">
                <span className="text-sm w-7 text-center">{mod.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{mod.name}</span>
                    <span>{done ? '✅ Concluído' : '○ Pendente'}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-petroleum-500' : 'bg-gray-200'}`} style={{ width: done ? '100%' : '0%' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mensagem personalizada */}
      <div className="bg-fundat-50 border border-fundat-200 rounded-xl p-5">
        <p className="text-fundat-800 font-medium">
          {pct === 100
            ? '🎉 Parabéns! Você completou todas as atividades! Você está pronto(a) para o próximo módulo do curso.'
            : pct >= 70
              ? '👏 Ótimo desempenho! Complete as atividades restantes para conquistar o certificado completo.'
              : '💪 Bom começo! Continue praticando — cada atividade concluída aumenta seu conhecimento!'}
        </p>
      </div>

      {/* Certificado */}
      {completedModules.length >= modules.length - 1 && (
        <div className="bg-white rounded-xl border-2 border-petroleum-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Printer size={18} className="text-petroleum-500" />
            Imprimir Certificado de Participação
          </h3>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              className="flex-1 border-2 border-gray-200 focus:border-petroleum-400 outline-none rounded-xl px-4 py-3 text-sm transition-colors"
            />
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-petroleum-500 hover:bg-petroleum-600 text-white font-semibold px-5 py-3 rounded-xl transition-all"
            >
              <Printer size={16} />
              Imprimir
            </button>
          </div>
          <p className="text-xs text-gray-400">O certificado será aberto para impressão no seu navegador.</p>
        </div>
      )}

      {/* Área de impressão do certificado (visível só no print) */}
      {showCert && (
        <div id="certificado-print" className="hidden print:block fixed inset-0 bg-white p-12 z-50">
          <div className="border-8 border-petroleum-500 h-full rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-6xl">💻</div>
              <div className="text-left">
                <p className="text-petroleum-500 font-bold text-sm uppercase tracking-widest">Prefeitura de Aracaju</p>
                <p className="text-petroleum-700 font-black text-2xl">FUNDAT</p>
                <p className="text-gray-500 text-xs">Fundação Municipal de Formação para o Trabalho</p>
              </div>
            </div>

            <div className="w-24 h-1 bg-fundat-400 rounded-full mb-8" />

            <h1 className="text-4xl font-black text-petroleum-700 mb-2">Certificado de Participação</h1>
            <p className="text-gray-500 text-lg mb-8">Curso de Informática Básica — Turma 2026</p>

            <p className="text-gray-600 text-lg mb-2">Certificamos que</p>
            <p className="text-3xl font-black text-petroleum-600 mb-6">{name || 'Aluno(a)'}</p>

            <p className="text-gray-600 max-w-xl leading-relaxed mb-8">
              completou com sucesso todas as atividades interativas do módulo
              <strong> Hardware, Software, Tipos de Memória, Armazenamento, Segurança Digital e Sistemas Operacionais</strong>
              {' '}do curso de Informática Básica promovido pela FUNDAT — Fundação Municipal de Formação para o Trabalho de Aracaju/SE.
            </p>

            <div className="flex gap-12 text-sm text-gray-500">
              <div>
                <p className="font-semibold text-petroleum-600">Pontuação total</p>
                <p className="text-2xl font-black text-fundat-500">{totalScore} pts</p>
              </div>
              <div>
                <p className="font-semibold text-petroleum-600">Atividades completas</p>
                <p className="text-2xl font-black text-fundat-500">{completedModules.length}/{modules.length}</p>
              </div>
            </div>

            <div className="w-24 h-1 bg-fundat-400 rounded-full my-8" />
            <p className="text-gray-400 text-sm">Aracaju/SE, {today}</p>
            <p className="text-gray-400 text-xs mt-2">Prefeitura de Aracaju · FUNDAT · 2026</p>
          </div>
        </div>
      )}
    </div>
  )
}
