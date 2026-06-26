/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  Trophy, 
  Zap, 
  Lock,
  Flag,
  Award,
  Sparkles,
  ChevronUp,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface Node {
  id: string;
  label: string;
  type: 'CLASS' | 'EXAM' | 'MILESTONE' | 'PIONEER';
  status: 'COMPLETED' | 'PENDING' | 'LOCKED';
  week: number;
  description?: string;
  speakingAccuracy?: number;
}

const mapData: Node[] = [
  { id: '1', label: 'Start Nexus', type: 'MILESTONE', status: 'COMPLETED', week: 1, description: 'Protocolo de inducción TECLINGO.' },
  { id: '2', label: 'AI Fundamentals', type: 'CLASS', status: 'COMPLETED', week: 2, description: 'Redes neuronales y procesamiento de lenguaje.', speakingAccuracy: 7.8 },
  { id: '3', label: 'Projet Bravo', type: 'EXAM', status: 'COMPLETED', week: 3, description: 'Certificación inicial de fundamentos AI.', speakingAccuracy: 8.5 },
  { id: '4', label: 'Mission Dallas VIP', type: 'CLASS', status: 'PENDING', week: 4, description: 'Construcción de narrativa compleja.' },
  { id: '5', label: 'Knowledge Pulse', type: 'CLASS', status: 'PENDING', week: 5, description: 'Desafío en tiempo real en The Bridge.' },
  { id: '6', label: 'Examen Maestro', type: 'EXAM', status: 'LOCKED', week: 6, description: 'Validación de autoridad académica.' },
  { id: '7', label: 'Elite Summit', type: 'MILESTONE', status: 'LOCKED', week: 7, description: 'Cumbre de Excelencia Académica.' },
];

