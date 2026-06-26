/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Award, 
  Zap, 
  Leaf, 
  History, 
  Medal,
  Sparkles,
  Trash2,
  Send,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface LibraryAchievement {
  id: string;
  category: 'TEACHER' | 'PLANET' | 'HISTORY' | 'STUDENT';
  title: string;
  description: string;
  value: string;
  iconName: 'Zap' | 'Star' | 'Trophy' | 'Leaf' | 'Medal' | 'Sparkles' | 'History' | 'Award';
  accent: 'green' | 'cyan' | 'orange' | 'purple';
  isLeader?: boolean;
  studentName: string;
  createdAt: string;
}

// Icon mapper helper
export function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'Zap': return Zap;
    case 'Star': return Star;
    case 'Trophy': return Trophy;
    case 'Leaf': return Leaf;
    case 'Medal': return Medal;
    case 'Sparkles': return Sparkles;
    case 'History': return History;
    case 'Award':
    default: return Award;
  }
}

// Default achievements mock matching previous Alumno state
const defaultAchievements: LibraryAchievement[] = [
  { 
    id: '1', 
    category: 'STUDENT', 
    title: 'The Bridge: Elite Pronunciation', 
    description: 'Alcanzada precisión vocal del 98% en escenarios de viaje.', 
    value: 'Nivel 10', 
    iconName: 'Zap', 
    accent: 'green',
    isLeader: true,
    studentName: 'Juan Pérez',
    createdAt: 'HOY'
  },
  { 
    id: '2', 
    category: 'STUDENT', 
    title: 'Streak: Burning Flame', 
    description: '21 días consecutivos de interacción con el ecosistema IA.', 
    value: 'Legendario', 
    iconName: 'Sparkles', 
    accent: 'orange',
    isLeader: true,
    studentName: 'Sofía Méndez',
    createdAt: 'AYER'
  },
  { 
    id: '3', 
    category: 'PLANET', 
    title: 'Zero Paper Master', 
    description: 'Reducción de 2.5 toneladas de huella de carbono este ciclo.', 
    value: '-92% Papel', 
    iconName: 'Leaf', 
    accent: 'cyan',
    studentName: 'Mateo Sandoval',
    createdAt: 'HACE 2 DÍAS'
  },
  { 
    id: '4', 
    category: 'STUDENT', 
    title: 'Grammar Fixer Expert', 
    description: '100 correcciones de texto aplicadas con éxito.', 
    value: 'Silver Med', 
    iconName: 'Medal', 
    accent: 'purple',
    studentName: 'Valentina Rojas',
    createdAt: 'HACE 3 DÍAS'
  },
];

const availableStudents = [
  'Juan Pérez',
  'Sofía Méndez',
  'Carlos Mendoza',
  'Mateo Sandoval',
  'Valentina Rojas',
  'Camila Blanco',
  'Esteban Paredes',
  'Lucía Fernández',
  'Guillermo Fraustro',
  'Aline Gutiérrez',
  'Jorge Montes',
  'Robert G.',
  'Emily W.',
  'Patricia L.',
  'Adriana N.'
];

