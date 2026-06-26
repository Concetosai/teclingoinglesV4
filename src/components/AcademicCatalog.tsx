/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Zap, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileJson,
  Upload,
  ChevronRight,
  BookOpen,
  FileText,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, Career, Subject } from '../context/AppContext';

export function AcademicCatalog() {
  const { careers, setCareers, setSubjects } = useAppContext();
  const [activeTab, setActiveTab] = useState<'reticula' | 'arquitectura'>('reticula');
  const [expandedCareerId, setExpandedCareerId] = useState<string | null>(null);
  const [expandedSyllabusId, setExpandedSyllabusId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. MANEJO DE CARGA MASIVA (JSON RETICULAR)
  const processJson = (content: string, careerId?: string) => {
    try {
      const parsedData = JSON.parse(content);
      const rawData = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      const newCareers = [...careers];
      const allNewSubjects: Subject[] = [];

      rawData.forEach((item: any, idx: number) => {
        const id = careerId || `car-${Date.now()}-${idx}`;
        const subjects: Subject[] = (item.asignaturas || item.subjects || []).map((s: any, sIdx: number) => {
          const syllabusData = s.PLAN_DE_ESTUDIOS_BASE || s.syllabus;
          let syllabus;
          
          if (syllabusData) {
            syllabus = {
              generalObjective: syllabusData.objetivo_general || syllabusData.generalObjective || '',
              units: (syllabusData.unidades || syllabusData.units || []).map((u: any) => ({
                number: u.unidad || u.number || 0,
                title: u.titulo || u.title || '',
                topics: u.temas || u.topics || []
              }))
            };
          }

          return {
            id: `sub-${id}-${sIdx}-${Date.now()}`,
            clave: s.clave || s.code || 'N/A',
            name: s.nombre || s.name,
            weeklyHours: s.horasSemanales || s.hours || 4,
            careerId: id,
            semester: s.semestre || s.semester || 1,
            syllabus
          };
        });

        const careerObj: Career = {
          id,
          name: item.carrera || item.nombre || item.name || 'Nueva Carrera',
          claveReticula: item.claveReticula || 'N/A',
          horasLimiteSemestre: item.horasLimiteSemestre || 33,
          subjects
        };

        const existingIdx = newCareers.findIndex(c => c.id === id);
        if (existingIdx >= 0) {
          newCareers[existingIdx] = careerObj;
        } else {
          newCareers.push(careerObj);
        }
        allNewSubjects.push(...subjects);
      });

      setCareers(newCareers);
      setSubjects(prev => {
        const filtered = prev.filter(s => !newCareers.some(c => c.id === s.careerId));
        return [...filtered, ...allNewSubjects];
      });

      if (!careerId) setExpandedCareerId(newCareers[newCareers.length-1].id);
    } catch (err) {
      alert("Error: Formato JSON inválido.");
    }
  };

  const handleJsonDrop = (e: React.DragEvent, careerId?: string) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => processJson(event.target?.result as string, careerId);
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => processJson(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  // 2. ACTUALIZACIÓN MANUAL
  const updateAsignaturaHora = (carreraId: string, asignId: string, nuevasHoras: number) => {
    setCareers(prev => prev.map(c => c.id === carreraId ? {
      ...c,
      subjects: c.subjects.map(a => a.id === asignId ? { ...a, weeklyHours: nuevasHoras } : a)
    } : c));
  };

  const updateHorasLimite = (carreraId: string, limite: number) => {
    setCareers(prev => prev.map(c => c.id === carreraId ? { ...c, horasLimiteSemestre: limite } : c));
  };

  const handleAddExtraCurricular = (carreraId: string) => {
    const nuevaMateria: Subject = {
      id: `extra-${Date.now()}`,
      clave: 'EXTRA',
      name: 'Nueva Asignatura Extra-curricular',
      weeklyHours: 4,
      careerId: carreraId,
      semester: 1
    };
    setCareers(prev => prev.map(c => c.id === carreraId ? { ...c, subjects: [...c.subjects, nuevaMateria] } : c));
  };

  const handleAddEmptyCareer = () => {
    const id = `car-${Date.now()}`;
    const newCareer: Career = {
      id,
      name: 'Nueva Carrera',
      claveReticula: 'IINF-2010-220',
      horasLimiteSemestre: 33,
      subjects: []
    };
    setCareers([...careers, newCareer]);
    setExpandedCareerId(id);
  };

  const filteredCareers = careers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER PRINCIPAL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">Módulo de Biblioteca</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            {activeTab === 'reticula' ? 'CATÁLOGO DE ' : 'BIBLIOTECA DE '}<span className="text-[#DEFF9A]">{activeTab === 'reticula' ? 'ASIGNATURAS' : 'CÓDIGO & ARCHIVOS'}</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">
            {activeTab === 'reticula' 
              ? 'Cimientos del ERP: Define la carga reticular antes de armar el horario.' 
              : 'Arquitectura Modular: Estructuras de datos, vistas y componentes del sistema.'}
          </p>
        </div>
        {activeTab === 'reticula' && (
          <div className="flex items-center gap-4">
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
             <button 
               onClick={handleAddEmptyCareer}
               className="px-8 py-4 rounded-2xl bg-[#DEFF9A] text-black flex items-center gap-4 hover:scale-105 transition-all font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.3)]"
             >
               <Plus size={20} />
               Agregar Carrera
             </button>
          </div>
        )}
      </header>

      {/* SECTOR DE PESTAÑAS PRÉMIUM */}
      <div className="flex border-b border-white/5 gap-8">
        <button 
          onClick={() => setActiveTab('reticula')}
          className={`pb-4 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'reticula' ? 'text-[#DEFF9A]' : 'text-white/40 hover:text-white'}`}
        >
          <span>Estructura Reticular</span>
          {activeTab === 'reticula' && (
            <motion.div layoutId="catalogTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#DEFF9A]" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('arquitectura')}
          className={`pb-4 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'arquitectura' ? 'text-[#DEFF9A]' : 'text-white/40 hover:text-white'}`}
        >
          <span>Biblioteca de Código & Arquitectura</span>
          {activeTab === 'arquitectura' && (
            <motion.div layoutId="catalogTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#DEFF9A]" />
          )}
        </button>
      </div>

      {activeTab === 'arquitectura' ? (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 space-y-6">
            <div className="space-y-2">
              <h3 className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-[0.3em]">ORGANIZACIÓN DEL PROYECTO</h3>
              <p className="text-white text-base md:text-lg font-black uppercase italic leading-tight">
                Estructura de Vistas, Componentes y Bases de Datos Locales
              </p>
              <p className="text-white/40 text-[11px] leading-relaxed max-w-4xl">
                Los archivos de código que gestionan, contienen y estructuran las funciones indicadas se dividen de forma modular entre Vistas e Interfaz de Usuario (Componentes) y Estructuras de Datos Curriculares (Databases Locales). A continuación, se detalla la lista exacta de archivos implicados en cada módulo:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Module 1 */}
              <div className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-white/10 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-black">1</span>
                  <h4 className="text-white font-black text-xs uppercase tracking-wider">Control Escolar & Panel Directivo General</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest leading-none">Archivo</p>
                  <p className="text-[#DEFF9A] font-mono text-[9px] bg-[#DEFF9A]/5 px-2.5 py-1.5 rounded-lg border border-[#DEFF9A]/10 select-all">src/components/DirectivoMainboard.tsx</p>
                </div>
                <p className="text-white/60 text-[11px] leading-relaxed">
                  Es la consola general de administración escolar. Desde aquí se enruta y organiza el menú lateral de acciones institucionales, el estado de los alumnos y la carga de vistas complementarias como la biblioteca directiva y los reportes de auditoría académica.
                </p>
              </div>

              {/* Module 2 */}
              <div className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-white/10 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#DEFF9A]/10 text-[#DEFF9A] flex items-center justify-center text-xs font-black">2</span>
                  <h4 className="text-white font-black text-xs uppercase tracking-wider">Pase de Lista Inmersivo & QR</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest leading-none">Archivos</p>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[#DEFF9A] font-mono text-[9px] bg-[#DEFF9A]/5 px-2.5 py-1.5 rounded-lg border border-[#DEFF9A]/10 select-all">src/components/QRScannerModule.tsx</p>
                    <p className="text-[#DEFF9A] font-mono text-[9px] bg-[#DEFF9A]/5 px-2.5 py-1.5 rounded-lg border border-[#DEFF9A]/10 select-all">src/components/DocenteMainboard.tsx</p>
                  </div>
                </div>
                <p className="text-white/60 text-[11px] leading-relaxed">
                  Controla el flujo del escáner en vivo de credenciales de estudiantes, permitiendo la simulación de entrada bilingüe de alumnos y actualizando el live feed de asistencia del maestro en tiempo real.
                </p>
              </div>

              {/* Module 3 */}
              <div className="p-6 rounded-3xl bg-black/40 border border-[#DEFF9A]/10 hover:border-[#DEFF9A]/20 transition-all space-y-4 col-span-1 md:col-span-2">
                <h4 className="text-[11px] font-black text-[#DEFF9A] uppercase tracking-widest">Base de Datos Locales</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <p className="text-white/40 text-[8px] font-black uppercase tracking-wider mb-2">Estructura Global del Estado</p>
                    <p className="text-[#DEFF9A] font-bold text-[10px] font-mono mb-1">src/context/AppContext.tsx</p>
                    <p className="text-white/50 text-[10px]">Define y mantiene el estado global: carreras, materias (subjects), profesores calificados y avisos de mantenimiento del HUB.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <p className="text-white/40 text-[8px] font-black uppercase tracking-wider mb-2">Gramática Pedagógica</p>
                    <p className="text-[#DEFF9A] font-bold text-[10px] font-mono mb-1">src/components/tools/grammarLibraryData.ts</p>
                    <p className="text-white/50 text-[10px]">Almacena y enumera temas de gramática estructurada alineados rigurosamente con el estándar marco MCER.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LISTA DE CARRERAS ORIGINAL */
        <div className="space-y-6">
        {filteredCareers.length === 0 && (
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => handleJsonDrop(e)}
            className={`py-32 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed rounded-[3rem] text-white/20 gap-6 transition-all ${isDragging ? 'border-[#DEFF9A] bg-[#DEFF9A]/5 text-[#DEFF9A]' : 'border-white/10'}`}
          >
             <FileJson size={80} className={`${isDragging ? 'animate-bounce' : 'opacity-20'}`} />
             <div className="text-center">
                <p className="text-2xl font-black uppercase italic">Catálogo Vacío</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1 opacity-60">Arrastra un archivo JSON o usa el botón superior para empezar</p>
             </div>
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="mt-4 px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 text-[10px] font-black uppercase tracking-widest transition-all"
             >
                Explorar Archivos
             </button>
          </div>
        )}

        {filteredCareers.map((carrera) => {
          const totalHorasCreadas = carrera.subjects.reduce((acc, curr) => acc + curr.weeklyHours, 0);
          const isExpanded = expandedCareerId === carrera.id;
          
          let semaforoStyles = {
            bg: "bg-orange-500/5 border-orange-500/30 text-orange-400",
            texto: "Faltan horas por asignar",
            icon: AlertCircle
          };

          if (totalHorasCreadas === carrera.horasLimiteSemestre && carrera.subjects.length > 0) {
            semaforoStyles = {
              bg: "bg-[#DEFF9A]/5 border-[#DEFF9A]/30 text-[#DEFF9A]",
              texto: "Estructura Correcta",
              icon: CheckCircle2
            };
          } else if (totalHorasCreadas > carrera.horasLimiteSemestre) {
            semaforoStyles = {
              bg: "bg-red-500/5 border-red-500/30 text-red-400",
              texto: "Error: Exceso de horas",
              icon: AlertCircle
            };
          }

          return (
            <div key={carrera.id} className="bg-[#161b22]/50 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:border-white/10">
              
              {/* HEADER DEL ACORDEÓN */}
              <div 
                className="p-8 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-white/[0.02] transition-all gap-6"
                onClick={() => setExpandedCareerId(isExpanded ? null : carrera.id)}
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#DEFF9A] transition-all ${isExpanded ? 'rotate-90 bg-[#DEFF9A] text-black' : ''}`}>
                    <ChevronRight size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight italic">{carrera.name}</h2>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{carrera.claveReticula}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Límite Semestre</span>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-2">
                      <input 
                        type="number" 
                        value={carrera.horasLimiteSemestre}
                        onChange={(e) => updateHorasLimite(carrera.id, parseInt(e.target.value) || 0)}
                        className="w-12 bg-transparent border-none text-center font-black text-[#DEFF9A] focus:outline-none"
                      />
                      <span className="text-[10px] font-black text-white/40 uppercase ml-2">hrs</span>
                    </div>
                  </div>

                  <div className={`px-6 py-3 border rounded-2xl flex items-center gap-3 transition-all ${semaforoStyles.bg}`}>
                    <semaforoStyles.icon size={16} />
                    <div className="text-right">
                       <p className="text-[14px] font-black italic leading-none">{totalHorasCreadas} / {carrera.horasLimiteSemestre}</p>
                       <p className="text-[8px] font-black uppercase opacity-60 tracking-widest">{semaforoStyles.texto}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTENIDO DESPLEGABLE */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-black/40"
                  >
                    <div className="p-8 space-y-8">
                       {/* DROPZONE / EMPTY STATE */}
                       {carrera.subjects.length === 0 && (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => handleJsonDrop(e, carrera.id)}
                          className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-200
                            ${isDragging ? 'border-[#DEFF9A] bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'border-white/5 bg-white/[0.01] hover:border-white/20'}
                          `}
                        >
                          <div className="flex flex-col items-center gap-4">
                            <Upload size={40} className={isDragging ? 'animate-bounce' : 'opacity-20'} />
                            <div>
                               <p className="text-lg font-black uppercase text-white tracking-tight italic">Subir Plan de Estudios</p>
                               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Arrastra el archivo <span className="text-[#DEFF9A]">.json</span> oficial para auto-completar</p>
                            </div>
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase transition-all"
                            >
                               Seleccionar Archivo
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TABLA DE ASIGNATURAS */}
                      {carrera.subjects.length > 0 && (
                        <div className="space-y-4">
                           <div className="grid grid-cols-[1fr_auto] gap-8 px-4">
                              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Asignatura / Clave</span>
                              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] pr-4">Carga Horaria</span>
                           </div>
                           
                           <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 overflow-x-auto">
                              <div className="min-w-[600px] space-y-3">
                                {carrera.subjects.map((asignatura) => (
                                <div key={asignatura.id} className="space-y-3">
                                  <div className="group/row flex items-center justify-between bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:border-white/20 hover:bg-white/[0.05] transition-all">
                                     <div className="flex items-center gap-4 flex-1">
                                        <span className="text-[10px] font-black text-[#DEFF9A] bg-[#DEFF9A]/10 px-3 py-1.5 rounded-lg border border-[#DEFF9A]/20 min-w-[80px] text-center">{asignatura.clave}</span>
                                        <div className="flex flex-col">
                                           <div className="flex items-center gap-2">
                                              <span className="text-white font-bold text-sm tracking-tight">{asignatura.name}</span>
                                              {asignatura.syllabus && (
                                                <button 
                                                  onClick={() => setExpandedSyllabusId(expandedSyllabusId === asignatura.id ? null : asignatura.id)}
                                                  className={`p-1 rounded-lg transition-all ${expandedSyllabusId === asignatura.id ? 'bg-[#DEFF9A] text-black' : 'text-white/20 hover:text-[#DEFF9A] hover:bg-white/5'}`}
                                                  title="Ver Plan de Estudios"
                                                >
                                                  <BookOpen size={14} />
                                                </button>
                                              )}
                                           </div>
                                           <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Semestre {asignatura.semester}</span>
                                        </div>
                                     </div>
                                     
                                     <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-2">
                                           <input 
                                             type="number" 
                                             value={asignatura.weeklyHours}
                                             onChange={(e) => updateAsignaturaHora(carrera.id, asignatura.id, parseInt(e.target.value) || 0)}
                                             className="w-10 bg-transparent border-none text-center font-black text-white focus:outline-none"
                                             min="1"
                                           />
                                           <span className="text-[9px] font-black text-white/20 uppercase ml-1">hrs</span>
                                        </div>
                                        <button className="p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover/row:opacity-100" onClick={() => {
                                          setCareers(prev => prev.map(c => c.id === carrera.id ? { ...c, subjects: c.subjects.filter(s => s.id !== asignatura.id) } : c));
                                        }}>
                                           <Trash2 size={16} />
                                        </button>
                                     </div>
                                  </div>

                                  {/* Syllabus Details Panel */}
                                  <AnimatePresence>
                                    {expandedSyllabusId === asignatura.id && asignatura.syllabus && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-black/20 border border-white/5 rounded-2xl mx-1"
                                      >
                                        <div className="p-6 space-y-6">
                                           <div className="space-y-2">
                                              <div className="flex items-center gap-2 text-[10px] font-black text-[#DEFF9A] uppercase tracking-[0.2em]">
                                                <FileText size={12} /> 
                                                <span>Objetivo General</span>
                                              </div>
                                              <p className="text-xs text-white/60 leading-relaxed italic">
                                                "{asignatura.syllabus.generalObjective}"
                                              </p>
                                           </div>

                                           <div className="space-y-4">
                                              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Contenido Temático</p>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 {asignatura.syllabus.units.map((unit) => (
                                                   <div key={unit.number} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                      <div className="flex items-center gap-3 mb-2">
                                                         <span className="w-6 h-6 rounded bg-[#DEFF9A]/10 text-[#DEFF9A] text-[10px] font-black flex items-center justify-center">
                                                            {unit.number}
                                                         </span>
                                                         <h6 className="text-[11px] font-bold text-white uppercase tracking-tight">{unit.title}</h6>
                                                      </div>
                                                      <ul className="space-y-1.5 pl-9">
                                                         {unit.topics.map((topic, tIdx) => (
                                                           <li key={tIdx} className="text-[10px] text-white/40 flex items-center gap-2">
                                                              <div className="w-1 h-1 rounded-full bg-[#DEFF9A]/30" />
                                                              {topic}
                                                           </li>
                                                         ))}
                                                      </ul>
                                                   </div>
                                                 ))}
                                              </div>
                                           </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                ))}
                              </div>
                           </div>

                           {/* BOTÓN INTERACTIVO: AGREGAR ASIGNATURA MANUAL */}
                           <div className="pt-4">
                             <button 
                               onClick={() => handleAddExtraCurricular(carrera.id)}
                               className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-white/5 hover:border-[#DEFF9A]/40 rounded-[2rem] bg-white/[0.02] hover:bg-[#DEFF9A]/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-[#DEFF9A] transition-all duration-300"
                             >
                               <Plus size={16} />
                               <span>Agregar Asignatura Manual al Plan</span>
                             </button>
                           </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
