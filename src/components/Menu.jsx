import { CheckCircle, Circle, RefreshCw } from 'lucide-react'

export default function Menu({ modules, currentModule, completedModules, onSelect, onReset, isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed top-16 left-0 z-30 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200
        shadow-xl overflow-y-auto transition-transform duration-300 flex flex-col
        lg:sticky lg:translate-x-0 lg:shadow-none lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <nav className="flex-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-2">Módulos</p>
        <ul className="space-y-1">
          {modules.map((mod, i) => {
            const done = completedModules.includes(mod.id)
            const active = currentModule === mod.id
            return (
              <li key={mod.id}>
                <button
                  onClick={() => onSelect(mod.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all
                    ${active
                      ? 'bg-petroleum-500 text-white font-semibold shadow-md'
                      : done
                        ? 'text-petroleum-700 hover:bg-petroleum-50'
                        : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <span className="text-base w-6 flex-shrink-0 text-center">{mod.emoji}</span>
                  <span className="flex-1 leading-tight">{mod.name}</span>
                  {done ? (
                    <CheckCircle size={16} className={active ? 'text-fundat-300' : 'text-green-500'} />
                  ) : (
                    <Circle size={16} className="text-gray-300" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Botão reiniciar */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
        >
          <RefreshCw size={15} />
          Reiniciar tudo
        </button>
      </div>
    </aside>
  )
}
