/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Download, 
  RotateCcw, 
  Sparkles, 
  AlertCircle,
  Clock,
  User,
  Users,
  CheckCircle2,
  Trash2,
  Lock,
  Plus,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, Group, GroupSubject, Teacher } from '../../context/AppContext';
import { GlassCard } from '../GlassCard';

// --- Constants ---
const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
const HOURS = [
  '07:00 AM - 07:50 AM',
  '07:50 AM - 08:40 AM',
  '08:40 AM - 09:30 AM',
  '09:30 AM - 10:00 AM', // RECESS
  '10:00 AM - 10:50 AM',
  '10:50 AM - 11:40 AM',
  '11:40 AM - 12:30 PM',
  '12:30 PM - 01:20 PM',
  '01:20 PM - 02:10 PM',
];
const RECESS_INDEX = 3;

export function SmartScheduler({ onClose, initialGroupId }: { onClose: () => void; initialGroupId?: string }) {
  const { groups, teachers, updateGroup } = useAppContext();
  const [activeGroupId, setActiveGroupId] = useState(initialGroupId || groups[0]?.id);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);
  const [assignmentStep, setAssignmentStep] = useState<'SUBJECT' | 'TEACHER'>('SUBJECT');
  const [tempSubject, setTempSubject] = useState<GroupSubject | null>(null);
  
  // States for Drag & Drop
  const [draggingSlot, setDraggingSlot] = useState<{ day: number; hour: number; assignment: any } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: number; hour: number } | null>(null);
  const [dragConflict, setDragConflict] = useState<string | null>(null);

  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId), [groups, activeGroupId]);

  // Conflict checking logic
  const checkConflict = (day: number, hour: number, teacherId: string, currentGroupId: string) => {
    // Check if teacher is busy in any OTHER group in this slot
    const conflictingGroup = groups.find(g => g.id !== currentGroupId && g.schedule[`${day}-${hour}`]?.teacherId === teacherId);
    if (conflictingGroup) {
      return `CONGLICTO: El ${teachers.find(t => t.id === teacherId)?.name} ya está asignado al grupo ${conflictingGroup.name} en este horario.`;
    }
    
    // Check if this slot already has a different subject for this group (if we are not dragging back to origin)
    if (activeGroup?.schedule[`${day}-${hour}`] && !(draggingSlot?.day === day && draggingSlot?.hour === hour)) {
      return `BLOQUEADO: El grupo ${activeGroup.name} ya tiene una materia asignada en este horario.`;
    }

    return null;
  };

  // Lógica Balance Docente: Contrato vs Horas Asignadas en todos los grupos
  const getTeacherBalance = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return 0;
    
    let consumed = 0;
    groups.forEach(g => {
      // Contamos los slots ocupados por este docente en la matriz de horario
      const slots = Object.values(g.schedule || {}).filter((val: any) => val?.teacherId === teacherId).length;
      consumed += slots;
    });
    
    return teacher.maxHours - consumed;
  };

  const handleAssign = (teacherId: string) => {
    if (!activeGroup || !selectedSlot || !tempSubject) return;

    // Last-minute conflict validation
    const conflict = checkConflict(selectedSlot.day, selectedSlot.hour, teacherId, activeGroup.id);
    if (conflict) {
      alert(conflict);
      return;
    }

    const newSchedule = { ...activeGroup.schedule };
    newSchedule[`${selectedSlot.day}-${selectedSlot.hour}`] = {
      subjectId: tempSubject.id,
      subjectName: tempSubject.name,
      teacherId: teacherId,
      teacherName: teachers.find(t => t.id === teacherId)?.name || 'Desconocido'
    };

    updateGroup({
      ...activeGroup,
      schedule: newSchedule
    });

    setSelectedSlot(null);
    setTempSubject(null);
    setAssignmentStep('SUBJECT');
  };

  const removeAssignment = (day: number, hour: number) => {
    if (!activeGroup) return;
    const newSchedule = { ...activeGroup.schedule };
    delete newSchedule[`${day}-${hour}`];
    updateGroup({ ...activeGroup, schedule: newSchedule });
  };

  const handleDragStart = (day: number, hour: number, assignment: any) => {
    setDraggingSlot({ day, hour, assignment });
  };

  const handleDragOver = (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    if (!draggingSlot || (dragOverSlot?.day === day && dragOverSlot?.hour === hour)) return;
    
    setDragOverSlot({ day, hour });
    const conflict = checkConflict(day, hour, draggingSlot.assignment.teacherId, activeGroupId!);
    setDragConflict(conflict);
  };

  const handleDrop = (e: React.DragEvent, targetDay: number, targetHour: number) => {
    e.preventDefault();
    if (!draggingSlot || !activeGroup) return;

    const conflict = checkConflict(targetDay, targetHour, draggingSlot.assignment.teacherId, activeGroup.id);
    
    if (!conflict) {
      const newSchedule = { ...activeGroup.schedule };
      // Delete old slot
      delete newSchedule[`${draggingSlot.day}-${draggingSlot.hour}`];
      // Set new slot
      newSchedule[`${targetDay}-${targetHour}`] = draggingSlot.assignment;
      
      updateGroup({
        ...activeGroup,
        schedule: newSchedule
      });
    }

    setDraggingSlot(null);
    setDragOverSlot(null);
    setDragConflict(null);
  };

  if (!activeGroup) return (
     <div className="fixed inset-0 z-[130] bg-[#061a1a] flex items-center justify-center p-8">
        <GlassCard className="!p-12 text-center space-y-6">
           <AlertCircle size={64} className="mx-auto text-orange-400" />
           <h2 className="text-2xl font-black uppercase italic">Sin Grupos Disponibles</h2>
           <button onClick={onClose} className="px-8 py-3 bg-[#DEFF9A] text-black font-black rounded-xl">Volver</button>
        </GlassCard>
     </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[130] bg-[#061a1a] flex flex-col h-screen overflow-hidden text-white"
    >
      {/* Header Corporativo */}
      <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-6">
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ChevronLeft size={24} />
           </button>
           <div className="h-8 w-px bg-white/10" />
           <div>
              <h1 className="text-xl font-black uppercase tracking-tighter italic">Mesa de Control / <span className="text-[#DEFF9A]">Scheduler</span></h1>
              <p className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Engine v2.0 • AI-DRIVEN</p>
           </div>
        </div>

        <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10">
           {groups.map(g => (
             <button 
               key={g.id}
               onClick={() => { setActiveGroupId(g.id); setSelectedSlot(null); }}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeGroupId === g.id ? 'bg-[#DEFF9A] text-black shadow-[0_0_20px_rgba(222,255,154,0.4)]' : 'text-white/40 hover:text-white'
               }`}
             >
                {g.name.split(' - ').pop()}
             </button>
           ))}
        </div>

        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 rounded-xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center gap-3">
              <Sparkles size={14} className="text-[#DEFF9A]" />
              <span className="text-[9px] font-black uppercase text-[#DEFF9A] tracking-widest">Optimización Activa</span>
           </div>
        </div>
      </header>

      {/* Main UI Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Aspect: Panel de Inventario Académico */}
        <aside className="w-[380px] border-r border-white/5 bg-black/40 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8 shadow-2xl relative z-10">
           <div className="space-y-1">
              <h3 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em]">Carga Pendiente</h3>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest leading-tight">{activeGroup.name}</p>
           </div>

           <div className="space-y-4">
              {activeGroup.subjects.map((sub) => {
                const assignedCount = Object.values(activeGroup.schedule || {}).filter((v: any) => v.subjectId === sub.id).length;
                const remaining = sub.weeklyHours - assignedCount;
                const progress = (assignedCount / sub.weeklyHours) * 100;
                
                return (
                  <div key={sub.id}>
                    <GlassCard 
                      className={`!p-5 border transition-all relative overflow-hidden group ${
                        remaining === 0 ? 'bg-white/[0.01] border-white/5 opacity-30 grayscale' : 'bg-white/5 border-white/10 hover:border-[#DEFF9A]/30'
                      }`}
                    >
                       <div className="flex justify-between items-start mb-3">
                          <h4 className="text-white font-black text-[11px] uppercase tracking-tight w-2/3 leading-tight">{sub.name}</h4>
                          <div className={`px-2 py-1 rounded-lg text-[9px] font-black ${remaining > 0 ? 'bg-[#DEFF9A] text-black' : 'bg-white/10 text-white/40'}`}>
                             {remaining}h
                          </div>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full ${remaining === 0 ? 'bg-white/40' : 'bg-[#DEFF9A]'}`}
                          />
                       </div>
                       <div className="mt-3 flex justify-between items-center">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">{assignedCount} de {sub.weeklyHours}h Asignadas</span>
                          {remaining === 0 && <CheckCircle2 size={12} className="text-[#DEFF9A]" />}
                       </div>
                    </GlassCard>
                  </div>
                );
              })}
           </div>

           <div className="mt-auto p-6 rounded-[2rem] bg-gradient-to-br from-[#DEFF9A]/10 to-transparent border border-[#DEFF9A]/20">
              <div className="flex items-center gap-4 mb-2">
                 <Target className="text-[#DEFF9A]" size={24} />
                 <h5 className="text-[10px] font-black uppercase text-white/80 tracking-widest">Validación Institucional</h5>
              </div>
              <p className="text-[#DEFF9A] text-[24px] font-black italic tracking-tighter">ESTADO OK</p>
              <p className="text-white/30 text-[8px] font-black uppercase mt-1 leading-relaxed">Matriz de colisión verificada en tiempo real por el motor de jerarquía académica.</p>
           </div>
        </aside>

        {/* Right Aspect: Grid Horario Interactivo */}
        <main className="flex-1 overflow-auto p-4 md:p-12 bg-[#061a1a] custom-scrollbar">
           <div className="max-w-[1500px] mx-auto space-y-8">
              {/* CONTROLES SUPERIORES DEL HORARIO INTELIGENTE (RESPONSIVO MÓVIL) */}
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-black/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                
                {/* SELECTOR CRÍTICO: CARGA DE GRUPOS AL GRID */}
                <div className="w-full md:w-auto flex flex-col gap-3">
                   <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#DEFF9A]" />
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Mesa de Trabajo Actual:</label>
                   </div>
                   <div className="relative group">
                      <select 
                        value={activeGroupId}
                        onChange={(e) => {
                          const grupoId = e.target.value;
                          setActiveGroupId(grupoId);
                          setSelectedSlot(null);
                        }}
                        className="w-full md:w-80 bg-white/5 border border-white/10 text-white font-black rounded-2xl px-6 py-4 text-xs appearance-none focus:outline-none focus:border-[#DEFF9A]/40 transition-all cursor-pointer pr-12 group-hover:bg-white/10 uppercase tracking-tight italic"
                      >
                        <option value="" className="bg-[#061a1a] text-white/40">⚠️ Selecciona un Grupo para activar Grid...</option>
                        {groups.map(g => (
                          <option key={g.id} value={g.id} className="bg-[#061a1a] font-bold">
                            {g.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                         <ChevronRight size={16} className="rotate-90" />
                      </div>
                   </div>
                </div>

                {/* CONTADOR DE CONTROL LOGÍSTICO */}
                <div className="flex items-center gap-6 bg-black/40 border border-white/10 px-8 py-5 rounded-[2rem]">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Horas Asignadas</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#DEFF9A] text-2xl font-black italic tracking-tighter">
                          {Object.values(activeGroup.schedule || {}).length}
                        </span>
                        <span className="text-white/20 text-[10px] font-bold">/ {activeGroup.subjects.reduce((acc, s) => acc + s.weeklyHours, 0)} hrs</span>
                      </div>
                   </div>
                   <div className="h-10 w-px bg-white/5" />
                   <div className="p-3 bg-[#DEFF9A]/10 rounded-xl">
                      <Clock size={20} className="text-[#DEFF9A]" />
                   </div>
                </div>
              </div>

              <div className="overflow-x-auto pb-8">
                 <div className="min-w-[1000px] rounded-[3rem] border border-white/5 bg-black/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative">
                    <table className="w-full border-collapse">
                    <thead>
                       <tr className="bg-white/[0.03]">
                          <th className="p-8 text-left border-r border-white/5 w-[180px]">
                             <span className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">Bloque / Hora</span>
                          </th>
                          {DAYS.map(day => (
                            <th key={day} className="p-8 text-center border-r border-white/5 last:border-0">
                               <span className="text-white text-[12px] font-black uppercase tracking-[0.3em]">{day}</span>
                            </th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {HOURS.map((hr, hIdx) => (
                         <tr key={hIdx} className="group/row">
                            <td className="p-8 border-r border-white/5 bg-black/20">
                               <div className="flex flex-col">
                                  <span className="text-white/10 text-[9px] font-black uppercase mb-1">Block 0{hIdx + 1}</span>
                                  <span className="text-white font-black text-xs italic tracking-tighter">{hr.split(' - ')[0]}</span>
                               </div>
                            </td>

                            {hIdx === RECESS_INDEX ? (
                              <td colSpan={5} className="p-2 border-r border-white/5 bg-black/50">
                                 <div className="h-20 flex items-center justify-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-shimmer translate-x-[-100%] animate-shimmer" />
                                    <span className="text-white/10 text-[11px] font-black uppercase tracking-[1.5em] flex items-center gap-4 italic z-10">
                                       RECESO INSTITUCIONAL
                                    </span>
                                 </div>
                              </td>
                            ) : (
                              DAYS.map((_, dIdx) => {
                                const assignment = activeGroup.schedule[`${dIdx}-${hIdx}`];
                                const isDragOver = dragOverSlot?.day === dIdx && dragOverSlot?.hour === hIdx;
                                
                                return (
                                  <td 
                                    key={`${hIdx}-${dIdx}`} 
                                    className="p-3 border-r border-white/5 last:border-0 relative"
                                    onDragOver={(e) => handleDragOver(e, dIdx, hIdx)}
                                    onDragLeave={() => setDragOverSlot(null)}
                                    onDrop={(e) => handleDrop(e, dIdx, hIdx)}
                                    onClick={() => !assignment && setSelectedSlot({ day: dIdx, hour: hIdx })}
                                  >
                                     <div 
                                       draggable={!!assignment}
                                       onDragStart={() => assignment && handleDragStart(dIdx, hIdx, assignment)}
                                       className={`min-h-[100px] h-full w-full rounded-[2rem] transition-all relative group/slot cursor-pointer flex flex-col justify-center items-center gap-2 ${
                                         assignment 
                                           ? 'bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 p-6 shadow-xl' 
                                           : 'border border-dashed border-white/5 hover:border-[#DEFF9A]/40 hover:bg-[#DEFF9A]/5'
                                       } ${
                                         isDragOver 
                                           ? dragConflict 
                                             ? 'bg-red-500/20 border-red-500/50 scale-95' 
                                             : 'bg-[#DEFF9A]/20 border-[#DEFF9A] scale-105 shadow-[0_0_40px_rgba(222,255,154,0.3)]'
                                           : ''
                                       }`}
                                     >
                                        <AnimatePresence>
                                          {isDragOver && dragConflict && (
                                            <motion.div 
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: 10 }}
                                              className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 bg-red-950 border border-red-500 p-4 rounded-xl shadow-2xl z-[50]"
                                            >
                                               <div className="flex items-start gap-2">
                                                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-1" />
                                                  <p className="text-[10px] font-black text-red-200 uppercase tracking-tight leading-tight">{dragConflict}</p>
                                               </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>

                                        {assignment ? (
                                          <div className="w-full text-center space-y-4">
                                             <div className="flex justify-center relative">
                                                <h4 className="text-white font-black text-[10px] uppercase leading-tight tracking-tight px-4 line-clamp-2">{assignment.subjectName}</h4>
                                                <button 
                                                  onClick={(e) => { e.stopPropagation(); removeAssignment(dIdx, hIdx); }}
                                                  className="absolute -top-1 -right-1 opacity-0 group-hover/slot:opacity-100 p-2 text-white/20 hover:text-red-500 transition-all"
                                                >
                                                   <Trash2 size={12} />
                                                </button>
                                             </div>
                                             <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 rounded-lg bg-[#DEFF9A] text-black flex items-center justify-center text-[9px] font-black">
                                                   {assignment.teacherName.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <span className="text-[#DEFF9A] text-[9px] font-bold uppercase truncate max-w-[80px]">{assignment.teacherName}</span>
                                             </div>
                                          </div>
                                        ) : (
                                          <div className="opacity-0 group-hover/slot:opacity-100 flex flex-col items-center gap-2 transition-all">
                                             <div className="w-8 h-8 rounded-full bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                                                <Plus size={16} />
                                             </div>
                                             <span className="text-[8px] font-black uppercase text-[#DEFF9A] tracking-widest italic">Asignar</span>
                                          </div>
                                        )}
                                     </div>
                                  </td>
                                );
                              })
                            )}
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
           </div>
        </main>
      </div>

      {/* Modal de Doble Filtro Inteligente */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-[#061a1a]/80 backdrop-blur-2xl"
            onClick={() => { setSelectedSlot(null); setAssignmentStep('SUBJECT'); setTempSubject(null); }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="w-full max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
               <GlassCard className="!p-10 space-y-10 border-[#DEFF9A]/20 min-h-[650px] flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-4 mb-3">
                           <span className="px-3 py-1 rounded-full bg-[#DEFF9A]/10 text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">{DAYS[selectedSlot.day]} • Bloque {selectedSlot.hour + 1}</span>
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                           {assignmentStep === 'SUBJECT' ? 'Paso 1: ' : 'Paso 2: '}
                           <span className="text-[#DEFF9A]">{assignmentStep === 'SUBJECT' ? 'ASIGNATURA' : 'DOCENTE'}</span>
                        </h2>
                     </div>
                     <button onClick={() => { setSelectedSlot(null); setAssignmentStep('SUBJECT'); setTempSubject(null); }} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40">
                        <Trash2 size={24} />
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                     {assignmentStep === 'SUBJECT' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {activeGroup.subjects.map(sub => {
                              const assignedCount = Object.values(activeGroup.schedule || {}).filter((v: any) => v.subjectId === sub.id).length;
                              const remaining = sub.weeklyHours - assignedCount;
                              if (remaining <= 0) return null;

                              return (
                                <button 
                                  key={sub.id}
                                  onClick={() => { setTempSubject(sub); setAssignmentStep('TEACHER'); }}
                                  className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#DEFF9A]/50 text-left transition-all group relative overflow-hidden"
                                >
                                   <div className="relative z-10 flex justify-between items-center">
                                      <h3 className="text-white font-black text-lg uppercase tracking-tight group-hover:text-[#DEFF9A] transition-colors w-2/3 leading-tight">{sub.name}</h3>
                                      <div className="text-right">
                                         <p className="text-[#DEFF9A] font-black text-2xl tracking-tighter italic">{remaining}h</p>
                                         <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Disponibles</p>
                                      </div>
                                   </div>
                                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#DEFF9A]/5 blur-3xl rounded-full group-hover:bg-[#DEFF9A]/10 transition-all" />
                                </button>
                              );
                           })}
                        </div>
                     ) : (
                        <div className="space-y-8">
                           <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#DEFF9A]/5 p-6 rounded-[2rem] border border-[#DEFF9A]/20">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-[#DEFF9A] flex items-center justify-center text-black shadow-[0_0_30px_rgba(222,255,154,0.3)]">
                                 <Target size={32} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-[#DEFF9A] uppercase tracking-[0.4em] mb-1">Filtro Competencial Ejecutado</p>
                                 <p className="text-white/80 text-lg font-black uppercase italic tracking-tight leading-none">"{tempSubject?.name}"</p>
                              </div>
                              <button 
                                onClick={() => { setAssignmentStep('SUBJECT'); setTempSubject(null); }}
                                className="md:ml-auto px-6 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase text-white/40 hover:text-white transition-all border border-white/5"
                              >
                                Cambiar Materia
                              </button>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {teachers
                                .filter(t => t.qualifiedSubjects.includes(tempSubject?.id || ''))
                                .map(teacher => {
                                   const balance = getTeacherBalance(teacher.id);
                                   const isBusyInThisSlot = groups.some(g => {
                                      const slot = g.schedule[`${selectedSlot.day}-${selectedSlot.hour}`];
                                      return slot?.teacherId === teacher.id;
                                   });
                                   
                                   return (
                                     <button 
                                       key={teacher.id}
                                       disabled={balance <= 0 || isBusyInThisSlot}
                                       onClick={() => handleAssign(teacher.id)}
                                       className={`p-8 rounded-[2.5rem] border text-left transition-all relative overflow-hidden group ${
                                          isBusyInThisSlot ? 'opacity-20 grayscale border-red-500/40 bg-red-500/5' : 
                                          balance <= 0 ? 'opacity-20 border-white/5' : 'bg-white/5 border-white/10 hover:border-[#DEFF9A]/50 hover:bg-white/[0.08]'
                                       }`}
                                     >
                                        <div className="relative z-10">
                                           <div className="flex justify-between items-center mb-4">
                                              <h3 className="text-white font-black text-xl tracking-tight uppercase group-hover:text-[#DEFF9A] transition-colors">{teacher.name}</h3>
                                              <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${balance > 0 ? 'bg-[#DEFF9A] text-black shadow-[0_0_15px_rgba(222,255,154,0.3)]' : 'bg-red-500 text-white'}`}>
                                                 {balance}h Disponibles
                                              </div>
                                           </div>
                                           <div className="flex items-center gap-6 text-white/30 text-[9px] font-black uppercase tracking-widest">
                                              <div className="flex items-center gap-2 line-clamp-1">
                                                <Clock size={12} className="shrink-0" /> Contrato: {teacher.maxHours}h
                                              </div>
                                              {isBusyInThisSlot && (
                                                <div className="flex items-center gap-2 text-red-500">
                                                   <AlertCircle size={12} className="shrink-0" /> Ocupado en otro grupo
                                                </div>
                                              )}
                                           </div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#DEFF9A]/5 blur-3xl rounded-full group-hover:bg-[#DEFF9A]/10 transition-all" />
                                     </button>
                                   );
                                })}
                           </div>
                           
                           {teachers.filter(t => t.qualifiedSubjects.includes(tempSubject?.id || '')).length === 0 && (
                             <div className="py-24 text-center space-y-6 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                                <AlertCircle size={64} className="mx-auto text-white/10 animate-pulse" />
                                <div className="space-y-2">
                                   <p className="text-xl font-black uppercase italic text-white/30">Sin Docentes Calificados</p>
                                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 max-w-md mx-auto">Asegúrate de editar el perfil de los maestros y marcar "{tempSubject?.name}" como competencia habilitada.</p>
                                </div>
                             </div>
                           )}
                        </div>
                     )}
                  </div>

                  <div className="shrink-0 pt-6 border-t border-white/5 flex items-center justify-between opacity-40">
                     <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#DEFF9A] animate-shimmer" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Algoritmo de Colisión Vigilante</span>
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-widest">TecLingo AI Scheduler Engine v2.0</span>
                  </div>
               </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