export function DocenteReconocimiento() {
  const [list, setList] = useState<LibraryAchievement[]>(() => {
    let rawList = defaultAchievements;
    try {
      const saved = localStorage.getItem('library_student_achievements');
      if (saved) {
        rawList = JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }

    // Enforce absolute key uniqueness to prevent duplicate keys in layout list
    const seen = new Set<string>();
    const uniqueList: LibraryAchievement[] = [];
    for (const item of rawList) {
      let id = item.id;
      if (!id || seen.has(id)) {
        id = 'ach_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      }
      seen.add(id);
      uniqueList.push({ ...item, id });
    }
    return uniqueList;
  });

  // Form states
  const [targetStudent, setTargetStudent] = useState(availableStudents[0]);
  const [awardTitle, setAwardTitle] = useState('ESPECIALISTA EN DIALOGO DE AEROPUERTO');
  const [awardDescription, setAwardDescription] = useState('Completó con fluidez oral la asignación del rol pragmático de aduanas con un 95% general.');
  const [awardValue, setAwardValue] = useState('+150 PTS');
  const [awardIcon, setAwardIcon] = useState<'Zap' | 'Star' | 'Trophy' | 'Leaf' | 'Medal' | 'Sparkles' | 'History' | 'Award'>('Trophy');
  const [awardAccent, setAwardAccent] = useState<'green' | 'cyan' | 'orange' | 'purple'>('green');
  const [isLeader, setIsLeader] = useState(false);
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);

  // Template pre-configurations to quickly populate form
  const templates = [
    {
      title: 'ORATORIA PRO BILINGÜE',
      description: 'Demostró alta precisión conversacional con el tutor interactivo IA de TECLINGO.',
      value: 'Elite Nivel 5',
      icon: 'Sparkles' as const,
      accent: 'green' as const,
      isLeader: true
    },
    {
      title: 'EMBAJADOR PAPEL CERO',
      description: 'Completó 4 unidades del portafolio digital de forma digital nativa sin impresiones.',
      value: '-100% Papel',
      icon: 'Leaf' as const,
      accent: 'cyan' as const,
      isLeader: false
    },
    {
      title: 'HISTORIAN COGNITIVO',
      description: 'Dominó de forma impecable las lecciones cronológicas de gramática y vocabulario.',
      value: 'Legendario',
      icon: 'History' as const,
      accent: 'orange' as const,
      isLeader: false
    },
    {
      title: 'TOEFL FIRST MILESTONE',
      description: 'Superó exitosamente el primer examen de simulacro de diagnóstico con puntaje sobresaliente.',
      value: '95/100 A1',
      icon: 'Trophy' as const,
      accent: 'purple' as const,
      isLeader: true
    }
  ];

  const applyTemplate = (t: typeof templates[0]) => {
    setAwardTitle(t.title);
    setAwardDescription(t.description);
    setAwardValue(t.value);
    setAwardIcon(t.icon);
    setAwardAccent(t.accent);
    setIsLeader(t.isLeader);
  };

  useEffect(() => {
    try {
      localStorage.setItem('library_student_achievements', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }, [list]);

  const handleCreateAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardTitle.trim() || !awardDescription.trim()) return;

    const newAward: LibraryAchievement = {
      id: 'ach_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      category: 'STUDENT',
      title: awardTitle.toUpperCase(),
      description: awardDescription,
      value: awardValue.toUpperCase() || 'SABER PRO',
      iconName: awardIcon,
      accent: awardAccent,
      isLeader: isLeader,
      studentName: targetStudent,
      createdAt: 'HOY'
    };

    setList(prev => [newAward, ...prev]);
    setIsSuccessAnimated(true);

    // Reset some fields or notify
    setTimeout(() => {
      setIsSuccessAnimated(false);
    }, 4000);
  };

  const handleRevokeAward = (id: string) => {
    setList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 pb-20 text-left">
      {/* 1. SECCIÓN PRINCIPAL HERO */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/20 to-purple-950/20 border border-emerald-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono font-black uppercase tracking-widest leading-none">
            Ecosistema de Reconocimiento v4.2
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Gestión de Reconocimiento Institucional</h2>
          <p className="text-white/50 text-[11px] max-w-2xl">
            Asigna medallas digitales, galardones y premios escolares directamente a los estudiantes. El Muro de Logros es el concentrador de motivación y gamificación ecológica para el alumnado.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <div className="px-5 py-3.5 bg-black/45 border border-white/5 rounded-2xl text-center">
            <span className="block text-[8px] text-white/30 uppercase font-bold">Total Asignados</span>
            <span className="text-lg font-mono font-black text-[#DEFF9A]">{list.length} Medallas</span>
          </div>
          <div className="px-5 py-3.5 bg-black/45 border border-white/5 rounded-2xl text-center">
            <span className="block text-[8px] text-white/30 uppercase font-bold">Líderes de Muro</span>
            <span className="text-lg font-mono font-black text-cyan-400">
              {list.filter(item => item.isLeader).length} Destacados
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- FORMULARIO DE OTORGAMIENTO (col-span-5) --- */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-5 border-white/5 bg-[#0b1219]/40 relative overflow-hidden">
            <div className="absolute top-0 left-5 w-12 h-[2px] bg-[#DEFF9A]" />
            
            <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-3">
              <span className="p-1.5 rounded-lg bg-emerald-400/10 text-emerald-400">
                <UserPlus size={14} />
              </span>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Otorgar Galardón Digital</h3>
            </div>

            {isSuccessAnimated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-[#DEFF9A] text-black flex items-center justify-center text-2xl font-black mx-auto shadow-[0_0_25px_rgba(222,255,154,0.35)]">
                  ✓
                </div>
                <div className="space-y-1.5">
                  <p className="text-white text-sm font-black uppercase tracking-wider">¡LOGRO ESCOLAR ASIGNADO!</p>
                  <p className="text-white/50 text-[10px] leading-relaxed max-w-xs mx-auto">
                    La medalla digital ha sido procesada de forma autoritaria por la docencia y ya está sincronizada sobre el muro del alumno.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleCreateAward} className="space-y-4">
                {/* 1. Student Selector */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono font-black text-white/30 uppercase tracking-widest">Estudiante Receptor</label>
                  <select
                    value={targetStudent}
                    onChange={(e) => setTargetStudent(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white uppercase focus:outline-none focus:border-[#DEFF9A]"
                  >
                    {availableStudents.map((stud) => (
                      <option key={stud} value={stud} className="bg-[#0b1219]">
                        {stud} • Activo
                      </option>
                    ))}
                  </select>
                </div>

                {/* Templates Quick Bar */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono font-black text-white/30 uppercase tracking-widest">Plantillas Rápidas de la Dirección</label>
                  <div className="flex flex-wrap gap-1.5">
                    {templates.map((tpl, idx) => (
                      <button
                        key={`template-tpl-${idx}`}
                        type="button"
                        onClick={() => applyTemplate(tpl)}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] text-white/80 hover:bg-[#DEFF9A]/10 hover:border-[#DEFF9A]/30 font-semibold transition-all transition-colors"
                      >
                        ⚡ {tpl.title.substring(0, 15)}..
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Title */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono font-black text-white/30 uppercase tracking-widest">Nombre/Título del Logro</label>
                  <input
                    type="text"
                    required
                    value={awardTitle}
                    onChange={(e) => setAwardTitle(e.target.value.toUpperCase())}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#DEFF9A]"
                    placeholder="Escribre un título estimulante"
                  />
                </div>

                {/* 3. Description / Action text */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono font-black text-white/30 uppercase tracking-widest">Descripción del Atributo Meritorio</label>
                  <textarea
                    required
                    value={awardDescription}
                    onChange={(e) => setAwardDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#DEFF9A] resize-none leading-relaxed"
                    placeholder="Justificación del reconocimiento..."
                  />
                </div>

                {/* 4. Reward Value metric */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono font-black text-white/30 uppercase tracking-widest">Métrica de Atribución (Value/Pts)</label>
                  <input
                    type="text"
                    value={awardValue}
                    onChange={(e) => setAwardValue(e.target.value.toUpperCase())}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#DEFF9A] font-bold focus:outline-none focus:border-[#DEFF9A]"
                    placeholder="Ej. +200 PTS, NIVEL EXCELENTE o PLATINUM"
                  />
                </div>

                {/* 5. Custom Badge Design Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Icon choice */}
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-black text-white/30 uppercase tracking-widest">Heráldica / Icono</label>
                    <select
                      value={awardIcon}
                      onChange={(e: any) => setAwardIcon(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase"
                    >
                      <option value="Trophy">Trophy (Copa)</option>
                      <option value="Star">Star (Estrella)</option>
                      <option value="Award">Award (Certificado)</option>
                      <option value="Zap">Zap (Fuego/Rayo)</option>
                      <option value="Leaf">Leaf (Huella Verde)</option>
                      <option value="Medal">Medal (Medalla)</option>
                      <option value="Sparkles">Sparkles (Brillo)</option>
                      <option value="History">History (Reloj)</option>
                    </select>
                  </div>

                  {/* Accent choice */}
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-black text-white/30 uppercase tracking-widest">Aura Cromática</label>
                    <div className="grid grid-cols-4 gap-1.5 h-10 items-center">
                      {[
                        { name: 'green', css: 'bg-emerald-500' },
                        { name: 'cyan', css: 'bg-cyan-400' },
                        { name: 'orange', css: 'bg-amber-500' },
                        { name: 'purple', css: 'bg-purple-500' }
                      ].map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setAwardAccent(col.name as any)}
                          className={`w-full h-8 rounded-lg relative flex items-center justify-center ${col.css} transition-all ${awardAccent === col.name ? 'ring-2 ring-white scale-105 shadow-md' : 'opacity-60 hover:opacity-100'}`}
                        >
                          {awardAccent === col.name && <span className="text-[10px] text-black font-black">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Header outstanding check */}
                <div className="p-3 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-white uppercase">Destacar en Cabecera</span>
                    <span className="block text-[8px] text-white/30">Muestra el laurel de líder con aura brillante</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isLeader}
                    onChange={(e) => setIsLeader(e.target.checked)}
                    className="w-4 h-4 accent-[#DEFF9A] cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#DEFF9A] hover:bg-[#DEFF9A]/90 text-black font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(222,255,154,0.15)] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={12} />
                  Emitir Reconocimiento
                </button>
              </form>
            )}
          </GlassCard>
        </div>

        {/* --- MURO DE SEGUIMIENTO (col-span-7) --- */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-5 border-white/5 bg-[#0b1219]/40">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                  <Trophy size={14} />
                </span>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Muro de Logros General</h3>
              </div>
              <button
                onClick={() => {
                  if (confirm('¿Deseas restaurar el muro a los valores institucionales por defecto?')) {
                    setList(defaultAchievements);
                  }
                }}
                className="text-[8.5px] font-mono font-black text-white/30 hover:text-[#DEFF9A] uppercase tracking-widest transition-colors"
              >
                ☯ Reiniciar Valores
              </button>
            </div>

            {list.length === 0 ? (
              <div className="py-24 text-center rounded-3xl border border-dashed border-white/5 bg-black/20 space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 text-white/30 flex items-center justify-center mx-auto">
                  <Award size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-white text-xs font-black uppercase tracking-widest">Ninguna medalla emitida</p>
                  <p className="text-white/40 text-[10px] max-w-xs mx-auto">
                    Los docentes no han otorgado reconocimientos aún para este período académico. Utiliza el formulario lateral para comenzar.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                {list.map((item) => {
                  const IconComponent = getIconComponent(item.iconName);
                  return (
                    <motion.div
                      layout
                      key={item.id}
                      className={`p-4 rounded-[2rem] border relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 ${
                        item.isLeader 
                          ? 'bg-gradient-to-br from-[#0b1219]/90 to-black/20 border-[#DEFF9A]/20 shadow-[0_10px_30px_rgba(222,255,154,0.03)]' 
                          : 'bg-[#0b1219]/60 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3.5 rounded-2xl shrink-0 ${
                          item.accent === 'green' ? 'bg-[#40b06b]/15 text-[#4ade80]' :
                          item.accent === 'cyan' ? 'bg-[#22D3EE]/15 text-[#22D3EE]' :
                          item.accent === 'orange' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' :
                          'bg-[#a855f7]/15 text-[#c084fc]'
                        }`}>
                          <IconComponent size={24} />
                        </div>

                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/50 text-[7px] font-mono font-black uppercase leading-none">
                              {item.createdAt}
                            </span>
                            <span className="text-[#DEFF9A] text-[9.5px] font-mono font-black uppercase tracking-wide">
                              ➔ {item.studentName}
                            </span>
                            {item.isLeader && (
                              <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-[6.5px] font-bold tracking-widest uppercase">
                                ★ Líder
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-xs font-black text-white uppercase leading-snug tracking-tight">
                            {item.title}
                          </h4>
                          <p className="text-white/50 text-[10px] leading-relaxed max-w-md">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-4 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="text-right">
                          <span className="block text-[7px] text-white/30 font-bold uppercase tracking-wider">Premio / Saberes</span>
                          <span className={`text-sm font-mono font-black ${
                            item.accent === 'green' ? 'text-[#DEFF9A]' :
                            item.accent === 'cyan' ? 'text-cyan-400' :
                            item.accent === 'orange' ? 'text-amber-400' :
                            'text-purple-400'
                          }`}>
                            {item.value}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRevokeAward(item.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider flex items-center gap-1 leading-none shadow-sm"
                          title="Revocar galardón"
                        >
                          <Trash2 size={10} />
                          Revocar
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
