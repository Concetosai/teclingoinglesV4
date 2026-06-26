/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Users, 
  Plus, 
  GraduationCap, 
  Layers,
  ArrowRight,
  Zap,
  MoreVertical,
  Trash2,
  Clock,
  LayoutGrid,
  Lock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, Group, GroupSubject } from '../context/AppContext';
import { GlassCard } from './GlassCard';

interface GroupManagerProps {
  onOpenScheduler: (groupId: string) => void;
}

export function GroupManager({ onOpenScheduler }: GroupManagerProps) {
  const { careers, groups, addGroup, deleteGroup } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    careerId: '',
    semester: '1',
    section: 'A',
    shift: 'Matutino'
  });

  // Lógica de Herencia: Clonar materias de la carrera
  const getInheritedSubjects = (): GroupSubject[] => {
    const career = careers.find(c => c.id === newGroupData.careerId);
    if (!career) return [];
    
    return career.subjects
      .filter(s => s.semester === parseInt(newGroupData.semester))
      .map(s => ({
        ...s,
        assignedTeacherId: undefined,
        isCompleted: false
      }));
  };

  const inheritedSubjects = getInheritedSubjects();

  const handleCreateGroup = () => {
    if (!newGroupData.careerId) return;

    const careerName = careers.find(c => c.id === newGroupData.careerId)?.name || '';
    
    const group: Group = {
      id: `GRP-${Date.now()}`,
      name: `${careerName} - ${newGroupData.semester}° ${newGroupData.section}`,
      level: newGroupData.semester,
      careerId: newGroupData.careerId,
      subjects: inheritedSubjects,
      teacherId: '', // Se asigna después
      studentIds: [],
      schedule: {},
      time: newGroupData.shift === 'Matutino' ? '07:00 AM' : '02:00 PM',
      days: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'],
      status: 'ACTIVE'
    };

    addGroup(group);
    setShowAddModal(false);
    setNewGroupData({ careerId: '', semester: '1', section: 'A', shift: 'Matutino' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">Estructura Institucional</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            GRADOS Y <span className="text-[#DEFF9A]">GRUPOS</span>
          </h1>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 rounded-2xl bg-[#DEFF9A] text-black flex items-center gap-4 hover:scale-105 transition-all font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.3)]"
        >
          <Plus size={20} />
          Crear Nuevo Grupo
        </button>
      </header>

      {/* Group Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((group) => (
          <div key={group.id}>
            <GlassCard className="!p-0 group relative overflow-hidden border-white/5 hover:border-[#DEFF9A]/30 transition-all">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                      <Layers size={24} />
                   </div>
                   <button onClick={() => deleteGroup(group.id)} className="p-2 text-white/10 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                   </button>
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight italic leading-tight group-hover:text-[#DEFF9A] transition-colors">
                     {group.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{group.level}° Semestre</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                     <span className="text-[10px] font-bold text-[#DEFF9A] uppercase tracking-widest italic">Grupo {group.name.split(' ').pop()}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Carga Académica</p>
                      <p className="text-white text-xs font-bold">{group.subjects.length} Materias</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Estado</p>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#DEFF9A] animate-pulse" />
                         <p className="text-white text-xs font-bold uppercase">Activo</p>
                      </div>
                   </div>
                </div>

                 <button 
                   disabled
                   className="w-full py-4 rounded-xl bg-white/5 border border-white/5 text-white/20 text-[10px] font-black uppercase tracking-widest cursor-not-allowed select-none transition-all flex items-center justify-center gap-3"
                 >
                    Gestionar Materias (Deshabilitado) <Lock size={14} />
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </GlassCard>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] text-white/20 gap-6">
             <LayoutGrid size={80} className="opacity-20" />
             <div className="text-center">
                <p className="text-2xl font-black uppercase italic">Tablero Vacío</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1 opacity-60">Inicia la estructura creando el primer grupo académico</p>
             </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-[#061a1a]/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <GlassCard className="!p-8 space-y-8 border-[#DEFF9A]/20">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">NUEVA <span className="text-[#DEFF9A]">UNIDAD GRUPAL</span></h2>
                    <button onClick={() => setShowAddModal(false)} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-white/20 text-[10px] font-black uppercase tracking-widest pl-4">Seleccionar Carrera</label>
                       <select 
                         value={newGroupData.careerId}
                         onChange={(e) => setNewGroupData({...newGroupData, careerId: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-[#DEFF9A]/50 transition-all appearance-none"
                       >
                          <option value="" className="bg-[#061a1a]">-- Elegir Carrera --</option>
                          {careers.map(c => <option key={c.id} value={c.id} className="bg-[#061a1a]">{c.name}</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-white/20 text-[10px] font-black uppercase tracking-widest pl-4">Semestre</label>
                       <select 
                         value={newGroupData.semester}
                         onChange={(e) => setNewGroupData({...newGroupData, semester: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-[#DEFF9A]/50 transition-all appearance-none"
                       >
                          {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n} className="bg-[#061a1a]">{n}° Semestre</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-white/20 text-[10px] font-black uppercase tracking-widest pl-4">Grupo / Sección</label>
                       <input 
                         type="text" 
                         value={newGroupData.section}
                         placeholder="A, B, C..."
                         onChange={(e) => setNewGroupData({...newGroupData, section: e.target.value.toUpperCase()})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-[#DEFF9A]/50 transition-all"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-white/20 text-[10px] font-black uppercase tracking-widest pl-4">Turno</label>
                       <div className="grid grid-cols-2 gap-4">
                          {['Matutino', 'Vespertino'].map(t => (
                            <button 
                              key={t}
                              onClick={() => setNewGroupData({...newGroupData, shift: t})}
                              className={`p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${newGroupData.shift === t ? 'bg-[#DEFF9A] text-black border-[#DEFF9A]' : 'bg-white/5 text-white/20 border-white/10'}`}
                            >
                               {t}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Preview Inheritance */}
                 {newGroupData.careerId && (
                   <div className="p-6 rounded-[2.5rem] bg-[#DEFF9A]/5 border border-[#DEFF9A]/10 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-[#DEFF9A] flex items-center justify-center text-black">
                            <Zap size={16} />
                         </div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">Herencia Académica Detectada</h4>
                      </div>
                      <div className="space-y-2">
                         {inheritedSubjects.map((s, i) => (
                           <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[10px] font-bold text-white/60">{s.name}</span>
                              <span className="text-[9px] font-black text-[#DEFF9A]">{s.weeklyHours}h</span>
                           </div>
                         ))}
                         {inheritedSubjects.length === 0 && (
                           <p className="text-[10px] text-white/20 italic font-black text-center py-4">No hay materias configuradas para este semestre en el catálogo.</p>
                         )}
                      </div>
                   </div>
                 )}

                 <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-5 rounded-[2rem] border border-white/10 bg-white/5 text-white/60 hover:text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                       Cancelar / Regresar
                    </button>
                    <button 
                      onClick={handleCreateGroup}
                      disabled={!newGroupData.careerId}
                      className={`flex-[2] py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 cursor-pointer ${newGroupData.careerId ? 'bg-[#DEFF9A] text-black shadow-[0_0_40px_rgba(222,255,154,0.4)] hover:scale-[1.02]' : 'bg-white/5 text-white/10 opacity-50 cursor-not-allowed'}`}
                    >
                       <Plus size={18} />
                       Finalizar y Crear Grupo
                    </button>
                 </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
