/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Volume2, 
  Terminal, 
  Sliders, 
  CheckCircle2, 
  Database, 
  Eye, 
  ArrowRight, 
  Shield, 
  Activity, 
  Info,
  Layers,
  ChevronLeft,
  Settings,
  MessageSquare,
  LayoutDashboard,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../GlassCard';

interface AvatarModeConfig {
  id: 'modo_onboarding' | 'modo_clase_teorica' | 'modo_correccion' | 'modo_asistencia_directiva';
  name: string;
  description: string;
  behavior: string;
  emocion: string;
  gesto: string;
  tono_voz: string;
  velocidadDefault: string;
  pilarAplicado: string;
  pilarDescripcion: string;
  color: string;
  radarStats: { listening: number; grammar: number; speaking: number; comprehension: number };
}

const MODES: AvatarModeConfig[] = [
  {
    id: 'modo_onboarding',
    name: 'Modo Onboarding',
    description: 'Entrevista de ADN Académico Inicial',
    behavior: 'Empático, paciente, recopilador de datos, estilo "entrevista de ADN".',
    emocion: 'Compasiva y Escucha Activa',
    gesto: 'Pulsos suaves de color verde esmeralda y contacto visual virtual estable.',
    tono_voz: 'Acogedor, pausado, volumen medio-alto para reforzar la confianza del alumno.',
    velocidadDefault: '0.60',
    pilarAplicado: 'Listening Lab & Starter Intake',
    pilarDescripcion: 'Guía inicial al ingresar por primera vez. Mide la percepción inicial sin intimidar.',
    color: '#10B981',
    radarStats: { listening: 40, grammar: 35, speaking: 30, comprehension: 50 }
  },
  {
    id: 'modo_clase_teorica',
    name: 'Modo Clase Teórica',
    description: 'Impartición Curricular Rigurosa',
    behavior: 'Académico, preciso, directo, uso de terminología técnica según el MCER (Marco Común Europeo).',
    emocion: 'Analítica e Instructiva',
    gesto: 'Estructura geométrica en constante rotación orbital, focalización del espectro auditivo.',
    tono_voz: 'Formal, modulado, enfocado en la correcta fonética y entonación.',
    velocidadDefault: '0.88',
    pilarAplicado: 'Ecosistema de Laboratorios Curriculares',
    pilarDescripcion: 'Explica gramática profunda y vocabulario contextualizado con rigor académico.',
    color: '#8B5CF6',
    radarStats: { listening: 80, grammar: 90, speaking: 75, comprehension: 85 }
  },
  {
    id: 'modo_correccion',
    name: 'Modo Corrección / Grammar Fixer',
    description: 'Laboratorio de Diagnóstico Activo',
    behavior: 'Constructivo, enfoque en "Grammar Fixer", tono motivacional pero riguroso.',
    emocion: 'Firme pero Alentadora (Feedback Positivo)',
    gesto: 'Oscilaciones dinámicas que marcan los fonemas incorrectos en rojo y verde.',
    tono_voz: 'Persuasivo, empático, con acentuación marcada en áreas de corrección inmediata.',
    velocidadDefault: '0.75',
    pilarAplicado: 'SafeZone & The Bridge',
    pilarDescripcion: 'Corrige errores al vuelo eliminando el filtro afectivo y el miedo al error público.',
    color: '#EAB308',
    radarStats: { listening: 70, grammar: 85, speaking: 80, comprehension: 75 }
  },
  {
    id: 'modo_asistencia_directiva',
    name: 'Modo Asistencia Directiva',
    description: 'Academic Audit & Executive Mode',
    behavior: 'Ejecutivo, proactivo, sintético, enfocado en el "Academic Audit Controller".',
    emocion: 'Resolutiva, Profesional y de Alto Nivel',
    gesto: 'Matriz compacta de datos técnicos con flujos horizontales limpios y rápidos.',
    tono_voz: 'Objetivo, veloz, con terminología de BI (Business Intelligence) y dirección institucional.',
    velocidadDefault: '1.00',
    pilarAplicado: 'Command Center Directores',
    pilarDescripcion: 'Presenta gráficos de la Skill Mastery Matrix de manera ejecutiva y simplificada.',
    color: '#DEFF9A',
    radarStats: { listening: 95, grammar: 95, speaking: 95, comprehension: 95 }
  }
];

