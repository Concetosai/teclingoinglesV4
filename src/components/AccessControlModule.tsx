/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Shield, 
  Activity, 
  ChevronRight, 
  AlertCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

// Comprehensive dataset of 18 planning levels (matching Weeks of planning)
interface PlanningLevel {
  id: number;
  name: string;
  unit: string;
  topic: string;
  kpi: string;
}

const PLANNING_LEVELS: PlanningLevel[] = [
  { id: 1, name: 'Nivel 1 - Semana 1', unit: 'Unidad 1: Personal Profiles', topic: 'Saludos, Presentaciones Personales y Cortesía Básica', kpi: 'Evidencia de Tarjeta de Contacto' },
  { id: 2, name: 'Nivel 2 - Semana 2', unit: 'Unidad 1: Classroom Space', topic: 'Objetos Escolares y del Aula de Clase', kpi: 'Inventario Escrito del Aula' },
  { id: 3, name: 'Nivel 3 - Semana 3', unit: 'Unidad 2: Family Tree', topic: 'Miembros de la Familia y Relaciones Básicas', kpi: 'Árbol Genealógico Redactado' },
  { id: 4, name: 'Nivel 4 - Semana 4', unit: 'Unidad 2: Global Citizens', topic: 'Países, Nacionalidades e Idiomas del Mundo', kpi: 'Formulario de Aduana sin Errores' },
  { id: 5, name: 'Nivel 5 - Semana 5', unit: 'Unidad 3: Free Time & Sports', topic: 'Pasatiempos, Deporte y Actividades Recreativas', kpi: 'Ensayo Corto sobre Hobbies de Ocio' },
  { id: 6, name: 'Nivel 6 - Semana 6', unit: 'Unidad 3: Travel Plans', topic: 'Planificación de Viajes y Direcciones Básicas', kpi: 'Audio describiendo itinerario de viaje' },
  { id: 7, name: 'Nivel 7 - Semana 7', unit: 'Unidad 4: Shopping Time', topic: 'Compras, Precios y Ropa de Vestir', kpi: 'Juego de rol interactivo de compra' },
  { id: 8, name: 'Nivel 8 - Semana 8', unit: 'Unidad 4: Food & Dining', topic: 'Alimentos, Bebidas y Órdenes en Restaurante', kpi: 'Guión de pedido de menú formal en inglés' },
  { id: 9, name: 'Nivel 9 - Semana 9', unit: 'Unidad 5: Around Town', topic: 'Atractivos de la Ciudad y Preposiciones de Lugar', kpi: 'Croquis interactivo comentado' },
  { id: 10, name: 'Nivel 10 - Semana 10', unit: 'Unidad 5: At the Hotel', topic: 'Reservaciones, Hospedaje y Vocabulario Relacionado', kpi: 'Formulario de check-in mock hotel' },
  { id: 11, name: 'Nivel 11 - Semana 11', unit: 'Unidad 6: Music & Art', topic: 'Géneros Musicales, Instrumentos y Exposiciones', kpi: 'Ficha de reseña de festival artístico' },
  { id: 12, name: 'Nivel 12 - Semana 12', unit: 'Unidad 6: Tech & Devices', topic: 'Tecnología Diaria, Electrodomésticos y Problemas Técnicos', kpi: 'Reporte de fallas y soporte simulado' },
  { id: 13, name: 'Nivel 13 - Semana 13', unit: 'Unidad 7: Daily Routines', topic: 'Rutina Diaria, Hábitos de Sueño y Frecuencia', kpi: 'Infografía temporal con adverbios de frecuencia' },
  { id: 14, name: 'Nivel 14 - Semana 14', unit: 'Unidad 7: Jobs & Career', topic: 'Profesiones, Oficios y Tareas del Lugar de Trabajo', kpi: 'Carta de postulación de vacante junior' },
  { id: 15, name: 'Nivel 15 - Semana 15', unit: 'Unidad 8: Weather & Seasons', topic: 'Clima, Estaciones del Año y Prendas de Temporada', kpi: 'Video de reporte meteorológico en inglés' },
  { id: 16, name: 'Nivel 16 - Semana 16', unit: 'Unidad 8: Health & Wellness', topic: 'Salud, Síntomas, Consejos Médicos y Ejercicio', kpi: 'Folleto de recetas saludables e indicaciones' },
  { id: 17, name: 'Nivel 17 - Semana 17', unit: 'Unidad 9: Holiday Celebrations', topic: 'Celebraciones Globales, Cumpleaños y Efemérides', kpi: 'Mensaje de felicitación e invitación' },
  { id: 18, name: 'Nivel 18 - Semana 18', unit: 'Unidad 9: Future Ambitions', topic: 'Deseos, Proyecciones de Vida y Próximo Ciclo', kpi: 'Ensayo reflexivo final de metas a 5 años' }
];

