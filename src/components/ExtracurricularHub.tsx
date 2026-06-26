/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Brain, 
  Zap, 
  Mic2, 
  Search, 
  MessageCircle,
  Play,
  Lock,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { MemoryGame } from './tools/MemoryGame';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  status: 'active' | 'soon' | 'new';
  previewImg: string;
}

const GAMES: Game[] = [
  {
    id: 'memory',
    title: 'Memorama Inmersivo',
    description: 'Entrena tu retina y memoria asociativa con vocabulario clave de tu nivel actual.',
    icon: Brain,
    color: 'from-cyan-500/20 to-blue-500/10',
    status: 'active',
    previewImg: 'https://images.unsplash.com/photo-1553481235-99802199e81a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'speed',
    title: 'Speed Word Hunt',
    description: '¿Qué tan rápido puedes armar la palabra correcta? Un reto de velocidad pura.',
    icon: Zap,
    color: 'from-[#DEFF9A]/20 to-green-500/10',
    status: 'soon',
    previewImg: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'visual',
    title: 'Dictado Visual',
    description: 'Escucha, interpreta y selecciona el escenario correcto. Comprensión auditiva avanzada.',
    icon: Search,
    color: 'from-purple-500/20 to-pink-500/10',
    status: 'soon',
    previewImg: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'idioms',
    title: 'Idiom Matcher',
    description: 'Domina las frases que los nativos realmente usan en contextos informales.',
    icon: MessageCircle,
    color: 'from-orange-500/20 to-red-500/10',
    status: 'soon',
    previewImg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'voice',
    title: 'Shadowing Challenge',
    description: 'Imita la entonación y el ritmo de hablantes nativos con feedback de IA en tiempo real.',
    icon: Mic2,
    color: 'from-blue-500/20 to-indigo-500/10',
    status: 'soon',
    previewImg: 'https://images.unsplash.com/photo-1478737270239-2fccd8c78619?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'context',
    title: 'Context Master',
    description: 'Diferentes escenarios, diferentes palabras. Demuestra que sabes cuándo decir qué.',
    icon: Gamepad2,
    color: 'from-yellow-500/20 to-amber-500/10',
    status: 'soon',
    previewImg: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400'
  }
];

export function ExtracurricularHub() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const renderContent = () => {
    if (activeGame === 'memory') {
      return <MemoryGame level="Nivel A1" onClose={() => setActiveGame(null)} />;
    }

    return (
      <div className="space-y-8 md:space-y-12 pb-48 w-full touch-pan-y overscroll-contain relative z-10">
        {/* Exploratory Header - ALTO VOLTAJE Edition */}
        <section className="relative overflow-hidden p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-yellow-500/20 via-[#DEFF9A]/10 to-transparent border border-[#DEFF9A]/20 shadow-[0_0_50px_rgba(222,255,154,0.1)]">
           <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#DEFF9A]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
           
           <div className="relative z-10 max-w-3xl space-y-8">
              <div className="flex items-center gap-3">
                 <div className="px-4 py-1.5 rounded-full bg-yellow-400 text-[#061a1a] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                    <Zap size={12} fill="currentColor" /> ALTO VOLTAJE
                 </div>
                 <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Pioneer Zone</span>
                 <Sparkles size={16} className="text-[#DEFF9A] animate-pulse" />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">
                  Exploración <br /> <span className="text-[#DEFF9A] drop-shadow-[0_0_30px_rgba(222,255,154,0.5)]">Sin Fronteras</span>
                </h1>
                <p className="text-white font-bold text-lg md:text-xl italic leading-tight max-w-2xl text-yellow-400/90">
                  ¿Crees que las herramientas que usas son geniales? ¡Espera a ver lo que este botón esconde!
                </p>
              </div>

              <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed max-w-2xl bg-black/20 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                Juegos inmersivos, retos de velocidad y actividades de pura adrenalina te esperan. Este espacio ha sido diseñado para los espíritus más curiosos. Aquí no hay exámenes; solo <span className="text-[#DEFF9A] font-black uppercase tracking-widest">práctica inmersiva pura</span>.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                 <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                    <TrendingUp size={16} className="text-cyan-400" />
                    <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">+15% Retención Visual</span>
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Adrenalina Pura</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {GAMES.map((game, i) => (
             <motion.div
               key={game.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${game.status === 'active' ? 'bg-white/[0.02] border-white/10 hover:border-[#DEFF9A]/40 cursor-pointer lg:hover:-translate-y-2' : 'bg-white/[0.01] border-white/5 grayscale opacity-60'}`}
               onClick={() => game.status === 'active' && setActiveGame(game.id)}
             >
                {/* Background Image Preview */}
                <div className="absolute inset-0 z-0">
                   <img src={game.previewImg} alt="" className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                   <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-40`} />
                </div>

                <div className="relative z-10 p-8 flex flex-col h-full min-h-[280px]">
                   <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${game.status === 'active' ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/20 text-[#DEFF9A] group-hover:bg-[#DEFF9A] group-hover:text-[#061a1a]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                         <game.icon size={28} />
                      </div>
                      {game.status === 'soon' ? (
                        <span className="px-3 py-1 rounded-full bg-white/5 text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                           <Lock size={10} /> Soon
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-[#DEFF9A]/20 text-[#DEFF9A] text-[8px] font-black uppercase tracking-widest">
                           Nuevo
                        </span>
                      )}
                   </div>

                   <div className="mt-auto space-y-3">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tight group-hover:text-[#DEFF9A] transition-colors">{game.title}</h3>
                      <p className="text-white/40 text-xs font-medium leading-relaxed line-clamp-2 italic">"{game.description}"</p>
                      
                      <div className="pt-4 flex items-center justify-between">
                         {game.status === 'active' ? (
                           <div className="flex items-center gap-3 text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">
                              Jugar Ahora <Play size={10} fill="currentColor" />
                           </div>
                         ) : (
                           <div className="text-white/10 text-[10px] font-black uppercase tracking-widest">
                              Próximamente
                           </div>
                         )}
                         <ChevronRight size={16} className={`transition-transform duration-500 ${game.status === 'active' ? 'text-[#DEFF9A] group-hover:translate-x-2' : 'text-white/10'}`} />
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-full">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}
