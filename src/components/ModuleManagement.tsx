/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  Unlock, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Users, 
  GraduationCap, 
  Layout, 
  Eye, 
  EyeOff, 
  Sparkles,
  Search,
  BookOpen,
  Stamp,
  HelpCircle,
  Play,
  Globe,
  Layers,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, UserRole } from '../context/AppContext';
import { GlassCard } from './GlassCard';

export function ModuleManagement() {
  const { 
    managementEnabled, 
    setManagementEnabled, 
    coursesEnabled, 
    setCoursesEnabled,
    foliosEnabled,
    setFoliosEnabled,
    identityEnabled,
    setIdentityEnabled,
    reticularEnabled,
    setReticularEnabled,
    distributionEnabled,
    setDistributionEnabled,
    currentRole 
  } = useAppContext();

  // Test playground states
  const [testUserRole, setTestUserRole] = useState<UserRole>('DIRECTOR');
  const [testViewId, setTestViewId] = useState<string>('groups');
  const [testResult, setTestResult] = useState<{
    success: boolean;
    reason: string;
    log: string[];
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Lists of affected views for academic and administrative modules
  const academicViews = [
    { id: 'teachers', name: 'Plantilla Docente', description: 'Registro de profesores, cualificaciones y asignaciones.', icon: GraduationCap },
    { id: 'groups', name: 'Grados y Grupos', description: 'Coordinación de grupos de estudio y asignaturas.', icon: Users },
    { id: 'gestor-horarios', name: 'Horarios Tecnun', description: 'Parrilla semanal oficial de asignaciones académicas.', icon: Sliders },
    { id: 'biblioteca', name: 'Biblioteca Directiva', description: 'Repositorio de recursos literarios y lingüísticos.', icon: BookOpen },
    { id: 'reticula', name: 'Estructura Reticular', description: 'Control de planes, mallas y carreras curriculares.', icon: Layers },
    { id: 'distribucion', name: 'Distribución Académica', description: 'Visualización y distribución de plantilla docente.', icon: BarChart3 }
  ];

  const managementViews = [
    { id: 'operations', name: 'Operations Control Center', description: 'Monitoreo técnico de solicitudes y telemetría de red.', icon: Layout },
    { id: 'audit', name: 'Auditoría Académica (Search)', description: 'Búsqueda expedita de historiales e inscripciones.', icon: Search },
    { id: 'folios', name: 'Gestión Folios', description: 'Control de circulares oficiales y firmas digitales directivas.', icon: Stamp },
    { id: 'identity', name: 'Identidad Institucional', description: 'Configuración estelar de nombre, logotipo, slogan y datos.', icon: Globe }
  ];

  // Helper check for diagnostic simulation
  const checkAccess = (role: UserRole, viewId: string): { success: boolean; reason: string; logs: string[] } => {
    const logs: string[] = [];
    logs.push(`Comenzando validación de acceso para Rol: [${role}] en Ruta: [${viewId}]`);

    // 1. Check if view-id belongs to Academic module and if it is disabled
    const isAcademicView = academicViews.some(v => v.id === viewId);
    if (isAcademicView) {
      logs.push(`-> Detectada ruta asociada al [MÓDULO ACADÉMICO / CURSOS]`);
      if (!coursesEnabled) {
        logs.push(`❌ El [MÓDULO ACADÉMICO] se encuentra desactivado globalmente por la Feature Flag.`);
        return { 
          success: false, 
          reason: 'Módulo Académico Desactivado', 
          logs 
        };
      }
      logs.push(`✅ Validación de Feature Flag de Cursos superada.`);
    }

    // 2. Check if view-id belongs to Management module and if it is disabled
    const isManagementView = managementViews.some(v => v.id === viewId);
    if (isManagementView) {
      logs.push(`-> Detectada ruta asociada al [MÓDULO ADMINISTRATIVO / MANAGEMENT]`);
      if (!managementEnabled) {
        logs.push(`❌ El [MÓDULO DE GESTIÓN (MANAGEMENT)] se encuentra desactivado globalmente por la Feature Flag.`);
        return { 
          success: false, 
          reason: 'Módulo de Dirección / Gestión Desactivado', 
          logs 
        };
      }
      logs.push(`✅ Validación de Feature Flag de Gestión superada.`);
    }

    // Specific sub-feature flags dynamic checks:
    if (viewId === 'folios') {
      logs.push(`-> Verificando Sub-módulo: [Gestión Folios]`);
      if (!foliosEnabled) {
        logs.push(`❌ El sub-módulo de [GESTIÓN FOLIOS] se encuentra desactivado en el Servidor.`);
        return { success: false, reason: 'Gestión Folios Desactivado', logs };
      }
      logs.push(`✅ Sub-módulo de Gestión Folios se encuentra ACTIVO.`);
    }

    if (viewId === 'reticula') {
      logs.push(`-> Verificando Sub-módulo: [Estructura Reticular]`);
      if (!reticularEnabled) {
        logs.push(`❌ El sub-módulo de [ESTRUCTURA RETICULAR] se encuentra desactivado en el Servidor.`);
        return { success: false, reason: 'Estructura Reticular Desactivada', logs };
      }
      logs.push(`✅ Sub-módulo de Estructura Reticular se encuentra ACTIVO.`);
    }

    if (viewId === 'distribucion') {
      logs.push(`-> Verificando Sub-módulo: [Distribución Académica]`);
      if (!distributionEnabled) {
        logs.push(`❌ El sub-módulo de [DISTRIBUCIÓN ACADÉMICA] se encuentra desactivado en el Servidor.`);
        return { success: false, reason: 'Distribución Académica Desactivada', logs };
      }
      logs.push(`✅ Sub-módulo de Distribución Académica se encuentra ACTIVO.`);
    }

    if (viewId === 'identity') {
      logs.push(`-> Verificando Sub-módulo: [Identidad Institucional]`);
      if (!identityEnabled) {
        logs.push(`❌ El sub-módulo de [IDENTIDAD INSTITUCIONAL] se encuentra desactivado en el Servidor.`);
        return { success: false, reason: 'Identidad Institucional Desactivada', logs };
      }
      logs.push(`✅ Sub-módulo de Identidad Institucional se encuentra ACTIVO.`);
    }

    // 3. RBAC checks based on current requested view
    if (viewId === 'folios' || viewId === 'operations' || viewId === 'audit' || viewId === 'identity') {
      logs.push(`-> Verificando autorizaciones jerárquicas operacionales.`);
      if (role !== 'DIRECTOR') {
        logs.push(`❌ Acceso RECHAZADO: Rol [${role}] no posee jerarquía suficiente para operaciones de Dirección.`);
        return {
          success: false,
          reason: 'Falta de Privilegios Administrativos (RBAC)',
          logs
        };
      }
      logs.push(`✅ Rol [Director] verificado por el controlador de acceso.`);
    }

    logs.push(`🎉 Acceso Concedido con éxito. Iniciando renderizado de la interfaz.`);
    return {
      success: true,
      reason: 'Acceso Autorizado',
      logs
    };
  };

  const handleRunDiagnosticTest = () => {
    setIsSimulating(true);
    setTestResult(null);

    // Simulate database lookup delays
    setTimeout(() => {
      const evaluation = checkAccess(testUserRole, testViewId);
      setTestResult({
        success: evaluation.success,
        reason: evaluation.reason,
        log: evaluation.logs
      });
      setIsSimulating(false);
    }, 800);
  };

  // Check if non-director user tries to bypass
  if (currentRole !== 'DIRECTOR') {
    return (
      <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 py-20">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-bounce mb-2">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-black uppercase text-white tracking-tighter">Acceso de Seguridad Restringido</h2>
        <p className="max-w-md text-white/40 text-xs font-bold leading-normal uppercase tracking-wider">
          Lo sentimos, solo los usuarios con el rol de <span className="text-red-400 font-extrabold">Director</span> están facultados para modificar, auditar o consultar el panel de Feature Flags (Gestión de Módulos).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Intro Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-[#38BDF8] uppercase tracking-[0.3em] flex items-center gap-1.5">
            <Sliders size={12} className="text-[#38BDF8]" /> CONFIGURACIÓN CRÍTICA DEL SISTEMA
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Gestión de Módulos (Feature Flags)
          </h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider leading-relaxed max-w-2xl">
            Regula la disponibilidad de las herramientas operativas en tiempo real. Esta configuración modifica de forma centralizada la experiencia del usuario final, ocultando o mostrando las respectivas secciones del menú principal.
          </p>
        </div>
        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest font-black leading-none shrink-0 self-center">
          Persistente 💾
        </span>
      </div>

      {/* Main Flags Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Toggle Panel: DIRECCIÓN / MANAGEMENT */}
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-black/40 flex flex-col justify-between space-y-6 relative overflow-hidden group">
          {/* Glowing element in background */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 blur-[40px] pointer-events-none transition-all duration-500 ${managementEnabled ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${managementEnabled ? 'bg-[#38BDF8]/10 border-[#38BDF8]/20 text-[#38BDF8]' : 'bg-white/5 border-white/5 text-white/20'} border transition-colors`}>
                  {managementEnabled ? <Lock size={20} /> : <Unlock size={20} />}
                </div>
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-tight">
                     Módulo Dirección (Management)
                  </h3>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">
                     Feature Key: <span className="text-[#38BDF8]">teclingo_management_enabled</span>
                  </span>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => setManagementEnabled(!managementEnabled)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${managementEnabled ? 'bg-[#38BDF8]' : 'bg-white/10'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 rounded-full bg-[#061a1a] shadow-[0_2px_5px_rgba(0,0,0,0.4)]"
                  animate={{ x: managementEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <p className="text-[10px] text-white/40 uppercase font-black tracking-wider leading-relaxed">
              Consiste en las herramientas administrativas exclusivas del personal líder. Incluye control de operaciones, generador y auditoría de documentos firmados digitalmente (folios oficiales) y visualización de telemetría institucional.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
              Vistas asociadas deshabilitadas ante desactivación:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {managementViews.map(view => (
                <div key={view.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <view.icon size={12} className="text-white/40" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">{view.name}</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${managementEnabled ? 'text-[#38BDF8] bg-[#38BDF8]/10' : 'text-red-400 bg-red-400/10'}`}>
                    {managementEnabled ? 'Visible' : 'Desactivado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Panel: ACADÉMICO / COURSES */}
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-black/40 flex flex-col justify-between space-y-6 relative overflow-hidden group">
          {/* Glowing element in background */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[40px] pointer-events-none transition-all duration-500 ${coursesEnabled ? 'opacity-100' : 'opacity-0'}`} />

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${coursesEnabled ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/20 text-[#DEFF9A]' : 'bg-white/5 border-white/5 text-white/20'} border transition-colors`}>
                  {coursesEnabled ? <BookOpen size={20} /> : <EyeOff size={20} />}
                </div>
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-tight">
                     Módulo Académico (Courses)
                  </h3>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">
                     Feature Key: <span className="text-[#DEFF9A]">teclingo_courses_enabled</span>
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => setCoursesEnabled(!coursesEnabled)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${coursesEnabled ? 'bg-[#DEFF9A]' : 'bg-white/10'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 rounded-full bg-[#061a1a] shadow-[0_2px_5px_rgba(0,0,0,0.4)]"
                  animate={{ x: coursesEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <p className="text-[10px] text-white/40 uppercase font-black tracking-wider leading-relaxed">
              Consiste en los módulos interactivos enfocados en estudiantes y profesores. Administra la biblioteca de recursos, el listado de docentes certificados, y la parrilla interactiva oficial de horarios semanales y calendarizaciones.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
              Vistas asociadas deshabilitadas ante desactivación:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {academicViews.map(view => (
                <div key={view.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <view.icon size={12} className="text-white/40" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">{view.name}</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${coursesEnabled ? 'text-[#DEFF9A] bg-[#DEFF9A]/10' : 'text-red-400 bg-red-400/10'}`}>
                    {coursesEnabled ? 'Visible' : 'Desactivado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Panel: GESTIÓN DE FOLIOS */}
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-black/40 flex flex-col justify-between space-y-6 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 blur-[40px] pointer-events-none transition-all duration-500 ${foliosEnabled ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${foliosEnabled ? 'bg-[#38BDF8]/10 border-[#38BDF8]/20 text-[#38BDF8]' : 'bg-white/5 border-white/5 text-white/20'} border transition-colors`}>
                  <Stamp size={20} />
                </div>
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-tight">
                     1. Gestión de Folios
                  </h3>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">
                     Feature Key: <span className="text-[#38BDF8]">teclingo_folios_enabled</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setFoliosEnabled(!foliosEnabled)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${foliosEnabled ? 'bg-[#38BDF8]' : 'bg-white/10'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 rounded-full bg-[#061a1a]"
                  animate={{ x: foliosEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <p className="text-[10px] text-white/40 uppercase font-black tracking-wider leading-relaxed">
               Consiste en las herramientas de expedición, firma digital con tecnología criptográfica simulada y resguardo de folios oficiales.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
              Vistas asociadas deshabilitadas ante desactivación:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Stamp size={12} className="text-white/40" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">Gestión Folios</span>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${foliosEnabled ? 'text-[#38BDF8] bg-[#38BDF8]/10' : 'text-red-400 bg-red-400/10'}`}>
                  {foliosEnabled ? 'Visible' : 'Desactivado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Panel: IDENTIDAD INSTITUCIONAL */}
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-black/40 flex flex-col justify-between space-y-6 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] pointer-events-none transition-all duration-500 ${identityEnabled ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${identityEnabled ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white/5 border-white/5 text-white/20'} border transition-colors`}>
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-tight">
                     2. Identidad Institucional
                  </h3>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">
                     Feature Key: <span className="text-amber-500">teclingo_identity_enabled</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setIdentityEnabled(!identityEnabled)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${identityEnabled ? 'bg-amber-500' : 'bg-white/10'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 rounded-full bg-[#061a1a]"
                  animate={{ x: identityEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <p className="text-[10px] text-white/40 uppercase font-black tracking-wider leading-relaxed">
               Consiste en el control del nombre del Hub en tiempo real, cambio de logotipo, dirección regional y slogan corporativo.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
              Vistas asociadas deshabilitadas ante desactivación:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-white/40" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">Identidad Institucional</span>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${identityEnabled ? 'text-amber-500 bg-amber-500/10' : 'text-red-400 bg-red-400/10'}`}>
                  {identityEnabled ? 'Visible' : 'Desactivado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Panel: ESTRUCTURA RETICULAR */}
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-black/40 flex flex-col justify-between space-y-6 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[40px] pointer-events-none transition-all duration-500 ${reticularEnabled ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${reticularEnabled ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/20 text-[#DEFF9A]' : 'bg-white/5 border-white/5 text-white/20'} border transition-colors`}>
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-tight">
                     3. Estructura Reticular
                  </h3>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">
                     Feature Key: <span className="text-[#DEFF9A]">teclingo_reticular_enabled</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setReticularEnabled(!reticularEnabled)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${reticularEnabled ? 'bg-[#DEFF9A]' : 'bg-white/10'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 rounded-full bg-[#061a1a]"
                  animate={{ x: reticularEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <p className="text-[10px] text-white/40 uppercase font-black tracking-wider leading-relaxed">
               Consiste en la edición y carga de mallas curriculares, asignaturas por semestre y planes oficiales de estudio TECNLINGO.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
              Vistas asociadas deshabilitadas ante desactivación:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Layers size={12} className="text-white/40" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">Estructura Reticular</span>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${reticularEnabled ? 'text-[#DEFF9A] bg-[#DEFF9A]/10' : 'text-red-400 bg-red-400/10'}`}>
                  {reticularEnabled ? 'Visible' : 'Desactivado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Panel: DISTRIBUCIÓN ACADÉMICA */}
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-black/40 flex flex-col justify-between space-y-6 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[40px] pointer-events-none transition-all duration-500 ${distributionEnabled ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${distributionEnabled ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/5 text-white/20'} border transition-colors`}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-tight">
                     4. Distribución Académica
                  </h3>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">
                     Feature Key: <span className="text-purple-400">teclingo_distribution_enabled</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setDistributionEnabled(!distributionEnabled)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${distributionEnabled ? 'bg-purple-500' : 'bg-white/10'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 rounded-full bg-[#061a1a]"
                  animate={{ x: distributionEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <p className="text-[10px] text-white/40 uppercase font-black tracking-wider leading-relaxed">
               Consiste en la asignación dinámica de la plantilla docente ante la oferta y demanda de grupos curriculares.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
              Vistas asociadas deshabilitadas ante desactivación:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <BarChart3 size={12} className="text-white/40" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">Distribución Académica</span>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${distributionEnabled ? 'text-purple-400 bg-purple-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {distributionEnabled ? 'Visible' : 'Desactivado'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Feature Flag Diagnostics & Testing Suite */}
      <GlassCard className="p-8 border-cyan-500/15 !bg-black/45">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Suite Side Col Info */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[8px] font-black text-amber-400 uppercase tracking-[0.25em] flex items-center gap-1">
                <Sparkles size={10} className="text-amber-400" /> HERRAMIENTAS DE INTEGRACIÓN
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Simulador de Rutas Protegidas y RBAC
              </h3>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider leading-relaxed">
                Prueba en caliente los mecanismos de seguridad antes de implementarlos formalmente en el servidor central. Comprueba cómo reacciona la Sidebar Dinámica y el router condicional para alumnos, docentes o directores según los interruptores lógicos.
              </p>
            </div>

            {/* Matrix Quick Reference */}
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
              <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Estatus de Módulos (En Tiempo Real)</span>
              <div className="space-y-2 font-mono text-[9px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 uppercase">Dirección (Admin)</span>
                  <span className={`font-black uppercase flex items-center gap-1 ${managementEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                    {managementEnabled ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                    {managementEnabled ? 'ACTIVO' : 'DESACTIVADO'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 uppercase">Académico (Cursos)</span>
                  <span className={`font-black uppercase flex items-center gap-1 ${coursesEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                    {coursesEnabled ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                    {coursesEnabled ? 'ACTIVO' : 'DESACTIVADO'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 uppercase">1. Gestión Folios</span>
                  <span className={`font-black uppercase flex items-center gap-1 ${foliosEnabled ? 'text-[#38BDF8]' : 'text-red-400'}`}>
                    {foliosEnabled ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                    {foliosEnabled ? 'ACTIVO' : 'DESACTIVADO'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 uppercase">2. Identidad Institucional</span>
                  <span className={`font-black uppercase flex items-center gap-1 ${identityEnabled ? 'text-amber-400' : 'text-red-400'}`}>
                    {identityEnabled ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                    {identityEnabled ? 'ACTIVO' : 'DESACTIVADO'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 uppercase">3. Estructura Reticular</span>
                  <span className={`font-black uppercase flex items-center gap-1 ${reticularEnabled ? 'text-[#DEFF9A]' : 'text-red-400'}`}>
                    {reticularEnabled ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                    {reticularEnabled ? 'ACTIVO' : 'DESACTIVADO'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 uppercase">4. Distribución Académica</span>
                  <span className={`font-black uppercase flex items-center gap-1 ${distributionEnabled ? 'text-purple-400' : 'text-red-400'}`}>
                    {distributionEnabled ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                    {distributionEnabled ? 'ACTIVO' : 'DESACTIVADO'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[8px] text-white/30 uppercase tracking-wider font-extrabold italic leading-relaxed">
              💡 Nota: La simulación de enrutador simula con precisión aritmética los roles y restricciones de la plataforma Teclingo AI.
            </p>
          </div>

          {/* Test Sandbox Panel */}
          <div className="lg:col-span-7 bg-black/60 border border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Play size={10} className="text-[#38BDF8]" /> Panel de Diagnóstico Clínico
                </h4>
              </div>

              {/* Param Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest pl-1">Selecciona Rol del Testigo</label>
                  <select
                    value={testUserRole}
                    onChange={(e) => {
                      setTestUserRole(e.target.value as UserRole);
                      setTestResult(null);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-[10px] uppercase font-extrabold text-white tracking-wider outline-none focus:border-[#38BDF8]/50 transition-all cursor-pointer"
                  >
                    <option value="DIRECTOR">Director (Admin)</option>
                    <option value="DOCENTE">Docente</option>
                    <option value="ALUMNO">Alumno</option>
                    <option value="TUTOR">Tutor Familiar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest pl-1">Selecciona Ruta Destino</label>
                  <select
                    value={testViewId}
                    onChange={(e) => {
                      setTestViewId(e.target.value);
                      setTestResult(null);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-[10px] uppercase font-extrabold text-white tracking-wider outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
                  >
                    <optgroup label="Secciones Académicas">
                      {academicViews.map(view => (
                        <option key={view.id} value={view.id}>{view.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Secciones Administrativas">
                      {managementViews.map(view => (
                        <option key={view.id} value={view.id}>{view.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={handleRunDiagnosticTest}
                disabled={isSimulating}
                className="w-full py-4 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/25 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(56,189,248,0.05)] flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    <span>Realizando Dry-Run Computacional...</span>
                  </>
                ) : (
                  <>
                    <Sliders size={12} />
                    <span>Probar Ruta y Consultar Estado de Enrutador</span>
                  </>
                )}
              </button>
            </div>

            {/* Diagnostic Results Display box with animation */}
            <div className="flex-1 min-h-[140px] p-4 bg-black/50 border border-white/5 rounded-2xl flex flex-col justify-between font-mono text-[9px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                {testResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3 h-full flex flex-col justify-between"
                  >
                    <div>
                      {/* Badge status */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[8px] text-white/30 uppercase font-black">Resultado de Simulación Académica</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${testResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'}`}>
                          {testResult.success ? 'ACCESO AUTORIZADO' : 'ACCESO RECEPTADO'}
                        </span>
                      </div>

                      {/* Log Console Output */}
                      <div className="mt-2 space-y-1 max-h-[85px] overflow-y-auto custom-scrollbar pr-1">
                        {testResult.log.map((line, index) => (
                          <p key={index} className={`font-mono text-[8px] leading-relaxed ${line.startsWith('❌') ? 'text-red-400' : line.startsWith('✅') ? 'text-[#DEFF9A]' : 'text-white/40'}`}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[8px] text-white/30">
                      <span>Resultado Diagnóstico: <span className="text-white font-extrabold uppercase shrink-0">{testResult.reason}</span></span>
                      <span>1 ms response</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8 gap-2 my-auto">
                    <HelpCircle size={20} className="text-white/10 animate-pulse" />
                    <p className="text-[8px] font-bold uppercase text-white/30 tracking-widest">Esperando que se ejecute una simulación.</p>
                    <p className="text-[7px] text-white/15 uppercase tracking-wider font-bold">Selecciona rol, módulo de prueba, y presiona el botón superior.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </GlassCard>
    </div>
  );
}