// Reusing same mock users for role ALUMNO & DOCENTE to maintain integrity
interface SystemUser {
  id: string;
  controlNumber: string;
  name: string;
  email: string;
  role: 'ALUMNO' | 'DOCENTE';
  level: string;
  photo?: string;
}

const SYSTEM_USERS: SystemUser[] = [
  { id: 'USR-304-Z11', controlNumber: 'TEC-2024-502', name: 'Juan Pérez', email: 'juan.p@student.ai', role: 'ALUMNO', level: 'A2 - Pre-Intermediate', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  { id: 'USR-221-C99', controlNumber: 'TEC-2024-991', name: 'Sofía Méndez', email: 's.mendez@student.ai', role: 'ALUMNO', level: 'B1 - Intermediate', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' },
  { id: 'USR-823-X92', controlNumber: 'TEC-2024-001', name: 'Prof. Alejandro Ortega', email: 'ale.ortega@tecnolingo.ai', role: 'DOCENTE', level: 'Nivel Ejecutivo', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { id: 'USR-901-B33', controlNumber: 'TEC-2024-105', name: 'Prof. Luis Garcia', email: 'l.garcia@tecnolingo.ai', role: 'DOCENTE', level: 'Coordinador B2', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { id: 'USR-481-H23', controlNumber: 'TEC-2024-342', name: 'Pedro J.', email: 'pedro.j@student.ai', role: 'ALUMNO', level: 'B2 - Advanced', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
  { id: 'USR-762-P81', controlNumber: 'TEC-2024-118', name: 'Elena Vasquez', email: 'elena.v@student.ai', role: 'ALUMNO', level: 'B1 - Intermediate', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' }
];

interface AccessLog {
  timestamp: string;
  user: string;
  level: number;
  status: 'ACTIVADO' | 'DESACTIVADO';
}

export function AccessControlModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('USR-304-Z11');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [globalAccessStates, setGlobalAccessStates] = useState<{ [key: string]: { [levelId: number]: boolean } }>(() => {
    const saved = localStorage.getItem('tecnolingo_planning_access_v1');
    if (saved) return JSON.parse(saved);

    // Default: levels 1-3 unlocked by default for everyone, the rest locked or progressive
    const defaultStates: { [key: string]: { [levelId: number]: boolean } } = {};
    SYSTEM_USERS.forEach(u => {
      defaultStates[u.id] = {
        1: true,
        2: true,
        3: true,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        18: false,
      };
    });
    return defaultStates;
  });

  const [logs, setLogs] = useState<AccessLog[]>(() => {
    const saved = localStorage.getItem('tecnolingo_access_logs');
    if (saved) return JSON.parse(saved);
    return [
      { timestamp: 'Hoy 09:30 AM', user: 'Juan Pérez', level: 4, status: 'DESACTIVADO' },
      { timestamp: 'Hoy 08:15 AM', user: 'Elena Vasquez', level: 3, status: 'ACTIVADO' },
      { timestamp: 'Ayer 04:45 PM', user: 'Sofía Méndez', level: 2, status: 'ACTIVADO' }
    ];
  });

  const [notification, setNotification] = useState<{ show: boolean; msg: string; type: 'success' | 'warn' }>({
    show: false,
    msg: '',
    type: 'success'
  });

  useEffect(() => {
    localStorage.setItem('tecnolingo_planning_access_v1', JSON.stringify(globalAccessStates));
  }, [globalAccessStates]);

  useEffect(() => {
    localStorage.setItem('tecnolingo_access_logs', JSON.stringify(logs));
  }, [logs]);

  const activeUser = SYSTEM_USERS.find(u => u.id === selectedUserId) || SYSTEM_USERS[0];
  const userAccess = globalAccessStates[activeUser.id] || {};

  // Find next level ID based on current selection
  const nextLevelId = selectedLevelId < 18 ? selectedLevelId + 1 : null;
  const isSelectedLevelActive = !!userAccess[selectedLevelId];
  const isNextLevelActive = nextLevelId ? !!userAccess[nextLevelId] : false;

  const handleToggleLevel_Current = () => {
    const newStatus = !isSelectedLevelActive;
    setGlobalAccessStates(prev => {
      const userStates = { ...(prev[activeUser.id] || {}) };
      userStates[selectedLevelId] = newStatus;
      return {
        ...prev,
        [activeUser.id]: userStates
      };
    });

    addLog(activeUser.name, selectedLevelId, newStatus ? 'ACTIVADO' : 'DESACTIVADO');
    triggerNotification(`Acceso a Nivel ${selectedLevelId} ${newStatus ? 'Habilitado' : 'Deshabilitado'} con éxito.`);
  };

  const handleToggleLevel_Next = () => {
    if (!nextLevelId) return;
    const newStatus = !isNextLevelActive;
    setGlobalAccessStates(prev => {
      const userStates = { ...(prev[activeUser.id] || {}) };
      userStates[nextLevelId] = newStatus;
      return {
        ...prev,
        [activeUser.id]: userStates
      };
    });

    addLog(activeUser.name, nextLevelId, newStatus ? 'ACTIVADO' : 'DESACTIVADO');
    triggerNotification(`Acceso al Siguiente Nivel (${nextLevelId}) ${newStatus ? 'Habilitado' : 'Deshabilitado'} con éxito.`);
  };

  const handleToggleAll = (status: boolean) => {
    setGlobalAccessStates(prev => {
      const userStates = { ...(prev[activeUser.id] || {}) };
      PLANNING_LEVELS.forEach(lvl => {
        userStates[lvl.id] = status;
      });
      return {
        ...prev,
        [activeUser.id]: userStates
      };
    });

    addLog(activeUser.name, 99, status ? 'ACTIVADO' : 'DESACTIVADO'); // level 99 representing master toggling
    triggerNotification(`${status ? 'Acceso total concedido' : 'Acceso total revocado'} para todos los niveles.`);
  };

  const addLog = (user: string, level: number, status: 'ACTIVADO' | 'DESACTIVADO') => {
    const newLog: AccessLog = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user,
      level,
      status
    };
    setLogs(prev => [newLog, ...prev.slice(0, 7)]);
  };

  const triggerNotification = (msg: string, type: 'success' | 'warn' = 'success') => {
    setNotification({ show: true, msg, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const filteredUsers = SYSTEM_USERS.filter(u => {
    return u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
           u.controlNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Header section with brand */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-red-950/20 via-[#1a1111]/30 to-transparent border border-red-500/25 shadow-xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="bg-red-500/10 text-red-400 font-mono text-[9px] font-black px-2.5 py-1 rounded border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
              <Shield size={11} /> Control de Accesos
            </span>
            <span className="text-white/40 text-[10px] font-mono">• SEGURIDAD Y PERMISOS IA</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tight">
            Restricciones & Accesos Curriculares
          </h2>
          <p className="text-xs text-white/50 max-w-2xl leading-relaxed">
            Consola directiva que regula los niveles de libre navegación de la Planeación de los Alumnos y Docentes. Habilita o restringe el acceso al siguiente nivel de su Workbook o planeación educativa de manera personalizada.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-[200] max-w-sm px-5 py-4 rounded-2xl bg-[#091515] border border-emerald-500/40 text-white shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black block">Operación Exitosa</span>
              <p className="text-xs font-bold text-white/80 mt-0.5 leading-normal">{notification.msg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: User Selector List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-black/40 border border-white/5 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#DEFF9A] flex items-center gap-2">
              <Users size={14} /> Seleccionar Usuario
            </h3>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, matrícula o rol..."
                className="w-full bg-white/[0.02] border border-white/5 text-xs text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#DEFF9A]/30 focus:bg-white/[0.04] transition-all font-medium placeholder:text-white/20"
              />
            </div>

            {/* List of filtered users */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isSelected = user.id === selectedUserId;
                  const unlockedCount = Object.values(globalAccessStates[user.id] || {}).filter(Boolean).length;
                  
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setSelectedLevelId(1); // resett to one for simplicity
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                        isSelected 
                          ? 'bg-[#DEFF9A]/5 border-[#DEFF9A]/20 text-white shadow-[0_5px_15px_rgba(0,0,0,0.2)]' 
                          : 'bg-white/[0.01] border-white/5 text-white/60 hover:bg-white/[0.03] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {user.photo ? (
                          <img 
                            src={user.photo} 
                            alt={user.name} 
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" 
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                            {user.name.slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className={`text-xs font-black truncate ${isSelected ? 'text-[#DEFF9A]' : 'text-white'}`}>{user.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-mono text-white/30 uppercase font-black">{user.controlNumber}</span>
                            <span className={`text-[8px] font-sans font-bold px-1.5 py-0.5 rounded leading-none ${
                              user.role === 'DOCENTE' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-cyan-500/10 text-cyan-400'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-bold text-white/40 block">Niveles Libres</span>
                        <span className="text-xs font-black text-[#DEFF9A] block mt-0.5">{unlockedCount} / 18</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-white/30 text-xs">
                  Ningún usuario coincide con la búsqueda
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Stats module */}
          <div className="bg-black/30 border border-white/5 rounded-3xl p-5 space-y-4">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Activity size={12} /> Resumen Operativo
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl text-left">
                <span className="text-[9px] font-mono text-white/40 uppercase font-bold tracking-wider">Último Desbloqueo</span>
                <p className="text-xs font-black text-[#DEFF9A] mt-1">Elena Vasquez</p>
                <span className="text-[9px] text-white/20 font-mono">Semana 3</span>
              </div>
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl text-left">
                <span className="text-[9px] font-mono text-white/40 uppercase font-bold tracking-wider">Modificaciones</span>
                <p className="text-xs font-black text-[#DEFF9A] mt-1">11 Cambios</p>
                <span className="text-[9px] text-white/20 font-mono">Esta Semana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Level dropdown menu and next-level switch toggles */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-8">
            
            {/* Selected User Header Card */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                {activeUser.photo ? (
                  <img 
                    src={activeUser.photo} 
                    alt={activeUser.name} 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-[#DEFF9A]/20" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-sm font-black border border-white/10 shrink-0">
                    {activeUser.name.slice(0, 2)}
                  </div>
                )}
                <div>
                  <span className="text-[9px] font-mono text-[#DEFF9A] font-black uppercase tracking-widest block">Usuario Bajo Inspección:</span>
                  <h3 className="text-base font-black text-white uppercase tracking-tight mt-0.5">{activeUser.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-white/40">
                    <span className="font-mono font-bold">{activeUser.email}</span>
                    <span>•</span>
                    <span className="font-sans font-bold">{activeUser.level}</span>
                  </div>
                </div>
              </div>

              {/* Master Control Toggles */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <button
                  onClick={() => handleToggleAll(true)}
                  className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 hover:bg-[#DEFF9A]/20 text-[#DEFF9A] text-[9.5px] font-mono font-black uppercase tracking-wider transition-all"
                >
                  Permitir Todo
                </button>
                <button
                  onClick={() => handleToggleAll(false)}
                  className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[9.5px] font-mono font-black uppercase tracking-wider transition-all"
                >
                  Bloquear Todo
                </button>
              </div>
            </div>

            {/* Selector: TOTAL DE LOS NIVELES DE LA PLANEACIÓN (18 Levels Dropdown & Options Menu) */}
            <div className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-[#DEFF9A]/60 block mb-2">
                  Menú de Niveles Totales de la Planeación (Selecciona un nivel):
                </label>
                
                {/* Horizontal slider or elegant custom select dropdown */}
                <div className="relative">
                  <select
                    value={selectedLevelId}
                    onChange={(e) => setSelectedLevelId(Number(e.target.value))}
                    className="w-full bg-[#080d12] border border-white/10 text-white font-sans text-xs md:text-sm font-black uppercase tracking-wider rounded-2xl py-4.5 px-5 outline-none appearance-none cursor-pointer focus:border-[#DEFF9A]/40 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-no-repeat bg-[right_1.25rem_center]"
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")` }}
                  >
                    {PLANNING_LEVELS.map((level) => {
                      const isActive = !!userAccess[level.id];
                      return (
                        <option 
                          key={level.id} 
                          value={level.id}
                          className="bg-[#080d12] text-white py-2 font-bold"
                        >
                          {level.name} — {level.unit} [{isActive ? 'HABILITADO' : 'CORTE DE SINTONÍA'}]
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Grid of quick choices of the 18 levels for direct tactile control */}
              <div className="space-y-2 text-left">
                <span className="text-[9.5px] font-mono font-bold text-white/30 uppercase tracking-widest">Atajos rápidos de Mapeo Curricular (18 Niveles):</span>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 pt-1">
                  {PLANNING_LEVELS.map((level) => {
                    const isSelected = level.id === selectedLevelId;
                    const isActive = !!userAccess[level.id];
                    return (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevelId(level.id)}
                        className={`py-2 rounded-xl text-[10px] font-mono font-black transition-all relative overflow-hidden flex flex-col items-center justify-center border ${
                          isSelected
                            ? 'bg-[#DEFF9A] border-[#DEFF9A] text-black shadow-[0_0_15px_rgba(222,255,154,0.3)]'
                            : isActive
                              ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/15 text-[#DEFF9A] hover:bg-[#DEFF9A]/20'
                              : 'bg-white/[0.01] border-white/5 text-white/20 hover:bg-white/5'
                        }`}
                      >
                        <span>{level.id}</span>
                        <div className={`w-1 h-1 rounded-full absolute bottom-1 ${
                          isSelected 
                            ? 'bg-black' 
                            : isActive 
                              ? 'bg-[#DEFF9A]' 
                              : 'bg-transparent'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom Interactive Module for Access Controls */}
            {/* Displays properties of Selected level + Action Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Card A: Selected Level details */}
              <div className="bg-[#080d1c]/80 border border-white/5 rounded-2xl p-5 flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black uppercase text-[#DEFF9A] tracking-wider flex items-center gap-1">
                      <BookOpen size={12} /> Nivel Seleccionado
                    </span>
                    <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded ${
                      isSelectedLevelActive ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isSelectedLevelActive ? 'HABILITADO' : 'PENDIENTE'}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">
                      {PLANNING_LEVELS[selectedLevelId - 1].unit}
                    </h4>
                    <p className="text-[11px] text-white/50 leading-relaxed mt-1">
                      {PLANNING_LEVELS[selectedLevelId - 1].topic}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-1 bg-black/10 p-2.5 rounded-xl">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">KPI Evaluativo:</span>
                  <p className="text-[10.5px] font-semibold text-white/80">{PLANNING_LEVELS[selectedLevelId - 1].kpi}</p>
                </div>

                {/* Switch for Current Selected Level */}
                <button
                  onClick={handleToggleLevel_Current}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                    isSelectedLevelActive
                      ? 'bg-red-500/10 border-red-500/25 hover:bg-red-500/20 text-red-400'
                      : 'bg-[#DEFF9A]/10 border-[#DEFF9A]/15 hover:bg-[#DEFF9A]/20 text-[#DEFF9A]'
                  }`}
                >
                  {isSelectedLevelActive ? <Lock size={13} /> : <Unlock size={13} />}
                  {isSelectedLevelActive ? 'Bloquear Este Nivel' : 'Desbloquear Este Nivel'}
                </button>
              </div>

              {/* Card B: Next Level progressive access controller (VINCULADO AL SIGUIENTE NIVEL) */}
              <div className="bg-[#0b1218] border border-[#DEFF9A]/15 rounded-2xl p-5 flex flex-col justify-between text-left space-y-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/2 rounded-full filter blur-[40px] pointer-events-none" />
                
                <div className="space-y-2.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black uppercase text-[#DEFF9A] tracking-wider flex items-center gap-1.5">
                      <Sliders size={12} className="text-[#DEFF9A]" /> Control del Siguiente Nivel
                    </span>
                    {nextLevelId && (
                      <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded ${
                        isNextLevelActive ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'bg-white/5 text-white/30'
                      }`}>
                        NIVEL {nextLevelId}
                      </span>
                    )}
                  </div>

                  {nextLevelId ? (
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">
                        {PLANNING_LEVELS[nextLevelId - 1].unit}
                      </h4>
                      <p className="text-[11px] text-white/50 leading-relaxed mt-1">
                        Eje: {PLANNING_LEVELS[nextLevelId - 1].topic}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-black text-white/30 uppercase tracking-tight">
                        Límite Curricular
                      </h4>
                      <p className="text-[11px] text-white/30 leading-relaxed mt-1">
                        Se ha alcanzado la semana final (Nivel 18) de la planeación autorizada. No hay nivel siguiente adicional.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-left leading-relaxed text-white/60 relative z-10">
                  El sistema bloqueará o liberará el acceso a la semana siguiente de manera autoritaria. El estudiante recibirá una alerta IA en tiempo real.
                </div>

                {nextLevelId ? (
                  <button
                    onClick={handleToggleLevel_Next}
                    className={`w-full py-4 px-5 rounded-xl font-mono text-[10.5px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-md relative z-10 ${
                      isNextLevelActive
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-[#DEFF9A] hover:bg-[#cbf572] text-black shadow-[0_5px_15px_rgba(222,255,154,0.15)]'
                    }`}
                  >
                    {isNextLevelActive ? <Lock size={14} /> : <Unlock size={14} />}
                    {isNextLevelActive ? 'DESACTIVAR ACCESO AL SIGTE NIVEL' : 'ACTIVAR ACCESO AL SIGTE NIVEL'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 px-5 rounded-xl bg-white/5 border border-white/5 text-white/20 text-[10.51px] font-mono font-black uppercase tracking-widest cursor-not-allowed select-none flex items-center justify-center gap-2"
                  >
                    <Lock size={14} /> No Disponible
                  </button>
                )}
              </div>
            </div>

            {/* Custom Interactive Audits Logs list for Directives */}
            <div className="pt-4 border-t border-white/5 space-y-3.5 text-left">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Clock size={12} /> Registro de Cambios De Acceso Recientes
              </h4>
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center text-xs p-3 rounded-xl bg-white/[0.01] border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'ACTIVADO' ? 'bg-[#DEFF9A]' : 'bg-red-500'}`} />
                      <p className="font-bold text-white/80">
                        Se {log.status.toLowerCase()} el acceso a {log.level === 99 ? 'todos los niveles' : `Nivel ${log.level}`} para <span className="text-[#DEFF9A] font-black">{log.user}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-white/30">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
