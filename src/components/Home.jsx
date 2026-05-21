import { PlayCircle, CheckCircle, Circle, BookOpen, Cpu, Shield, Monitor } from 'lucide-react'

export default function Home({ onStart, completedCount, totalModules, progress, onSelectModule, modules, completedModules }) {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-petroleum-500 to-petroleum-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="text-5xl">💻</div>
          <div>
            <p className="text-petroleum-200 text-sm font-semibold uppercase tracking-widest mb-1">FUNDAT Aracaju · Dia 2</p>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">Informática Básica</h1>
            <p className="text-petroleum-100 mt-1 text-sm md:text-base">
              Atividades interativas sobre Hardware, Software, Memória, Armazenamento, Segurança e Sistemas Operacionais
            </p>
          </div>
        </div>

        {/* Progresso */}
        {completedCount > 0 && (
          <div className="mt-6 bg-petroleum-600/60 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Seu progresso</span>
              <span className="font-bold">{completedCount}/{totalModules} módulos</span>
            </div>
            <div className="h-2 bg-petroleum-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-fundat-400 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onStart}
          className="mt-6 flex items-center gap-2 bg-fundat-400 hover:bg-fundat-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <PlayCircle size={20} />
          {completedCount > 0 ? 'Continuar' : 'Começar agora'}
        </button>
      </div>

      {/* O que você vai aprender */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">📚 O que você vai aprender</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Cpu size={20} />, label: 'Hardware & Software', color: 'bg-blue-50 text-blue-600' },
            { icon: <BookOpen size={20} />, label: 'Tipos de Memória', color: 'bg-purple-50 text-purple-600' },
            { icon: <Monitor size={20} />, label: 'Sistemas Operacionais', color: 'bg-green-50 text-green-600' },
            { icon: <Shield size={20} />, label: 'Segurança Digital', color: 'bg-orange-50 text-orange-600' },
          ].map(item => (
            <div key={item.label} className={`${item.color} rounded-xl p-4 flex flex-col items-center gap-2 text-center`}>
              {item.icon}
              <span className="text-xs font-semibold leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de atividades */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">🎮 Atividades disponíveis</h2>
        <div className="grid gap-2">
          {modules.map((mod, i) => {
            const done = completedModules.includes(mod.id)
            return (
              <button
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99]
                  ${done
                    ? 'border-green-200 bg-green-50 hover:border-green-300'
                    : 'border-gray-200 bg-white hover:border-petroleum-300 hover:bg-petroleum-50'}`}
              >
                <span className="text-2xl w-8 text-center">{mod.emoji}</span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${done ? 'text-green-700' : 'text-gray-800'}`}>{mod.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Módulo {i + 1}</p>
                </div>
                {done
                  ? <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  : <Circle size={20} className="text-gray-300 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
