/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  GraduationCap, 
  Mail, 
  Phone, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Trash2,
  X,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, Teacher, Career } from '../context/AppContext';
import { GlassCard } from './GlassCard';

export function TeachersMaster() {
  const { teachers, careers, updateTeacher } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveTeacher = (updated: Teacher) => {
    updateTeacher(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">Recursos Humanos</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            PLANTILLA <span className="text-[#DEFF9A]">DOCENTE</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Pilar 2: Asignación de competencias y límites de jornada laboral.</p>
        </div>
        <button className="px-8 py-4 rounded-2xl bg-[#DEFF9A] text-black flex items-center gap-4 hover:scale-105 transition-all font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.3)]">
          <Plus size={20} />
          Alta de Docente
        </button>
      </header>

      {/* FILTER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#DEFF9A] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar docente por nombre o especialidad..."
              className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-white focus:outline-none focus:border-[#DEFF9A]/30 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-4 flex gap-4">
           <GlassCard className="flex-1 !p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                 <Users size={20} />
              </div>
              <div>
                 <p className="text-[20px] font-black text-white leading-none">{teachers.length}</p>
                 <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Total Activos</p>
              </div>
           </GlassCard>
           <button className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-white/40 hover:text-[#DEFF9A] hover:border-[#DEFF9A]/30 transition-all">
              <Filter size={20} />
           </button>
        </div>
      </div>

      {/* TEACHERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id}>
            <GlassCard className="!p-0 group relative overflow-hidden hover:border-[#DEFF9A]/30 transition-all border-white/5">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[#DEFF9A] text-2xl font-black border border-white/10 shadow-inner group-hover:bg-[#DEFF9A] group-hover:text-black transition-all">
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="px-3 py-1 rounded-lg bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">
                  {teacher.status}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight italic leading-tight group-hover:text-[#DEFF9A] transition-colors">{teacher.name}</h3>
                <div className="flex flex-col gap-1 mt-2 text-white/40 text-[10px] font-bold uppercase tracking-widest font-mono">
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="opacity-40" /> {teacher.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="opacity-40" /> {teacher.phone}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6 font-mono">
                 <div className="space-y-1">
                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Capacidad</p>
                    <p className="text-white text-xs font-bold">{teacher.maxHours} <span className="text-[10px] opacity-40">hrs/sem</span></p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Materias</p>
                    <p className="text-[#DEFF9A] text-xs font-bold">{teacher.qualifiedSubjects.length} <span className="text-[10px] opacity-40 uppercase">Habilitadas</span></p>
                 </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedTeacher(teacher);
                  setIsModalOpen(true);
                }}
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-[#DEFF9A] hover:text-black hover:border-[#DEFF9A] transition-all flex items-center justify-center gap-3"
              >
                 Configurar Perfil <ChevronRight size={14} />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
          </GlassCard>
          </div>
        ))}
      </div>

      {/* MODAL / VENTANA EMERGENTE */}
      <AnimatePresence>
        {isModalOpen && selectedTeacher && (
          <TeacherConfigModal 
            teacher={selectedTeacher}
            careers={careers}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTeacher}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TeacherConfigModal({ teacher, careers, onClose, onSave }: { 
  teacher: Teacher, 
  careers: Career[], 
  onClose: () => void, 
  onSave: (t: Teacher) => void 
}) {
  const { groups } = useAppContext();
  const [editData, setEditData] = useState<Teacher>({ ...teacher });
  const [subSearch, setSubSearch] = useState('');

  // Cálculo de Carga Actual (Semaforo)
  const currentAssignedHours = useMemo(() => {
    let total = 0;
    groups.forEach(g => {
      const slots = Object.values(g.schedule || {}).filter((v: any) => v.teacherId === teacher.id);
      total += slots.length; // Cada slot es 1 hora pedagógica
    });
    return total;
  }, [groups, teacher.id]);

  const hourStatus = useMemo(() => {
    const diff = editData.maxHours - currentAssignedHours;
    if (diff === 0) return { label: 'AL LÍMITE', color: 'text-[#DEFF9A] bg-[#DEFF9A]/10 border-[#DEFF9A]/20' };
    if (diff < 0) return { label: 'SOBRECARGA', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
    return { label: 'DISPONIBLE', color: 'text-white/40 bg-white/5 border-white/10' };
  }, [editData.maxHours, currentAssignedHours]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] overflow-y-auto p-4 md:p-8 backdrop-blur-3xl bg-black/80 flex justify-center items-start md:items-center"
    >
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl min-h-[50vh] max-h-[90dvh] md:max-h-[85vh] overflow-hidden flex flex-col my-auto"
      >
        <div className="flex-1 flex flex-col neo-glass border-[#DEFF9A]/20 bg-[#0d1117] rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden min-h-0">
           {/* Modal Header */}
           <div className="shrink-0 p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4 md:gap-6">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-[#DEFF9A] flex items-center justify-center text-black shadow-[0_0_20px_#DEFF9A40]">
                    <GraduationCap size={24} className="md:hidden" />
                    <GraduationCap size={32} className="hidden md:block" />
                 </div>
                 <div>
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-tight">{editData.name}</h2>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                       <p className="text-[#DEFF9A] text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none">Configuración Académica</p>
                       <div className={`px-2 py-0.5 rounded text-[8px] font-black tracking-[0.2em] border ${hourStatus.color}`}>
                          {hourStatus.label}: {currentAssignedHours} / {editData.maxHours}h
                       </div>
                    </div>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 text-white/20 hover:text-white transition-all ml-4"
              >
                <X size={20} className="md:hidden" />
                <X size={24} className="hidden md:block" />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto min-h-0 p-6 md:p-8 space-y-8 md:space-y-10 custom-scrollbar overscroll-contain">
              {/* Sección 1: Carga Máxima */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-white/[0.02] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5">
                 <div className="flex-1 space-y-2">
                    <h4 className="text-white text-lg md:text-xl font-black uppercase italic tracking-tight">Capacidad Laboral</h4>
                    <p className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                       Define el techo de horas semanales permitidas para este docente según su contrato institucional.
                    </p>
                 </div>
                 <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-4 px-6 md:px-8 w-full md:w-auto justify-center">
                    <Clock className="text-[#DEFF9A]" size={20} />
                    <div className="text-center">
                       <input 
                         type="number" 
                         value={editData.maxHours}
                         onChange={(e) => setEditData({...editData, maxHours: parseInt(e.target.value) || 0})}
                         className="w-16 md:w-20 bg-transparent text-white text-2xl md:text-3xl font-black text-center focus:outline-none"
                         min="1"
                       />
                       <p className="text-[7px] md:text-[8px] font-black text-[#DEFF9A] uppercase tracking-widest">Horas Contrato</p>
                    </div>
                 </div>
              </div>

              {/* Sección 2: Competencias (Checkboxes) */}
              <div className="space-y-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Habilitación de Materias</h4>
                    <div className="relative w-full md:w-80">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                       <input 
                         type="text" 
                         placeholder="Filtrar materias por nombre o clave..."
                         className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-[10px] focus:outline-none focus:border-[#DEFF9A]/30"
                         value={subSearch}
                         onChange={(e) => setSubSearch(e.target.value)}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {careers.map((career) => {
                      const filteredSubs = career.subjects.filter(s => 
                        s.name.toLowerCase().includes(subSearch.toLowerCase()) || 
                        s.clave.toLowerCase().includes(subSearch.toLowerCase())
                      );
                      
                      if (subSearch && filteredSubs.length === 0) return null;

                      return (
                        <div key={career.id} className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-6 space-y-4">
                           <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                              <Zap size={14} className="text-[#DEFF9A]" />
                              <h5 className="text-white text-[12px] font-black uppercase tracking-widest">{career.name}</h5>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {filteredSubs.map((sub) => {
                                const isChecked = editData.qualifiedSubjects.includes(sub.id);
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      const next = isChecked 
                                        ? editData.qualifiedSubjects.filter(sid => sid !== sub.id)
                                        : [...editData.qualifiedSubjects, sub.id];
                                      setEditData({...editData, qualifiedSubjects: next});
                                    }}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left group/sub ${
                                      isChecked 
                                        ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/30 text-[#DEFF9A]' 
                                        : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:bg-white/[0.08]'
                                    }`}
                                  >
                                     <div className="flex-1 pr-2">
                                        <p className="text-[10px] font-bold leading-tight line-clamp-1">{sub.name}</p>
                                        <p className="text-[8px] font-black uppercase opacity-40 mt-1 font-mono tracking-tighter">{sub.clave} • {sub.weeklyHours}h</p>
                                     </div>
                                     <div className={`shrink-0 transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0 group-hover/sub:opacity-20'}`}>
                                        <CheckCircle2 size={16} />
                                     </div>
                                  </button>
                                );
                              })}
                           </div>
                        </div>
                      );
                    })}
                    {careers.length === 0 && (
                      <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-white/10 flex flex-col items-center gap-4">
                         <Zap size={48} className="opacity-20" />
                         <p className="text-[12px] font-black uppercase tracking-widest italic">No hay materias configuradas en el sistema</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           <div className="p-6 md:p-8 border-t border-white/5 bg-white/[0.02] flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 shrink-0">
              <button 
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 md:py-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all bg-white/5 sm:bg-transparent"
              >
                 Cancelar
              </button>
              <button 
                onClick={() => onSave(editData)}
                className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-xl bg-[#DEFF9A] text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_#DEFF9A40] hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                 <ShieldCheck size={16} />
                 Impactar Cambios
              </button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
