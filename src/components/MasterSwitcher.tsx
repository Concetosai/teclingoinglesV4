/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ShieldAlert, 
  User, 
  GraduationCap, 
  ChevronDown,
  Terminal,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type UserRole = 'DIRECTOR' | 'DOCENTE' | 'ALUMNO' | 'TUTOR' | 'ADMIN';

interface MasterSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function MasterSwitcher({ currentRole, onRoleChange }: MasterSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { 
      id: 'DIRECTOR' as UserRole, 
      label: 'Director Master', 
      icon: ShieldAlert, 
      color: 'text-[#DEFF9A]', 
      accentBorder: 'border-[#DEFF9A]/30',
      accentBg: 'bg-[#DEFF9A]/10',
      glowBg: 'bg-[#DEFF9A]',
      previewBg: 'bg-gradient-to-r from-[#010a0a] via-[#041a1a] to-[#010808] border-[#DEFF9A]/30 text-[#DEFF9A]',
      inactiveBg: 'bg-[#010a0a]/60 hover:bg-[#041a1a]/80 border-white/5 hover:border-[#DEFF9A]/20 text-white/60 hover:text-white',
      badgeClass: 'bg-[#DEFF9A]/15 text-[#DEFF9A]',
      themeName: 'Tema Esmeralda (Principal)'
    },
    { 
      id: 'DOCENTE' as UserRole, 
      label: 'Docente Operativo', 
      icon: GraduationCap, 
      color: 'text-white', 
      accentBorder: 'border-white/30',
      accentBg: 'bg-white/10',
      glowBg: 'bg-white',
      previewBg: 'bg-gradient-to-r from-[#050506] via-[#18191c] to-[#050506] border-white/20 text-white',
      inactiveBg: 'bg-[#050506]/60 hover:bg-[#18191c]/80 border-white/5 hover:border-white/20 text-white/60 hover:text-white',
      badgeClass: 'bg-white/10 text-white',
      themeName: 'Tema Monocromo Blanquinegro'
    },
    { 
      id: 'ALUMNO' as UserRole, 
      label: 'Alumno Inmersión', 
      icon: User, 
      color: 'text-[#22D3EE]', 
      accentBorder: 'border-[#22D3EE]/30',
      accentBg: 'bg-[#22D3EE]/10',
      glowBg: 'bg-[#22D3EE]',
      previewBg: 'bg-gradient-to-r from-[#020b18] via-[#051c3a] to-[#010812] border-[#22D3EE]/20 text-[#22D3EE]',
      inactiveBg: 'bg-[#020b18]/60 hover:bg-[#051c3a]/80 border-white/5 hover:border-[#22D3EE]/20 text-white/60 hover:text-white',
      badgeClass: 'bg-cyan-500/10 text-[#22D3EE]',
      themeName: 'Tema Azulado Cósmico'
    },
  ];

  const activeRole = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4.5 py-2.5 rounded-2xl bg-black/45 border transition-all group overflow-hidden ${
          activeRole.accentBorder
        } hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}
      >
        <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_12px_3px_rgba(255,255,255,0.05)] ${activeRole.glowBg}`} />
        <span className={`text-[10px] font-black uppercase tracking-widest ${activeRole.color}`}>
          {activeRole.label}
        </span>
        <ChevronDown size={14} className="text-white/30 group-hover:text-white/80 transition-transform duration-300" />
        
        {/* Animated background glow matching role color */}
        <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-r from-transparent via-current to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ${activeRole.color}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className={`absolute bottom-full left-0 mb-3.5 w-[19.5rem] bg-[#07090d]/98 backdrop-blur-[45px] border-x border-b border-white/10 rounded-[2.5rem] overflow-hidden z-[100] shadow-[0_-25px_60px_rgba(0,0,0,0.7)] border-t-4 transition-all duration-300 ${
              currentRole === 'DIRECTOR' ? 'border-t-[#DEFF9A]' :
              currentRole === 'DOCENTE' ? 'border-t-white' :
              'border-t-[#22D3EE]'
            }`}
          >
            <div className="p-4 border-b border-white/5 bg-white/5 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-1 relative z-10">
                  <Terminal size={12} className={activeRole.color} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55">Modo Simulación Omnipresente</span>
               </div>
               <p className="text-[10px] font-semibold text-white/30 leading-normal relative z-10">Vístete con cualquier rol institucional para validar UX.</p>
               
               {/* Background light glow based on active role */}
               <div className={`absolute -right-12 -top-12 w-24 h-24 rounded-full blur-[40px] opacity-[0.08] ${activeRole.glowBg}`} />
            </div>

            <div className="p-3.5 space-y-2">
              {roles.map((role) => {
                const isSelected = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      onRoleChange(role.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border group relative overflow-hidden ${
                      isSelected ? role.previewBg : role.inactiveBg
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`p-2 rounded-xl transition-all duration-300 ${
                        isSelected ? role.badgeClass : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <role.icon size={16} className={isSelected ? role.color : 'text-white/40 group-hover:text-white'} />
                      </div>
                      <div className="text-left">
                        <span className={`text-xs font-black uppercase tracking-tight block ${
                          isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'
                        }`}>
                          {role.label}
                        </span>
                        <span className={`text-[8px] font-black block uppercase tracking-wider ${
                          isSelected ? 'text-white/45' : 'text-white/20 group-hover:text-white/30'
                        }`}>
                          {role.themeName}
                        </span>
                      </div>
                    </div>
                    
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 relative z-10">
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/10 text-white">Activo</span>
                        <Zap size={14} className={`${role.color} animate-pulse shrink-0`} />
                      </div>
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${role.glowBg} opacity-20 group-hover:opacity-85 transition-all duration-300 shrink-0 relative z-10 shadow-[0_0_8px_currentColor]`} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-black/50 space-y-3.5">
               <button 
                onClick={() => {
                  onRoleChange('DIRECTOR');
                  setIsOpen(false);
                }}
                className="w-full text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors block text-center py-1 border border-transparent hover:border-white/5 hover:bg-white/5 rounded-xl"
               >
                 Regreso Instantáneo a Master
               </button>
               <div className="h-px bg-white/5" />
               <button 
                onClick={() => {
                  setIsOpen(false);
                  (window as any).tecnolingoLogout?.();
                }}
                className={`w-full py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  currentRole === 'DIRECTOR' ? 'border-[#DEFF9A]/20 text-[#DEFF9A]/70 hover:text-[#DEFF9A] hover:bg-[#DEFF9A]/10 hover:border-[#DEFF9A]/40' :
                  currentRole === 'DOCENTE' ? 'border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40' :
                  'border-[#22D3EE]/20 text-[#22D3EE]/70 hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 hover:border-[#22D3EE]/40'
                }`}
               >
                  Portal de Acceso
               </button>
               <button 
                onClick={() => {
                  setIsOpen(false);
                  (window as any).tecnolingoLogout?.();
                }}
                className="w-full text-[9px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-400 transition-colors block text-center"
               >
                 Desconectarse
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
