import { useState, useEffect } from 'react'
import Header from './components/Header'
import Menu from './components/Menu'
import Home from './components/Home'
import DragDrop from './components/modules/DragDrop'
import Quiz from './components/modules/Quiz'
import VerdadeiroFalso from './components/modules/VerdadeiroFalso'
import JogoDaMemoria from './components/modules/JogoDaMemoria'
import CompleteFrase from './components/modules/CompleteFrase'
import Associacao from './components/modules/Associacao'
import CacaPalavras from './components/modules/CacaPalavras'
import OrdenarSequencia from './components/modules/OrdenarSequencia'
import QuizRelampago from './components/modules/QuizRelampago'
import Certificado from './components/modules/Certificado'

// Lista de todos os módulos disponíveis
export const MODULES = [
  { id: 'dragdrop',      emoji: '🖱️',  name: 'Hardware ou Software?',       component: DragDrop },
  { id: 'quiz',          emoji: '❓',  name: 'Quiz: Teste seus conhecimentos', component: Quiz },
  { id: 'verdadeirofalso', emoji: '✅', name: 'Verdadeiro ou Falso?',         component: VerdadeiroFalso },
  { id: 'memoria',       emoji: '🃏',  name: 'Jogo da Memória',               component: JogoDaMemoria },
  { id: 'completefrase', emoji: '✏️',  name: 'Complete a Frase',              component: CompleteFrase },
  { id: 'associacao',    emoji: '🔗',  name: 'Combine os Pares',              component: Associacao },
  { id: 'cacapalavras',  emoji: '🔍',  name: 'Caça-palavras',                 component: CacaPalavras },
  { id: 'ordenar',       emoji: '🔢',  name: 'Ordene Corretamente',           component: OrdenarSequencia },
  { id: 'relampago',     emoji: '⚡',  name: 'Quiz Relâmpago',                component: QuizRelampago },
  { id: 'certificado',   emoji: '🏆',  name: 'Seu Desempenho',               component: Certificado },
]

export default function App() {
  const [currentModule, setCurrentModule] = useState('home')
  const [totalScore, setTotalScore] = useState(0)
  const [completedModules, setCompletedModules] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  // Carrega progresso salvo
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fundat-progress')
      if (saved) {
        const data = JSON.parse(saved)
        setTotalScore(data.totalScore || 0)
        setCompletedModules(data.completedModules || [])
      }
    } catch (_) {}
  }, [])

  // Salva progresso automaticamente
  useEffect(() => {
    localStorage.setItem('fundat-progress', JSON.stringify({ totalScore, completedModules }))
  }, [totalScore, completedModules])

  const addScore = (points) => {
    setTotalScore(prev => Math.max(0, prev + points))
  }

  const markCompleted = (moduleId) => {
    setCompletedModules(prev => prev.includes(moduleId) ? prev : [...prev, moduleId])
  }

  const resetAll = () => {
    if (!window.confirm('Deseja reiniciar tudo? Seu progresso e pontuação serão apagados.')) return
    setTotalScore(0)
    setCompletedModules([])
    setCurrentModule('home')
    localStorage.removeItem('fundat-progress')
  }

  const goToModule = (id) => {
    setCurrentModule(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goNext = () => {
    const idx = MODULES.findIndex(m => m.id === currentModule)
    if (idx >= 0 && idx < MODULES.length - 1) goToModule(MODULES[idx + 1].id)
  }

  const progress = Math.round((completedModules.length / MODULES.length) * 100)
  const CurrentComponent = MODULES.find(m => m.id === currentModule)?.component

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header
        totalScore={totalScore}
        progress={progress}
        completedCount={completedModules.length}
        totalModules={MODULES.length}
        onMenuToggle={() => setMenuOpen(o => !o)}
        menuOpen={menuOpen}
      />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Menu
          modules={MODULES}
          currentModule={currentModule}
          completedModules={completedModules}
          onSelect={goToModule}
          onReset={resetAll}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        {/* Overlay escuro no mobile quando menu aberto */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <main className="flex-1 p-4 md:p-8 w-full max-w-4xl mx-auto">
          {currentModule === 'home' ? (
            <Home
              onStart={() => goToModule('dragdrop')}
              completedCount={completedModules.length}
              totalModules={MODULES.length}
              progress={progress}
              onSelectModule={goToModule}
              modules={MODULES}
              completedModules={completedModules}
            />
          ) : CurrentComponent ? (
            <CurrentComponent
              onAddScore={addScore}
              onComplete={() => markCompleted(currentModule)}
              onNext={goNext}
              isCompleted={completedModules.includes(currentModule)}
              totalScore={totalScore}
              completedModules={completedModules}
              modules={MODULES}
            />
          ) : null}
        </main>
      </div>

      <footer className="text-center py-4 text-sm text-gray-400 border-t border-gray-200 bg-white">
        Prefeitura de Aracaju · FUNDAT · 2026
      </footer>
    </div>
  )
}
