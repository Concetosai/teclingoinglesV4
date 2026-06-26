/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  User, 
  Users, 
  MapPin, 
  Clock, 
  BookOpen, 
  AlertTriangle, 
  Check, 
  X,
  FileSpreadsheet,
  PlusCircle,
  FolderOpen,
  Settings,
  HelpCircle,
  Coffee,
  Undo,
  Share2,
  Printer,
  Mail,
  MessageSquare,
  Bell,
  Send,
  Download,
  Lock,
  Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, Teacher, Group } from '../context/AppContext';
import { GlassCard } from './GlassCard';

export interface TimeBlock {
  id: number;
  label: string;
  esReceso: boolean;
}

export interface ScheduleBlock {
  id: string;
  teacherId: string;
  groupId: string;
  subjectName: string;
  day: string; // 'LUNES' | 'MARTES' | 'MIÉRCOLES' | 'JUEVES' | 'VIERNES' | 'SÁBADO'
  bloqueId: number; // links to TimeBlock id
  room: string;
  esOficial?: boolean;
}

const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

export function TecnunScheduler() {
  const { teachers, groups } = useAppContext();

  // 1. Time blocks state with persistence - Configurable by director
  const [bloquesBase, setBloquesBase] = useState<TimeBlock[]>(() => {
    const saved = localStorage.getItem('tecnun_time_blocks_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 1, label: "07:00 - 07:50", esReceso: false },
      { id: 2, label: "07:50 - 08:40", esReceso: false },
      { id: 3, label: "08:40 - 09:30", esReceso: false },
      { id: 4, label: "09:30 - 10:00", esReceso: true }, // Receso 30 min
      { id: 5, label: "10:00 - 10:50", esReceso: false },
      { id: 6, label: "10:50 - 11:40", esReceso: false },
      { id: 7, label: "11:40 - 12:30", esReceso: false },
      { id: 8, label: "12:30 - 13:20", esReceso: false },
      { id: 9, label: "13:20 - 14:10", esReceso: false },
    ];
  });

  // 2. Schedule blocks state
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(() => {
    const saved = localStorage.getItem('tecnun_schedules_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default initial blocks
    return [
      {
        id: 'tb-1',
        teacherId: 'USR-901-B33', // Armando Paredes
        groupId: 'GRP-001',
        subjectName: 'TecLingo AI (Inglés I)',
        day: 'LUNES',
        bloqueId: 2,
        room: 'Aula A-212',
        esOficial: true
      },
      {
        id: 'tb-2',
        teacherId: 'USR-901-B33',
        groupId: 'GRP-001',
        subjectName: 'TecLingo AI (Inglés I)',
        day: 'MIÉRCOLES',
        bloqueId: 3,
        room: 'Aula A-212'
      },
      {
        id: 'tb-3',
        teacherId: 'USR-901-B33',
        groupId: 'GRP-001',
        subjectName: 'Conversational Workshop',
        day: 'SÁBADO',
        bloqueId: 5,
        room: 'Lab B-10'
      }
    ];
  });

  // Persists states on change
  useEffect(() => {
    localStorage.setItem('tecnun_time_blocks_v3', JSON.stringify(bloquesBase));
  }, [bloquesBase]);

  useEffect(() => {
    localStorage.setItem('tecnun_schedules_v2', JSON.stringify(blocks));
  }, [blocks]);

  // Selected filters
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('ALL');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('ALL');

  // Form states for scheduling slots
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null);
  const [formTeacherId, setFormTeacherId] = useState('');
  const [formGroupId, setFormGroupId] = useState('');
  const [formSubjectName, setFormSubjectName] = useState('');
  const [formDay, setFormDay] = useState('LUNES');
  const [formBloqueId, setFormBloqueId] = useState<number>(1);
  const [formRoom, setFormRoom] = useState('Aula A-101');
  const [formEsOficial, setFormEsOficial] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Time-block configuration manager states
  const [showConfigBlocks, setShowConfigBlocks] = useState(false);
  const [nuevoInicio, setNuevoInicio] = useState('14:10');
  const [nuevoFin, setNuevoFin] = useState('15:00');
  const [nuevoEsReceso, setNuevoEsReceso] = useState(false);

  // Auto defaults for form subject selection when group is changed
  useEffect(() => {
    if (formGroupId) {
      const selectedG = groups.find(g => g.id === formGroupId);
      if (selectedG) {
        if (selectedG.subjects && selectedG.subjects.length > 0) {
          setFormSubjectName(selectedG.subjects[0].name);
        } else {
          setFormSubjectName('Materia TecLingo');
        }
        if (selectedG.teacherId) {
          setFormTeacherId(selectedG.teacherId);
        }
      }
    }
  }, [formGroupId, groups]);

  // Open modal triggers
  const handleOpenAssign = (day: string, bloqueId: number) => {
    setEditingBlock(null);
    setFormTeacherId(selectedTeacherId !== 'ALL' ? selectedTeacherId : (teachers[0]?.id || ''));
    setFormGroupId(selectedGroupId !== 'ALL' ? selectedGroupId : (groups[0]?.id || ''));
    setFormDay(day);
    setFormBloqueId(bloqueId);
    setFormRoom('Aula A-101');
    setFormEsOficial(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (block: ScheduleBlock) => {
    setEditingBlock(block);
    setFormTeacherId(block.teacherId);
    setFormGroupId(block.groupId);
    setFormSubjectName(block.subjectName);
    setFormDay(block.day);
    setFormBloqueId(block.bloqueId);
    setFormRoom(block.room);
    setFormEsOficial(block.esOficial || false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const checkConflict = (
    idToIgnore: string | null,
    teacherId: string,
    groupId: string,
    day: string,
    bloqueId: number
  ): string | null => {
    // Check conflicts inside active blocks
    const otherBlocks = blocks.filter(b => b.id !== idToIgnore);

    for (const b of otherBlocks) {
      if (b.day === day && b.bloqueId === bloqueId) {
        if (b.teacherId === teacherId) {
          const teacherName = teachers.find(t => t.id === teacherId)?.name || 'Docente';
          return `Conflicto de Docente: El docente ${teacherName} ya está agendado en este exacto bloque del ${day}.`;
        }
        if (b.groupId === groupId) {
          const groupName = groups.find(g => g.id === groupId)?.name || 'Grupo';
          return `Conflicto de Grupo: El grupo ${groupName} ya tiene una materia asignada en este bloque del ${day}.`;
        }
      }
    }
    return null;
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTeacherId || !formGroupId || !formSubjectName) {
      setFormError('Por favor introduce todos los campos requeridos.');
      return;
    }

    const collision = checkConflict(
      editingBlock ? editingBlock.id : null,
      formTeacherId,
      formGroupId,
      formDay,
      formBloqueId
    );

    if (collision) {
      setFormError(collision);
      return;
    }

    if (editingBlock) {
      setBlocks(prev => prev.map(b => b.id === editingBlock.id ? {
        ...b,
        teacherId: formTeacherId,
        groupId: formGroupId,
        subjectName: formSubjectName,
        day: formDay,
        bloqueId: formBloqueId,
        room: formRoom,
        esOficial: formEsOficial
      } : b));
    } else {
      const newB: ScheduleBlock = {
        id: `class-${Date.now()}`,
        teacherId: formTeacherId,
        groupId: formGroupId,
        subjectName: formSubjectName,
        day: formDay,
        bloqueId: formBloqueId,
        room: formRoom,
        esOficial: formEsOficial
      };
      setBlocks(prev => [...prev, newB]);
    }

    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const handleDeleteClass = (id: string) => {
    const targetBlock = blocks.find(b => b.id === id);
    if (targetBlock && targetBlock.esOficial) {
      alert('⚠️ No se puede eliminar este horario porque está marcado como Oficial (Protegido). Desmarca el checkbox de "Horario Oficial" en el editor para remover el blindaje.');
      return;
    }
    
    if (confirm('¿Seguro que deseas remover esta sesión del horario?')) {
      setBlocks(prev => prev.filter(b => b.id !== id));
      if (editingBlock && editingBlock.id === id) {
        setIsModalOpen(false);
        setEditingBlock(null);
      }
    }
  };

  // Filtered blocks helper
  const filteredBlocks = blocks.filter(b => {
    const matchesTeacher = selectedTeacherId === 'ALL' || b.teacherId === selectedTeacherId;
    const matchesGroup = selectedGroupId === 'ALL' || b.groupId === selectedGroupId;
    return matchesTeacher && matchesGroup;
  });

  // Time blocks configuration utility methods
  const handleAddBlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nuevoInicio || !nuevoFin) return;

    const label = `${nuevoInicio} - ${nuevoFin}`;
    const nextId = bloquesBase.length > 0 ? Math.max(...bloquesBase.map(b => b.id)) + 1 : 1;
    const newBlock: TimeBlock = {
      id: nextId,
      label: label,
      esReceso: nuevoEsReceso
    };
    setBloquesBase(prev => [...prev, newBlock]);
    
    // Set next start time to this end time
    setNuevoInicio(nuevoFin);
    // Suggest standard ending for the next block
    try {
      const parts = nuevoFin.split(':');
      if (parts.length === 2) {
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const duration = nuevoEsReceso ? 30 : 50;
        const totalMinutes = h * 60 + m + duration;
        const newH = Math.floor(totalMinutes / 60) % 24;
        const newM = totalMinutes % 60;
        setNuevoFin(`${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`);
      }
    } catch (err) {
      console.error(err);
    }
    setNuevoEsReceso(false);
  };

  const handleRemoveBlock = (id: number) => {
    if (confirm('Al remover este bloque de tiempo se eliminarán todas las clases agendadas en él. ¿Deseas continuar?')) {
      const filtered = bloquesBase.filter(b => b.id !== id);
      // Re-index remaining blocks sequencially
      const reindexed = filtered.map((b, idx) => ({
        ...b,
        id: idx + 1
      }));
      setBloquesBase(reindexed);

      // Re-map existing schedule blocks
      const idMapping: { [key: number]: number } = {};
      filtered.forEach((b, idx) => {
        idMapping[b.id] = idx + 1;
      });

      setBlocks(prev => prev
        .filter(b => b.bloqueId !== id)
        .map(b => ({
          ...b,
          bloqueId: idMapping[b.bloqueId] || b.bloqueId
        }))
      );
    }
  };

  const handleUpdateBlockLabel = (id: number, val: string) => {
    setBloquesBase(prev => prev.map(b => b.id === id ? { ...b, label: val } : b));
  };

  const handleToggleBlockReceso = (id: number) => {
    setBloquesBase(prev => prev.map(b => b.id === id ? { ...b, esReceso: !b.esReceso } : b));
  };

  const handleResetDefaultBlocks = () => {
    if (confirm('¿Restablecer los 9 bloques estándar de Tecnun (07:00 AM - 02:10 PM)?')) {
      const defaultBlocks = [
        { id: 1, label: "07:00 - 07:50", esReceso: false },
        { id: 2, label: "07:50 - 08:40", esReceso: false },
        { id: 3, label: "08:40 - 09:30", esReceso: false },
        { id: 4, label: "09:30 - 10:00", esReceso: true }, // Receso oficial 30 min
        { id: 5, label: "10:00 - 10:50", esReceso: false },
        { id: 6, label: "10:50 - 11:40", esReceso: false },
        { id: 7, label: "11:40 - 12:30", esReceso: false },
        { id: 8, label: "12:30 - 13:20", esReceso: false },
        { id: 9, label: "13:20 - 14:10", esReceso: false },
      ];
      setBloquesBase(defaultBlocks);
    }
  };

  // 3. Keep a list of sent internal notifications in LocalStorage
  const [internalNotifications, setInternalNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('tecnun_sent_notifications_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        notificacion_id: "notif_048392",
        emisor: "DIRECCION_ACADEMICA",
        receptor_usuario_id: "USR-901-B33", // Armando Paredes
        tipo: "UPDATE_HORARIO",
        mensaje_corto: "Su horario para el ciclo actual ha sido modificado y publicado.",
        meta_data: {
          origen: "Tecnun Planning Studio",
          fecha_modificacion: "2026-05-31T21:30:00Z",
          bloques_totales: 9
        },
        leido: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('tecnun_sent_notifications_v3', JSON.stringify(internalNotifications));
  }, [internalNotifications]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsAppOpt = (docenteId: string) => {
    const teacher = teachers.find(t => t.id === docenteId);
    const docenteName = teacher ? teacher.name : "Excelente Docente";
    
    // Filter active classes for this teacher
    const docenteClasses = blocks.filter(b => b.teacherId === docenteId);
    
    const telefono = ""; // Opcional
    let mensaje = `*TECNUN PLANNING STUDIO*\n\n`;
    mensaje += `Estimado(a) *Prof. ${docenteName}*, compartimos su horario oficial generado:\n\n`;
    
    if (docenteClasses.length === 0) {
      mensaje += `No tiene clases agendadas en este momento.\n`;
    } else {
      // Group by day to make a beautiful display
      const daysOrder = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
      daysOrder.forEach(dia => {
        const slotsInDay = docenteClasses.filter(c => c.day === dia);
        if (slotsInDay.length > 0) {
          mensaje += `📅 *${dia}*\n`;
          slotsInDay.forEach(b => {
            const tb = bloquesBase.find(t => t.id === b.bloqueId);
            const label = tb ? tb.label : `Módulo #${b.bloqueId}`;
            mensaje += `  • Mod #${b.bloqueId} (${label}): *${b.subjectName}* [${b.room}]\n`;
          });
          mensaje += `\n`;
        }
      });
    }
    
    mensaje += `_Atentamente, Dirección Académica_`;
    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const handleShareEmailOpt = (docenteId: string) => {
    const teacher = teachers.find(t => t.id === docenteId);
    const docenteName = teacher ? teacher.name : "Docente";
    const docenteEmail = teacher ? teacher.email : "coordinacion@tecnun.edu.mx";
    
    // Filter active classes for this teacher
    const docenteClasses = blocks.filter(b => b.teacherId === docenteId);

    const subject = encodeURIComponent("Horario Escolar Oficial - Tecnun Planning Studio");
    let body = `Estimado(a) Prof. ${docenteName},\n\nPor medio de la presente se le notifica su horario oficial:\n\n`;
    
    if (docenteClasses.length === 0) {
      body += `No tiene módulos o clases asignadas para este periodo escolar actualmente.\n`;
    } else {
      const daysOrder = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
      daysOrder.forEach(dia => {
        const slotsInDay = docenteClasses.filter(c => c.day === dia);
        if (slotsInDay.length > 0) {
          body += `📅 ${dia}:\n`;
          slotsInDay.forEach(b => {
            const tb = bloquesBase.find(t => t.id === b.bloqueId);
            const label = tb ? tb.label : `Módulo ${b.bloqueId}`;
            body += `  - Módulo #${b.bloqueId} (${label}): ${b.subjectName} - Aula ${b.room}\n`;
          });
          body += `\n`;
        }
      });
    }
    
    body += `\nSaludos cordiales,\nDirección Académica Tecnun.`;
    window.location.href = `mailto:${docenteEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const handleNotifyInternalOpt = (docenteId: string) => {
    const teacher = teachers.find(t => t.id === docenteId);
    const docenteName = teacher ? teacher.name : "Docente";

    const payload = {
      notificacion_id: `notif_${Math.floor(100000 + Math.random() * 900000)}`,
      emisor: "DIRECCION_ACADEMICA",
      receptor_usuario_id: docenteId,
      tipo: "UPDATE_HORARIO",
      mensaje_corto: `Su horario para el ciclo actual ha sido modificado y publicado.`,
      meta_data: {
        origen: "Tecnun Planning Studio",
        fecha_modificacion: new Date().toISOString(),
        bloques_totales: bloquesBase.length
      },
      leido: false
    };

    setInternalNotifications(prev => [payload, ...prev]);
    alert(`⚡ Notificación emitida con éxito al Prof. ${docenteName}!\nID del Payload de integración Técnica: ${payload.notificacion_id}`);
  };

  const handleNotifyAllOpt = () => {
    if (confirm('¿Emitir notificación masiva a todos los docentes con asignaciones vigentes?')) {
      // Find all unique teacher ids with active classes
      const activeTeacherIds = Array.from(new Set(blocks.map(b => b.teacherId)));
      
      if (activeTeacherIds.length === 0) {
        alert('No hay clases programadas actualmente para ningún docente.');
        return;
      }

      activeTeacherIds.forEach(tId => {
        const payload = {
          notificacion_id: `notif_${Math.floor(100000 + Math.random() * 900000)}`,
          emisor: "DIRECCION_ACADEMICA",
          receptor_usuario_id: tId,
          tipo: "UPDATE_HORARIO",
          mensaje_corto: `Su horario para el ciclo actual ha sido modificado y publicado de manera oficial.`,
          meta_data: {
            origen: "Tecnun Planning Studio",
            fecha_modificacion: new Date().toISOString(),
            bloques_totales: bloquesBase.length
          },
          leido: false
        };
        setInternalNotifications(prev => [payload, ...prev]);
      });
      
      alert(`🎉 Sincronización Automatizada Completada: Se emitieron alertas internas al personal docente en tiempo real.`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-1">Tecnun Planning Studio (Parrilla Horaria)</h2>
          <h1 className="text-2xl sm:text-4xl font-black text-white bevel-text uppercase tracking-tight">
            Estructura de Horarios <span className="text-[#DEFF9A]">Tecnun</span>
          </h1>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider mt-1">
            Asigna docentes y grupos generados a la Parrilla de Lunes a Sábado con Modificación Dinámica de Bloqueos de Tiempo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            onClick={() => setShowConfigBlocks(!showConfigBlocks)}
            className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              showConfigBlocks 
                ? 'bg-amber-400/25 border-amber-400 text-amber-300' 
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings size={14} /> {showConfigBlocks ? 'Cerrar Bloques' : 'Ajustar Bloques'}
          </button>

          <button 
            type="button"
            onClick={() => {
              const hasOficial = blocks.some(b => b.esOficial);
              if (hasOficial) {
                if (confirm('¿Deseas vaciar las sesiones activas en borrador? Se conservarán los horarios oficiales protegidos.')) {
                  setBlocks(prev => prev.filter(b => b.esOficial));
                  alert('🧹 Se eliminaron los borradores. Los horarios oficiales protegidos se conservaron intactos.');
                }
              } else {
                if (confirm('¿Deseas vaciar todas las sesiones activas?')) {
                  setBlocks([]);
                }
              }
            }}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-[#FF5D5D] hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center gap-2"
          >
            <Trash2 size={13} /> Limpiar Horario
          </button>
        </div>
      </header>

      {/* Accordion Setup of Time Blocks configuration */}
      <AnimatePresence>
        {showConfigBlocks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-6 border-amber-500/25 bg-amber-950/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
                    ⚒️ Gestión de Bloques de Tiempo Oficiales
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-0.5">
                    El director puede agregar, editar su rango de horas o remover módulos de clases semanales (estudiantes, docentes y grupos se sincronizan).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDefaultBlocks}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all"
                >
                  <Undo size={11} /> Reiniciar Estándar
                </button>
              </div>

              {/* Grid with active blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[250px] overflow-y-auto custom-scrollbar p-1">
                {bloquesBase.map((bloque) => (
                  <div 
                    key={bloque.id} 
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-3 transition-colors ${
                      bloque.esReceso 
                        ? 'bg-amber-900/10 border-amber-500/20' 
                        : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black text-white/30 truncate uppercase">Módulo #{bloque.id}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(bloque.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                        title="Eliminar este bloque de tiempo"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={bloque.label}
                      onChange={(e) => handleUpdateBlockLabel(bloque.id, e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono tracking-tight outline-none focus:border-amber-400"
                    />

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={bloque.esReceso}
                        onChange={() => handleToggleBlockReceso(bloque.id)}
                        className="rounded border-white/10 text-amber-500 focus:ring-0 bg-transparent"
                      />
                      <span className="text-[9px] font-black uppercase text-white/50 tracking-widest flex items-center gap-1">
                        <Coffee size={10} className={bloque.esReceso ? 'text-amber-400' : 'text-white/30'} /> ¿Es Receso?
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              {/* Form to add a brand new custom block */}
              <form 
                onSubmit={handleAddBlock}
                className="pt-4 border-t border-white/5 flex flex-col md:flex-row items-end md:items-center gap-4 w-full"
              >
                <div className="w-full md:w-auto flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block">Hora Inicio</span>
                    <input
                      type="text"
                      placeholder="07:00"
                      value={nuevoInicio}
                      onChange={(e) => setNuevoInicio(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono tracking-wider outline-none focus:border-amber-400 text-center"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block">Hora Fin</span>
                    <input
                      type="text"
                      placeholder="07:50"
                      value={nuevoFin}
                      onChange={(e) => setNuevoFin(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono tracking-wider outline-none focus:border-amber-400 text-center"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 py-2 select-none shrink-0 justify-start">
                  <input
                    id="newReceso"
                    type="checkbox"
                    checked={nuevoEsReceso}
                    onChange={(e) => setNuevoEsReceso(e.target.checked)}
                    className="rounded border-white/10 text-amber-500 focus:ring-0 bg-transparent cursor-pointer"
                  />
                  <label htmlFor="newReceso" className="text-[10px] font-black uppercase text-amber-300 tracking-widest cursor-pointer select-none">
                    Marcar como Receso Oficial
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shrink-0 md:ml-auto"
                >
                  <Plus size={14} className="inline mr-1" /> Registrar Nuevo Bloque
                </button>
              </form>

            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom dropdown selectors dynamically sourced from teachers & groups catalogs */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Filter 1: Docentes oficiales */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#DEFF9A] uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> 1. Filtrar Docente
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs uppercase font-extrabold text-white tracking-wider outline-none focus:border-[#DEFF9A]/50 transition-all"
            >
              <option value="ALL">🔍 TODOS LOS DOCENTES</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>👨‍🏫 {t.name} ({t.email})</option>
              ))}
            </select>
          </div>

          {/* Filter 2: Grupos generados */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#DEFF9A] uppercase tracking-widest flex items-center gap-2">
              <Users size={12} /> 2. Filtrar Grupo
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs uppercase font-extrabold text-white tracking-wider outline-none focus:border-[#DEFF9A]/50 transition-all"
            >
              <option value="ALL">🔍 TODOS LOS GRUPOS</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>👥 {g.name} ({g.time || 'Grado ' + g.level})</option>
              ))}
            </select>
          </div>

          {/* Load counters summary */}
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl md:col-span-2 lg:col-span-1">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Carga Filtro Actual</span>
              <p className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                {filteredBlocks.length} Clases <span className="text-[#DEFF9A]">Programadas</span>
              </p>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-black text-[#DEFF9A] uppercase tracking-wider">
                6 DÍAS SEGUIMIENTO
              </span>
              <span className="text-[8px] font-bold text-white/40 uppercase">
                Lunes a Sábado
              </span>
            </div>
          </div>

        </div>
      </GlassCard>

      {/* 🔒 SISTEMA DE HORARIOS OFICIALES Y CONTROL DE BLINDAJE */}
      <GlassCard className="p-6 border-amber-500/20 bg-amber-500/[0.02]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Estadísticas de Oficialidad */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.25em] flex items-center gap-1.5">
                <Lock size={12} className="text-amber-400 animate-pulse" /> SECCIÓN HORARIOS OFICIALES
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Métricas Consolidadas
              </h3>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider leading-relaxed">
                Visualización en tiempo real para asegurar el conteo oficial y evitar confusiones con borradores o propuestas de planes de clase.
              </p>
            </div>

            {/* Metricas de conteo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-amber-500/[0.05] border border-amber-500/20 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-amber-300 uppercase tracking-wider">OFICIALES</span>
                  <Lock size={10} className="text-amber-400" />
                </div>
                <p className="text-2xl font-black text-amber-300 font-mono">
                  {blocks.filter(b => b.esOficial).length}
                </p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">MÓDULOS BLINDADOS</p>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-wider">BORRADOR</span>
                  <Unlock size={10} className="text-white/40" />
                </div>
                <p className="text-2xl font-black text-white/60 font-mono">
                  {blocks.filter(b => !b.esOficial).length}
                </p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">PLANES DE CLASE</p>
              </div>
            </div>

            {/* Progreso visual de Oficialidad */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider">
                <span className="text-white/50">Porcentaje Oficial de la Parrilla</span>
                <span className="text-amber-400 font-mono">
                  {blocks.length > 0 ? Math.round((blocks.filter(b => b.esOficial).length / blocks.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                <motion.div 
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${blocks.length > 0 ? (blocks.filter(b => b.esOficial).length / blocks.length) * 100 : 0}%` 
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            <p className="text-[8px] text-amber-300/40 uppercase font-bold tracking-wider italic leading-normal">
              💡 Los horarios oficiales están encriptados y protegidos contra cambios. Para cambiar hora, docente o materia, se requiere desmarcar el checkbox de protección.
            </p>
          </div>

          {/* Col 2: Directorio de Horarios Oficiales (Grid Scrollable) */}
          <div className="lg:col-span-8 bg-black/40 border border-white/5 p-6 rounded-3xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[9px] font-black text-white/60 uppercase tracking-wider flex items-center gap-2">
                  <FileSpreadsheet size={12} className="text-amber-400" /> INVENTARIO CONSOLIDADO DE JORNADA OFICIAL ({blocks.filter(b => b.esOficial).length})
                </span>
                <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20 leading-none">
                  SISTEMA ESTABLE 🔒
                </span>
              </div>
            </div>

            <div className="max-h-[190px] overflow-y-auto custom-scrollbar pr-1 space-y-2">
              {blocks.filter(b => b.esOficial).length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-1">
                  <Lock size={16} className="text-white/10" />
                  <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Sin horarios oficiales declarados.</p>
                  <p className="text-[8px] font-bold uppercase text-white/20 tracking-wider">Edita una asignación y activa la casilla para blindarlo acá.</p>
                </div>
              ) : (
                blocks.filter(b => b.esOficial).map((b) => {
                  const prof = teachers.find(t => t.id === b.teacherId);
                  const gr = groups.find(g => g.id === b.groupId);
                  const tb = bloquesBase.find(t => t.id === b.bloqueId);
                  const label = tb ? tb.label : `Módulo #${b.bloqueId}`;

                  return (
                    <div 
                      key={b.id} 
                      className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between gap-4 hover:border-amber-500/20 transition-all font-mono text-[9px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 font-black rounded uppercase text-[8px] shrink-0">
                          {b.day} ({label})
                        </div>
                        <div className="space-y-0.5 truncate">
                          <p className="text-white font-black uppercase text-[10px] truncate">{b.subjectName}</p>
                          <div className="text-white/40 flex flex-wrap items-center gap-1.5 uppercase font-bold text-[8px]">
                            <span>👥 {gr?.name || b.groupId}</span>
                            <span>•</span>
                            <span>👨‍🏫 {prof?.name || 'Profesor'}</span>
                            <span>•</span>
                            <span>📍 {b.room}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(b)}
                        className="p-1 px-2.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/15 tracking-widest uppercase font-black text-[7px] flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Lock size={8} /> DETALLES / EDITAR
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-[8px] font-black text-white/20 uppercase tracking-widest text-center pt-2 border-t border-white/5">
              PROPIEDADES DE COORDINACIÓN • TECNUN DIGITAL PLANNING ACADEMY
            </div>
          </div>

        </div>
      </GlassCard>

      {/* 📡 CANALES DE DISTRIBUCIÓN Y EXPORTACIÓN MULTICANAL */}
      <GlassCard className="p-6 border-emerald-950/40 bg-emerald-950/5">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
          
          {/* Columna 1: Controles de Distribución */}
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-sm font-black text-[#DEFF9A] uppercase tracking-widest flex items-center gap-2">
                📡 Canales de Distribución y Exportación Multicanal
              </h3>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-0.5">
                Emite horarios oficiales a través de WhatsApp Web, Mailto institucional, impresión física o alertas en tiempo real.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Botón de Impresión General */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Printer size={13} className="text-[#DEFF9A]" /> Impresión Física / PDF
              </button>

              {/* Controles para el docente seleccionado o buscador rápido */}
              {selectedTeacherId !== 'ALL' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleShareWhatsAppOpt(selectedTeacherId)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Share2 size={13} className="text-emerald-400" /> WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareEmailOpt(selectedTeacherId)}
                    className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Mail size={13} className="text-blue-400" /> E-mail Docente
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNotifyInternalOpt(selectedTeacherId)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Bell size={13} className="text-amber-400" /> Alerta Interna
                  </button>
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest self-center mr-1">Notificación Masiva:</span>
                  <button
                    type="button"
                    onClick={handleNotifyAllOpt}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Bell size={13} className="text-amber-400" /> Notificar a todos los Docentes activos
                  </button>
                </div>
              )}
            </div>

            {selectedTeacherId === 'ALL' && (
              <p className="text-[8px] font-bold text-white/30 uppercase tracking-wider">
                💡 Consejo del Director: Filtra un docente arriba para activar sus botones de distribución individual por WhatsApp y Correo Escolar.
              </p>
            )}
          </div>

          {/* Columna 2: Historial / Simulación de Payloads Emitidos en Tiempo Real */}
          <div className="w-full lg:w-[350px] space-y-3 bg-black/40 border border-white/5 p-4 rounded-2xl relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[9px] font-black text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={11} className="text-[#DEFF9A]" /> LOG DE MENSAJERÍA INTERNA (JSON EMITIDO)
              </span>
              <span className="text-[8px] font-mono bg-white/10 text-white/70 px-1.5 py-0.5 rounded leading-none shrink-0 uppercase">
                {internalNotifications.length} ENVÍOS
              </span>
            </div>

            <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
              {internalNotifications.length === 0 ? (
                <p className="text-[8px] font-black uppercase text-white/20 text-center py-4">Sin notificaciones salientes</p>
              ) : (
                internalNotifications.map((notif: any, index: number) => {
                  const receptorName = teachers.find(t => t.id === notif.receptor_usuario_id)?.name || notif.receptor_usuario_id;
                  return (
                    <div key={notif.notificacion_id || index} className="p-2 rounded-lg bg-black/60 border border-white/5 space-y-1 font-mono text-[8px]">
                      <div className="flex justify-between items-center text-white/40">
                        <span className="text-[#DEFF9A] font-bold">ID: {notif.notificacion_id}</span>
                        <span>{new Date(notif.meta_data?.fecha_modificacion).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-white/80 font-semibold uppercase">Receptor: {receptorName}</p>
                      <p className="text-white/40 truncate text-[7px]" title={JSON.stringify(notif)}>
                        Payload: {`{ emisor: "${notif.emisor}", tipo: "${notif.tipo}", msg: "${notif.mensaje_corto}" }`}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {internalNotifications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Deseas vaciar el log de notificaciones de la sesión?')) {
                    setInternalNotifications([]);
                  }
                }}
                className="w-full text-center text-white/20 hover:text-white/40 text-[8px] font-bold uppercase tracking-widest block pt-2 border-t border-white/5 cursor-pointer"
              >
                Limpiar Historial de Payloads
              </button>
            )}
          </div>

        </div>
      </GlassCard>

      {/* The Parrilla Horaria grid from the requested layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-[#DEFF9A]" />
            <h3 className="text-xs font-black uppercase text-white/70 tracking-widest">
              PARRILLA HORARIA SEMANAL (TECNUN LAYOUT)
            </h3>
          </div>
          <span className="text-[8px] font-black text-white/30 bg-[#DEFF9A]/10 px-2.5 py-1 rounded border border-[#DEFF9A]/20 uppercase tracking-widest">
            {bloquesBase.length} Bloques de Tiempo Oficiales
          </span>
        </div>

        <div className="w-full overflow-x-auto bg-[#030a0e] text-white p-6 rounded-3xl border border-white/10 select-none custom-scrollbar">
          <div className="min-w-[900px]">
            
            {/* Encabezado de Días (LUNES a SÁBADO) as requested */}
            <div className="grid grid-cols-7 gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center justify-center bg-white/[0.02] rounded-xl py-3 border border-white/5">
                🕒 HORA / BLOQUE
              </div>
              {DAYS.map(dia => (
                <div 
                  key={dia} 
                  className="text-center font-black text-[10px] tracking-widest text-[#DEFF9A] py-3 uppercase flex items-center justify-center border-b-2 border-transparent"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* Parrilla Rows matching blocks base */}
            {bloquesBase.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                <p className="text-white/30 text-xs uppercase font-black tracking-widest">No hay bloques de horarios definidos. Activa un bloque en "Ajustar Bloques".</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bloquesBase.map((bloque) => (
                  <div 
                    key={bloque.id} 
                    className={`grid grid-cols-7 gap-3 py-1.5 items-stretch border-b border-white/[0.03] last:border-0 relative rounded-xl transition-all ${
                      bloque.esReceso 
                        ? 'bg-amber-950/20 border-b border-amber-500/20' 
                        : 'hover:bg-white/[0.01]'
                    }`}
                  >
                    {/* Columna Izquierda: Bloque de Tiempo Exacto */}
                    <div className="flex flex-col justify-center items-center px-2 bg-white/[0.01] rounded-xl border border-white/5 mr-1 py-4">
                      {bloque.esReceso ? (
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
                            <Coffee size={9} /> RECESO
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-300 tracking-tight text-center">
                            {bloque.label}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-[8px] font-black text-white/30 uppercase tracking-wider block">MOD # {bloque.id}</span>
                          <span className="text-xs font-mono font-extrabold text-white tracking-tighter">
                            {bloque.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Columnas de los Días (Lunes a Sábado, 1 a 6) */}
                    {DAYS.map((dia) => {
                      // Find if we have scheduled item in this day & bloqueId
                      const assignedClass = filteredBlocks.find(b => b.day === dia && b.bloqueId === bloque.id);

                      if (bloque.esReceso) {
                        return (
                          <div 
                            key={dia} 
                            className="bg-amber-400/[0.03] border border-dashed border-amber-500/10 rounded-xl flex items-center justify-center p-3 text-center h-20"
                          >
                            <span className="text-[8px] font-black text-amber-400/40 uppercase tracking-widest">
                              Módulo libre de clases ☕
                            </span>
                          </div>
                        );
                      }

                      if (assignedClass) {
                        const prof = teachers.find(t => t.id === assignedClass.teacherId);
                        const gr = groups.find(g => g.id === assignedClass.groupId);

                        return (
                          <div 
                            key={dia}
                            className={`h-20 w-full rounded-2xl border transition-all p-3 flex flex-col justify-between relative group/slot cursor-pointer ${
                              assignedClass.esOficial 
                                ? 'border-amber-500/50 bg-amber-500/[0.04] hover:bg-amber-500/[0.08] active:border-amber-400 shadow-[inset_0_0_10px_rgba(245,158,11,0.05)]' 
                                : 'border-[#DEFF9A]/30 bg-[#DEFF9A]/5 hover:bg-[#DEFF9A]/10 active:border-[#DEFF9A]'
                            }`}
                            onClick={() => handleOpenEdit(assignedClass)}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-white text-[10px] font-black uppercase truncate leading-tight flex-1 flex items-center gap-1">
                                {assignedClass.esOficial && <Lock size={10} className="text-amber-400 shrink-0" />}
                                <span className="truncate">{assignedClass.subjectName}</span>
                              </span>
                              <div className="opacity-0 group-hover/slot:opacity-100 transition-opacity flex gap-1 bg-black/60 rounded px-1 py-0.5 shrink-0 z-10">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEdit(assignedClass);
                                  }}
                                  className="text-white/70 hover:text-white"
                                  title="Editar"
                                >
                                  <Edit3 size={10} />
                                </button>
                                {!assignedClass.esOficial && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClass(assignedClass.id);
                                    }}
                                    className="text-white/55 hover:text-red-400"
                                    title="Remover"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Class info */}
                            <div className="flex items-center justify-between text-[8px] font-black text-white/40 uppercase tracking-widest pt-1 border-t border-white/5 mt-1">
                              <span className="truncate max-w-[50px]">👥 {gr?.name || assignedClass.groupId}</span>
                              <span className={`truncate max-w-[50px] ${assignedClass.esOficial ? 'text-amber-300' : 'text-[#DEFF9A]'}`}>
                                👨‍🏫 {prof ? prof.name.split(' ')[0] : 'Prof'}
                              </span>
                            </div>

                            <span className="absolute bottom-1 right-2 text-[7px] text-white/30 font-mono">
                              📍 {assignedClass.room}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={dia}
                          onClick={() => handleOpenAssign(dia, bloque.id)}
                          className="h-20 w-full rounded-2xl border border-white/5 hover:border-[#DEFF9A]/30 bg-black/20 transition-all flex items-center justify-center p-2 relative group/slot cursor-pointer"
                        >
                          <span className="opacity-0 group-hover/slot:opacity-100 text-[9px] font-black uppercase text-[#DEFF9A] tracking-wider transition-opacity flex items-center gap-1">
                            <Plus size={10} /> Asignar Grupo
                          </span>
                        </div>
                      );
                    })}

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Day summary cards at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {DAYS.map(day => {
          const dayClasses = filteredBlocks.filter(b => b.day === day);
          return (
            <div key={day} className="h-full">
              <GlassCard className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-[#DEFF9A] uppercase tracking-widest">{day}</span>
                  <span className="text-[8px] font-mono font-black text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                    {dayClasses.length} MÓDULOS
                  </span>
                </div>

                {dayClasses.length === 0 ? (
                  <p className="text-[8px] font-black uppercase text-white/20">Sin asignaciones</p>
                ) : (
                  <div className="space-y-1">
                    {dayClasses.slice(0, 3).map(c => {
                      const grName = groups.find(g => g.id === c.groupId)?.name || 'Grupo';
                      return (
                        <div key={c.id} className="text-[8px] font-extrabold uppercase truncate text-white/50 block">
                          • {c.subjectName} ({grName})
                        </div>
                      );
                    })}
                    {dayClasses.length > 3 && (
                      <span className="text-[7px] font-bold text-white/30 uppercase mt-0.5 block">
                        +{dayClasses.length - 3} más...
                      </span>
                    )}
                  </div>
                )}
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Dialog for Scheduling Slot */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#040e14] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="text-[#DEFF9A]" size={20} />
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      {editingBlock ? 'Modificar Clase' : 'Asignar Grupo a Celda'}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveClass} className="p-8 space-y-5">
                
                {formError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] font-black text-red-100 uppercase tracking-wide leading-relaxed">
                      {formError}
                    </p>
                  </div>
                )}

                {/* Day and Bloque details (Disabled visualization) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                    <span className="text-[8px] font-black text-white/30 uppercase block">Día Programado</span>
                    <span className="text-xs font-black text-[#DEFF9A] uppercase tracking-wider">{formDay}</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                    <span className="text-[8px] font-black text-white/30 uppercase block">Horas Oficiales</span>
                    <span className="text-xs font-black text-white uppercase font-mono">
                      {bloquesBase.find(b => b.id === formBloqueId)?.label || `Módulo #${formBloqueId}`}
                    </span>
                  </div>
                </div>

                 {/* 🔒 CONFIGURACIÓN DE PROTECCIÓN DE HORARIO OFICIAL */}
                <div className="p-4 bg-amber-500/[0.03] border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4 select-none">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 bg-transparent">
                      <Lock size={12} className={formEsOficial ? "text-amber-400 animate-pulse" : "text-white/30"} /> ¿Establecer como Horario Oficial?
                    </span>
                    <p className="text-[8px] text-white/40 uppercase font-black tracking-wider leading-relaxed">
                      Al marcarlo, se bloquea el horario contra cambios accidentales y se suma al conteo oficial.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formEsOficial}
                    onChange={(e) => setFormEsOficial(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 text-amber-500 focus:ring-0 bg-transparent cursor-pointer"
                  />
                </div>

                {formEsOficial && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5">
                    <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={14} />
                    <p className="text-[8px] font-bold text-amber-100 uppercase tracking-wider leading-normal">
                      ⚠️ HORARIO OFICIAL PROTEGIDO: Los campos inferiores están bloqueados para edición o eliminación. Desmarca el checkbox superior si necesitas realizar modificaciones.
                    </p>
                  </div>
                )}

                {/* 1. Selecciona Grupo (traído de la sección de grupos) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">
                    👥 1. Grado / Grupo de la Institución
                  </label>
                  <select
                    value={formGroupId}
                    onChange={(e) => setFormGroupId(e.target.value)}
                    disabled={formEsOficial}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs uppercase font-extrabold text-white tracking-wider outline-none focus:border-[#DEFF9A]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="" disabled>Selecciona un grupo existente...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>GRUPO: {g.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Selecciona Docente (enlace con docentes/usuarios) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">
                    👨‍🏫 2. Docente de la Institución
                  </label>
                  <select
                    value={formTeacherId}
                    onChange={(e) => setFormTeacherId(e.target.value)}
                    disabled={formEsOficial}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs uppercase font-extrabold text-white tracking-wider outline-none focus:border-[#DEFF9A]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="" disabled>Selecciona el profesor certificado...</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>DOCENTE: {t.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Materia Text Input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">
                    📖 3. Nombre del Curso / Materia
                  </label>
                  <input
                    type="text"
                    value={formSubjectName}
                    onChange={(e) => setFormSubjectName(e.target.value)}
                    disabled={formEsOficial}
                    placeholder="Ej. TecLingo AI (Inglés I)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs uppercase font-extrabold text-white tracking-wider outline-none focus:border-[#DEFF9A]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {/* Room */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">
                    🏫 Aula / Laboratorio Asignado
                  </label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    disabled={formEsOficial}
                    placeholder="Ej. Aula A-101"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs uppercase font-extrabold text-white tracking-wider outline-none focus:border-[#DEFF9A]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {/* Form actions */}
                <div className="flex justify-between gap-3 pt-6 border-t border-white/5">
                  {editingBlock ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteClass(editingBlock.id)}
                      disabled={formEsOficial}
                      className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      Remover Asignación
                    </button>
                  ) : <div />}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all hover:bg-white/10"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_#DEFF9A40] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {editingBlock ? 'Guardar Cambios' : 'Confirmar Asignación'}
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