const MASTER_JSON_TEMPLATE = {
  "protocolo_avatar": {
    "modo_onboarding": "Empático, paciente, recopilador de datos, estilo 'entrevista de ADN'.",
    "modo_clase_teorica": "Académico, preciso, directo, uso de terminología técnica según el MCER.",
    "modo_correccion": "Constructivo, enfoque en 'Grammar Fixer', tono motivacional pero riguroso.",
    "modo_asistencia_directiva": "Ejecutivo, proactivo, sintético, enfocado en el 'Academic Audit Controller'."
  },
  "reglas_generales": {
    "estilo_visual": "Dark Engineering (minimalista, tecnológico, sin distracciones)",
    "feedback_usuario": "Siempre confirmar que los datos se están guardando en el PDP (Personal Development Plan)."
  }
};

export function AvatarMatrix({ onClose }: { onClose: () => void }) {
  const [selectedMode, setSelectedMode] = useState<AvatarModeConfig>(MODES[0]);
  const [velocity, setVelocity] = useState<string>(MODES[0].velocidadDefault);
  const [promptText, setPromptText] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [pdpStatus, setPdpStatus] = useState<string | null>(null);
  const [interactionResult, setInteractionResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Initialize console logs
  useEffect(() => {
    addLog(`[MASTER_ORCHESTRATOR]: Configuración cargada mediante "Dark Engineering Protocol".`);
    addLog(`[SYSTEM_PROMPT_MAESTRO]: Avatar inicializado en modo: ${MODES[0].name}.`);
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setConsoleLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 8)]);
  };

  const handleModeChange = (modeItem: AvatarModeConfig) => {
    setSelectedMode(modeItem);
    setVelocity(modeItem.velocidadDefault);
    setInteractionResult(null);
    setPdpStatus(null);
    addLog(`[TRANSLATOR]: Protocolo ajustado a [${modeItem.id.toUpperCase()}].`);
    addLog(`[ACCION]: Render dinámico cargado exitosamente. Emoción: "${modeItem.emocion}".`);
    addLog(`[LISTEN_SPEED]: Velocidad ideal para alumno calibrada en ${modeItem.velocidadDefault}x.`);
  };

  const triggerSimulation = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setInteractionResult(null);
    setPdpStatus(null);
    
    addLog(`[ORCHESTRATOR]: Procesando solicitud con Avatar de IA en "${selectedMode.name}"...`);

    setTimeout(() => {
      let result = '';
      if (selectedMode.id === 'modo_onboarding') {
        result = `[AVATAR ONBOARDING]: "¡Me encanta conocerte! Qué gran pasatiempo es ese. No te preocupes por equivocarte, estoy aquí para guiarte paso a paso. Cuéntame con calma, ¿cómo es tu día a día?"`;
      } else if (selectedMode.id === 'modo_clase_teorica') {
        result = `[AVATAR ACADÉMICO]: "Bajo la norma del MCER B1, el tiempo verbal 'Past Perfect' requiere el auxiliar 'HAD' + verbo en participio regular o irregular. Analicemos la estructura sintáctica: S + HAD + V-ed/3rd-col."`;
      } else if (selectedMode.id === 'modo_correccion') {
        result = `[AVATAR GRAMMAR FIXER]: "Buen esfuerzo con tu pronunciación, pero noté una leve desviación en el fonema /v/ en 'very'. Recuerda colocar tus dientes superiores sobre tu labio inferior. ¡Inténtalo de nuevo!"`;
      } else {
        result = `[AVATAR EJECUTIVO]: "Control Académico de Teclingo AI reporta un avance del 94.2% en Skill Mastery general de la sección A1. Propongo acelerar la validación de folios para optimizar la retención."`;
      }

      setInteractionResult(result);
      setIsProcessing(false);
      addLog(`[SYSTEM_PROMPT_MAESTRO]: Respuesta sintetizada mediante ${selectedMode.name}.`);

      // Confirm user PDP sync triggers automatically as defined in regras_generales
      setTimeout(() => {
        setPdpStatus("✅ Sincronizado en PDP (Personal Development Plan)");
        addLog(`[PDP_CONTROLLER]: Datos guardados y consolidados exitosamente en el PDP del expediente.`);
      }, 600);

    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040d0e]/95 backdrop-blur-xl overflow-y-auto font-sans text-left">
      <div className="min-hidden w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* HEADER AREA */}
        <header className="border-b border-white/5 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded bg-[#DEFF9A]/20 border border-[#DEFF9A]/30 text-[#DEFF9A] font-mono text-[9px] font-black uppercase tracking-widest">Master Tool v2.1</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
                Matriz de Comportamiento / <span className="text-[#DEFF9A]">Avatar AI</span>
              </h1>
              <p className="text-white/40 text-[10px] md:text-xs font-medium">
                Regulación de gestualidad, entonación de sonido y protocolo de prompt adaptativo del tutor virtual inteligente.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-2.5 rounded-full text-[10px] font-mono text-white/60 uppercase">
            <Cpu size={14} className="text-[#DEFF9A] animate-spin" style={{ animationDuration: '3s' }} />
            <span>Core Orquestador Activo</span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT 5 GRAPHIC GRID SPACES: DYNAMIC RENDERING WIDGETS */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            
            {/* AVATAR INTERACTIVE VISUAL CONTAINER */}
            <div className="p-8 rounded-[3rem] bg-[#061415] border border-white/5 flex flex-col items-center justify-between min-h-[380px] shadow-2xl relative overflow-hidden text-center group">
              <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/30 tracking-tight select-none">
                AVATAR_RENDER_ENGINE_V2_PRO
              </div>

              {/* Decorative scan line */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#DEFF9A]/30 to-transparent shadow-[0_0_8px_#DEFF9A] pointer-events-none animate-pulse" />

              <div className="space-y-1 mb-4">
                <span className="text-[10px] font-mono text-white/40 font-black uppercase tracking-widest block">EMOCIÓN ACTUAL:</span>
                <span className="text-sm font-sans font-bold text-white uppercase tracking-tight block px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                  {selectedMode.emocion}
                </span>
              </div>

              {/* MAIN GRAPHIC AVATAR WIREFRAME CYBER RENDER */}
              <div className="relative w-40 h-40 flex items-center justify-center my-6">
                
                {/* Glowing decorative rings */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/5 animate-spin" style={{ animationDuration: '40s' }} />
                <div className="absolute -inset-4 rounded-full border border-white/[0.02] animate-spin" style={{ animationDuration: '60s', animationDirection: 'reverse' }} />
                
                {/* Dynamically Styled Animated Inner Ring based on color of selected mode */}
                <motion.div 
                  animate={{
                    scale: selectedMode.id === 'modo_onboarding' ? [1, 1.12, 1] :
                           selectedMode.id === 'modo_clase_teorica' ? [1, 1.05, 1.1, 1] :
                           selectedMode.id === 'modo_correccion' ? [1, 1.15, 0.95, 1] : [1, 1.08, 1],
                    rotate: [0, 180, 360],
                    borderColor: [selectedMode.color, `${selectedMode.color}50`, selectedMode.color]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-2 rounded-full border-2 border-double flex items-center justify-center p-3"
                  style={{ borderColor: selectedMode.color }}
                >
                  
                  {/* Dynamic Inner Graphics representing the different state shapes */}
                  {selectedMode.id === 'modo_onboarding' && (
                    <motion.svg 
                      animate={{ scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      viewBox="0 0 100 100" className="w-16 h-16" fill="none"
                    >
                      <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
                      <path d="M35,45 Q40,40 45,45" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M55,45 Q60,40 65,45" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M35,62 Q50,75 65,62" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                    </motion.svg>
                  )}

                  {selectedMode.id === 'modo_clase_teorica' && (
                    <motion.svg 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      viewBox="0 0 100 100" className="w-16 h-16" fill="none"
                    >
                      <polygon points="50,15 80,75 20,75" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round" />
                      <circle cx="50" cy="55" r="15" stroke="#8B5CF6" strokeWidth="1.5" />
                      <line x1="50" y1="5" x2="50" y2="95" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" />
                    </motion.svg>
                  )}

                  {selectedMode.id === 'modo_correccion' && (
                    <motion.svg 
                      animate={{ 
                        strokeWidth: [1.5, 3, 1.5],
                        scale: [1, 1.08, 0.95, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      viewBox="0 0 100 100" className="w-18 h-18" fill="none"
                    >
                      <path d="M15,50 Q30,20 50,50 T85,50" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="33" cy="40" r="2" fill="#EAB308" />
                      <circle cx="67" cy="40" r="2" fill="#EAB308" />
                      <path d="M40,65 H60" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
                    </motion.svg>
                  )}

                  {selectedMode.id === 'modo_asistencia_directiva' && (
                    <motion.svg 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1 }}
                      viewBox="0 0 100 100" className="w-16 h-16" fill="none"
                    >
                      <rect x="20" y="20" width="60" height="60" rx="4" stroke="#DEFF9A" strokeWidth="2" />
                      <line x1="30" y1="40" x2="70" y2="40" stroke="#DEFF9A" strokeWidth="2" />
                      <line x1="30" y1="50" x2="60" y2="50" stroke="#DEFF9A" strokeWidth="1.5" />
                      <line x1="30" y1="60" x2="50" y2="60" stroke="#DEFF9A" strokeWidth="1" />
                      <circle cx="70" cy="60" r="4" fill="#DEFF9A" />
                    </motion.svg>
                  )}

                </motion.div>

                {/* Cyber HUD Status lines around avatar sphere */}
                <div className="absolute top-2 left-2 flex flex-col items-start font-mono text-[7px] text-[#DEFF9A] opacity-60">
                  <span>SGN: SECURE</span>
                  <span>HZ: 440HZ</span>
                </div>
                <div className="absolute bottom-2 right-2 flex flex-col items-end font-mono text-[7px] text-white/30">
                  <span>RES: HD</span>
                  <span>SYNC: OK</span>
                </div>
              </div>

              {/* GESTO DESCRIPTION AND CURRENT COMPILER STATE */}
              <div className="space-y-2 w-full">
                <div className="p-3 bg-black/40 border border-white/5 rounded-2xl">
                  <div className="flex justify-between items-center mb-1 text-[8px] font-mono text-white/30">
                    <span>SEÑAL DE RETOALIMENTACIÓN VISUAL (GESTO):</span>
                    <span className="text-[#DEFF9A]">ONLINE</span>
                  </div>
                  <p className="text-[10px] text-white/70 font-sans tracking-wide leading-relaxed">
                    {selectedMode.gesto}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 px-1">
                  <span className="text-[9px] font-mono text-white/30 uppercase">Velocidad del Audio:</span>
                  <div className="flex items-center gap-1.5 bg-black/45 px-2.5 py-1 rounded-xl border border-white/5">
                    <Volume2 size={12} className="text-white/40" />
                    <span className="text-xs font-mono font-black text-[#DEFF9A]">{velocity}x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE REAL-TIME TELEMETRY LOGS */}
            <div className="p-6 rounded-[2rem] bg-black/50 border border-white/5 text-left font-mono">
              <div className="flex items-center gap-2 mb-3">
                <Terminal size={14} className="text-[#DEFF9A] animate-pulse" />
                <span className="text-[9.5px] font-black uppercase tracking-widest text-[#DEFF9A]">Telemetry Console Logs</span>
              </div>
              <div className="space-y-1.5 h-36 overflow-y-auto pr-2 custom-scrollbar text-[9px] text-white/40">
                {consoleLogs.map((log, index) => (
                  <p key={index} className={`truncate leading-relaxed ${index === 0 ? 'text-white/80 font-bold' : ''}`}>
                    {log}
                  </p>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 7 GRID SPACES: CONTROLLER CONTROLS & TEST GATEWAY */}
          <div className="col-span-12 lg:col-span-7 space-y-6">

            {/* AVATAR MODE SELECTION PANEL */}
            <GlassCard title="Configuración de Protocolo: Prompt Maestro" icon={Sliders} accent="green">
              <p className="text-white/40 text-[10.5px] leading-relaxed mb-6 font-sans">
                Selecciona un modo de comportamiento para ordenar al avatar cambiar de emoción, vocabulario, velocidad lingüística y gestualidad para responder con el tono correspondiente.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MODES.map((modeItem) => {
                  const isSelected = selectedMode.id === modeItem.id;
                  return (
                    <button
                      key={modeItem.id}
                      onClick={() => handleModeChange(modeItem)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                        isSelected 
                          ? 'bg-white/5 text-white shadow-xl' 
                          : 'bg-black/20 text-white/60 border-white/[0.02] hover:bg-white/[0.02]'
                      }`}
                      style={{ borderColor: isSelected ? modeItem.color : 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="text-xs font-extrabold tracking-tight uppercase" style={{ color: isSelected ? modeItem.color : 'white' }}>
                          {modeItem.name}
                        </h4>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: modeItem.color }} />
                        )}
                      </div>
                      <p className="text-[10px] text-white/30 group-hover:text-white/40 font-semibold mb-2">
                        {modeItem.description}
                      </p>
                      <p className="text-[10px] text-white/50 leading-relaxed font-sans font-medium italic">
                        "{modeItem.behavior}"
                      </p>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* DYNAMIC PILLAR INTERACTIVE SIMULATOR */}
            <div className="p-8 rounded-[3rem] bg-[#051112] border border-[#DEFF9A]/10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles size={20} className="text-[#DEFF9A]/20" />
              </div>

              <div>
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-mono font-black uppercase tracking-widest text-[#DEFF9A]">
                  Pilar de Origen: {selectedMode.pilarAplicado}
                </span>
                <h3 className="text-base font-black text-white uppercase tracking-tight mt-2.5">
                  Probar Adaptabilidad en Laboratorio
                </h3>
                <p className="text-white/40 text-[10.5px] leading-relaxed mt-1 font-sans">
                  {selectedMode.pilarDescripcion} Inserta una frase de ejemplo o usa el botón directo para iniciar y ver cómo responde el avatar de manera autónoma.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2.5">
                  <input 
                    type="text" 
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder={
                      selectedMode.id === 'modo_onboarding' ? 'Ej. "Hola, me da un poco de pena hablar en inglés..."' :
                      selectedMode.id === 'modo_clase_teorica' ? 'Ej. "¿Me explicas el Past Perfect por favor?"' :
                      selectedMode.id === 'modo_correccion' ? 'Ej. "I had write a very good essay yesterday."' :
                      'Ej. "¿Cómo va el avance del grupo de sistemas?"'
                    }
                    className="flex-1 px-4 py-3.5 bg-black/55 border border-white/10 rounded-2xl text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#DEFF9A] font-sans"
                  />
                  
                  <button 
                    onClick={triggerSimulation}
                    disabled={isProcessing}
                    className="px-6 py-3.5 rounded-2xl bg-[#DEFF9A] text-[#061a1a] text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all select-none cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-40"
                  >
                    {isProcessing ? 'SINTETIZANDO...' : (
                      <>
                        <Play size={14} fill="currentColor" />
                        PROCESAR IA
                      </>
                    )}
                  </button>
                </div>

                {/* INTERACTIVE PRESETS TO CHOOSE FROM */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-[8px] font-mono text-white/30 uppercase my-auto">Sugerir texto:</span>
                  <button 
                    onClick={() => setPromptText(
                      selectedMode.id === 'modo_onboarding' ? 'Hola, soy alumno de sistemas y quiero aprender.' :
                      selectedMode.id === 'modo_clase_teorica' ? '¿Cuándo se usa HAD?' :
                      selectedMode.id === 'modo_correccion' ? 'I feel very happy very very good!' :
                      'Dame un reporte ejecutivo de los folios.'
                    )}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-bold text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    Autocompletar Frase Ideal
                  </button>
                </div>
              </div>

              {/* SIMULATION VISUAL ANSWER DISPLAY */}
              <AnimatePresence mode="wait">
                {(interactionResult || isProcessing) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 relative overflow-hidden"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3 py-3">
                        <div className="w-5 h-5 rounded-full border-2 border-[#DEFF9A] border-t-transparent animate-spin shrink-0" />
                        <span className="text-xs font-mono text-[#DEFF9A]/75 animate-pulse uppercase tracking-widest">Sincronizando orquestación con traductor avatar...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center text-[8px] font-mono">
                          <span className="text-white/35 uppercase">RESPUESTA FILTRADA POR PROMPT MAESTRO</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/10">SÍNTESIS EXITOSA</span>
                        </div>
                        
                        <p className="text-xs text-white/95 font-sans italic leading-relaxed pl-3 border-l-2 border-[#DEFF9A]">
                          {interactionResult}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30">
                            <Info size={12} />
                            <span>Tono de Voz: <strong className="text-white/60">{selectedMode.tono_voz}</strong></span>
                          </div>

                          {/* PDP SYNCRONIZATION ALERT */}
                          {pdpStatus && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-sans text-[10px] font-bold"
                            >
                              <Database size={10} className="text-[#DEFF9A]" />
                              <span>{pdpStatus}</span>
                            </motion.div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DESIGN SYSTEM SPECIFICATION ACCORDION CARD / FOOTER BLUEPRINT */}
            <div className="p-6 rounded-[2rem] bg-black/30 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-amber-500/70" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/60">Avatar JSON Protocol Blueprint (Master System State)</span>
                </div>
                <span className="text-[8px] font-mono text-white/20">JSON FORMAT</span>
              </div>
              
              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[9px] text-white/70 overflow-x-auto text-left leading-normal">
                <pre>{JSON.stringify(MASTER_JSON_TEMPLATE, null, 2)}</pre>
              </div>

              <div className="flex items-center gap-2.5 text-[8.5px] font-mono text-white/40 leading-normal">
                <Shield size={12} className="text-[#DEFF9A]/60 flex-shrink-0" />
                <span>
                  <strong>Atención de Seguridad</strong>: Este protocolo orquesta todas las instancias de los modelos Gemini para que adapten rigurosamente el estilo 'Dark Engineering' sin saturar variables, mitigando la reticencia y asegurando un confort cognitivo supremo.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
