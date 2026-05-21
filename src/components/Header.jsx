import { Menu, X, Star, Trophy } from 'lucide-react'

export default function Header({ totalScore, progress, completedCount, totalModules, onMenuToggle, menuOpen }) {
  return (
    <header className="sticky top-0 z-30 bg-petroleum-500 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 h-16 max-w-screen-xl mx-auto">
        {/* Botão menu mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-petroleum-600 transition-colors"
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-sm md:text-base truncate">
          <span className="text-xl">💻</span>
          <span className="hidden sm:inline">Informática Básica</span>
          <span className="text-fundat-400 font-bold hidden sm:inline">— FUNDAT Aracaju</span>
          <span className="sm:hidden font-bold text-fundat-400">FUNDAT</span>
        </div>

        {/* Pontuação + progresso */}
        <div className="flex items-center gap-3 text-sm">
          <div className="hidden md:flex items-center gap-1.5 bg-petroleum-600 rounded-full px-3 py-1">
            <Trophy size={14} className="text-fundat-400" />
            <span className="font-semibold">{completedCount}/{totalModules}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-fundat-500 text-white rounded-full px-3 py-1 font-bold">
            <Star size={14} />
            <span>{totalScore} pts</span>
          </div>
        </div>
      </div>

      {/* Barra de progresso geral */}
      <div className="h-1.5 bg-petroleum-700">
        <div
          className="h-full bg-fundat-400 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  )
}