export function ProgressMap() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Set initial scroll to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Calculate rotation based on mouse position (-1 to 1)
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative h-full flex flex-col overflow-hidden bg-[#0A0D10]"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Galactic Base */}
        <div className="absolute inset-x-0 -bottom-[100%] h-[300%] bg-[#0A0D10]" />
        
        {/* Layer 1: Metal Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Layer 2: 3D Grid Path Floor */}
        <div 
          className="absolute inset-x-0 -bottom-[50%] h-[200%] opacity-[0.12] transition-transform duration-100 ease-out"
          style={{ 
            backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.2) 1px, transparent 1px)`,
            backgroundSize: '120px 120px',
            transform: `perspective(1000px) rotateX(${60 + mousePos.y * 5}deg) rotateY(${mousePos.x * 2}deg) translateY(${scrollY * 0.15}px)`,
            transformOrigin: 'center center'
          }} 
        />

        {/* Technical Schematics Decoration */}
        <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none overflow-hidden">
           <div className="absolute top-[10%] left-[5%] w-96 h-64 border border-[#38BDF8]/20 p-4 font-mono text-[6px] text-[#38BDF8] whitespace-pre-wrap leading-tight italic">
              {`// AI FUNDAMENTALS MODULE\n// PROTOCOL: NEURAL_SYNC_v4\n\nif (knowledge >= threshold) {\n  execute_ascension();\n  sync_profile(docente_id);\n}\n\n// MAPPING_LOG: ${new Date().toISOString()}`}
           </div>
           <div className="absolute top-[40%] right-[10%] opacity-40">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                 <circle cx="200" cy="200" r="180" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="10 10" />
                 <circle cx="200" cy="200" r="100" stroke="#38BDF8" strokeWidth="1" />
                 <path d="M 200 20 L 200 380 M 20 200 L 380 200" stroke="#38BDF8" strokeWidth="0.5" />
                 <text x="210" y="40" fill="#38BDF8" fontSize="8" fontWeight="bold">UPPER_TIER</text>
              </svg>
           </div>
           <div className="absolute top-[70%] left-[15%] w-64 h-64 border border-[#DEFF9A]/10 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-dashed border-[#DEFF9A]/5 rounded-full animate-spin-slow" />
           </div>
        </div>
      </div>

      {/* Start Nexus Marker */}
      <div className="absolute top-32 left-16 z-30 pointer-events-none">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           className="flex flex-col items-center gap-6"
         >
            <div className="w-40 h-40 relative">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border border-dashed border-[#38BDF8]/30 rounded-full" 
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-4 border border-[#38BDF8]/20 rounded-full" 
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-[#38BDF8] rounded-full blur-[40px] opacity-10" />
                  <Target size={48} className="text-[#38BDF8] drop-shadow-[0_0_15px_#38BDF8]" />
               </div>
            </div>
            <div className="text-center">
               <h4 className="text-[#38BDF8] text-[10px] font-black uppercase tracking-[0.4em] mb-1">START NEXUS</h4>
               <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest italic">INICIAR EL CAMINO</p>
            </div>
         </motion.div>
      </div>

      {/* Goal Arch Marker */}
      <div className="absolute top-32 right-32 z-30 pointer-events-none hidden xl:block">
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           className="flex flex-col items-center gap-6"
         >
            <div className="w-48 h-32 relative">
               <div className="absolute inset-0 border-t-2 border-x-2 border-[#DEFF9A]/40 rounded-t-full" />
               <div className="absolute inset-0 flex items-center justify-center -translate-y-4">
                  <div className="w-32 h-32 bg-[#DEFF9A] rounded-full blur-[60px] opacity-10" />
                  <Trophy size={64} className="text-[#DEFF9A] drop-shadow-[0_0_20px_#DEFF9A]" />
               </div>
               <motion.div 
                 animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute -top-6 left-1/2 -translate-x-1/2"
               >
                  <Sparkles size={32} className="text-[#DEFF9A]" />
               </motion.div>
            </div>
            <div className="text-center">
               <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-1">GOAL ARCH</h4>
               <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest italic">FINAL DEL SEMESTRE</p>
            </div>
         </motion.div>
      </div>

      <header className="relative z-40 p-12 pb-0">
        <h2 className="text-[#38BDF8] text-[10px] font-black uppercase tracking-[0.6em] mb-2">ASCENSIÓN ÉLITE</h2>
        <h1 className="text-5xl font-black text-white bevel-text uppercase tracking-tighter italic">MISSION MAP</h1>
      </header>

      {/* LCD Status Tracker */}
      <div className="absolute top-12 right-12 z-[60]">
        <motion.div className="bg-black/60 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="space-y-0.5">
            <p className="text-[#38BDF8] text-[8px] font-black uppercase tracking-[0.4em]">Protocolo Actual</p>
            <p className="text-white text-[14px] font-black tracking-tight font-mono uppercase italic">ESTATUS: SEMANA 4</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#38BDF8] shadow-[0_0_20px_#38BDF8] animate-pulse" />
        </motion.div>
      </div>

      {/* 3D Path Ascension Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar relative z-30 pt-96"
      >
        <div 
          className="relative max-w-5xl mx-auto h-[4000px] flex flex-col items-center gap-40 transition-all duration-300 transform-gpu"
          style={{ 
            perspective: '1500px',
            transform: `rotateX(${20 + mousePos.y * 10}deg) rotateY(${mousePos.x * 5}deg)`,
            transformOrigin: 'top center'
          }}
        >
          {/* Central Neural Backbone */}
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-[#38BDF8]/40 via-[#38BDF8]/10 to-transparent shadow-[0_0_15px_#38BDF840]" />

          {mapData.map((node, index) => {
            const isCompleted = node.status === 'COMPLETED';
            const isActive = node.status === 'PENDING';
            const isLocked = node.status === 'LOCKED';

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex items-center w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Node & Content Link Line */}
                <div className={`w-1/2 h-[2px] bg-gradient-to-r ${index % 2 === 0 ? 'from-transparent to-[#38BDF8]/20' : 'from-[#38BDF8]/20 to-transparent'}`} />

                {/* Main Node */}
                <div className="relative group mx-8">
                   {/* Glow Aura */}
                   <div className={`absolute -inset-12 blur-[60px] opacity-10 rounded-full transition-opacity duration-700 ${
                     isCompleted ? 'bg-[#4ADE80]' : isActive ? 'bg-[#38BDF8] opacity-20' : 'bg-white/5'
                   }`} />

                   <motion.button
                     whileHover={{ scale: 1.1, rotateZ: index % 2 === 0 ? 5 : -5 }}
                     className={`relative w-40 h-40 rounded-[3rem] border-2 flex items-center justify-center transition-all duration-700 shadow-2xl ${
                       isCompleted ? 'bg-[#4ADE80]/10 border-[#4ADE80] text-[#4ADE80]' :
                       isActive ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] ring-4 ring-[#38BDF8]/20' :
                       'bg-black/60 border-white/10 text-white/10'
                     }`}
                   >
                     {node.type === 'MILESTONE' && <Flag size={48} />}
                     {node.type === 'CLASS' && <Zap size={48} />}
                     {node.type === 'EXAM' && <Award size={48} />}
                     {isLocked && <Lock size={20} className="absolute -top-2 -right-2 bg-black rounded-full p-2 border border-white/20" />}
                     
                     <div className="absolute -bottom-16 w-64 text-center">
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${
                          isCompleted ? 'text-[#4ADE80]' : isActive ? 'text-[#38BDF8]' : 'text-white/10'
                        }`}>SEMANA {node.week}</p>
                        <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">{node.label}</h3>
                     </div>
                   </motion.button>

                   {/* Detail Popover */}
                   <div className={`absolute top-1/2 -translate-y-1/2 w-64 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-50 ${
                     index % 2 === 0 ? 'left-[120%]' : 'right-[120%]'
                   }`}>
                      <div className="neo-glass bg-[#061a1a]/95 border border-[#38BDF8]/30 p-6 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                         <h4 className="text-white text-sm font-black uppercase italic mb-2">{node.label}</h4>
                         <p className="text-white/40 text-[10px] font-medium leading-relaxed italic mb-4">{node.description}</p>
                         {node.speakingAccuracy && (
                            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Speaking Accuracy</span>
                               <span className="text-sm font-black text-[#DEFF9A]">{node.speakingAccuracy}</span>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="w-1/2" />
              </motion.div>
            );
          })}

          <div className="py-64 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                <ChevronUp className="animate-bounce" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 mt-4">Destino Dallas VIP</p>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 w-full h-[600px] bg-gradient-to-b from-[#0A0D10] via-[#0A0D10]/80 to-transparent" />
        <div className="absolute bottom-0 w-full h-[600px] bg-gradient-to-t from-[#0A0D10] to-transparent" />
      </div>
    </div>
  );
}
