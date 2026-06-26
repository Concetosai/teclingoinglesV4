/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Chrome, 
  Terminal, 
  Sparkles,
  Zap,
  Globe,
  LogIn,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPortalProps {
  onLogin: (role: 'DIRECTOR' | 'DOCENTE' | 'ALUMNO') => void;
}

export function AuthPortal({ onLogin }: AuthPortalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simulate auth
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin('ALUMNO'); // Default to Alumno for generic login
    }, 2000);
  };

  const handleDemoMode = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin('ALUMNO'); // Demo takes you to Alumno Dashboard
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#061a1a] flex items-center justify-center overflow-hidden"
    >
      {/* Background 3D Grid */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(222,255,154,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(222,255,154,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DEFF9A]/05 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
         {/* Brand Section */}
         <div className="flex flex-col justify-center space-y-8 order-2 md:order-1">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-[#DEFF9A]/10 border-2 border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] shadow-[0_0_30px_rgba(222,255,154,0.2)]">
                     <Globe size={32} className="animate-spin-slow" />
                  </div>
                  <div>
                     <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">TECLINGO<span className="text-[#DEFF9A]"> PRO 1.1</span></h1>
                     <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Identity & Access Terminal</p>
                  </div>
               </div>
               
               <h2 className="text-white text-3xl font-black uppercase tracking-tight leading-tight">
                  EL INICIO DE TU <br />
                  <span className="text-white/20">MISIÓN LINGÜÍSTICA.</span>
               </h2>
               
               <div className="mt-12 space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                     <Zap size={18} className="text-[#DEFF9A]" />
                     <div>
                        <p className="text-white text-[11px] font-black uppercase tracking-widest">Velocidad Neuronal</p>
                        <p className="text-white/20 text-[9px] font-bold">Procesamiento de lenguaje natural en tiempo real.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                     <Sparkles size={18} className="text-cyan-400" />
                     <div>
                        <p className="text-white text-[11px] font-black uppercase tracking-widest">Inmersión Spatial</p>
                        <p className="text-white/20 text-[9px] font-bold">Realidad aumentada y simulación fonética.</p>
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>

         {/* Form Section */}
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="order-1 md:order-2"
         >
            <div className="neo-glass border-[#DEFF9A]/20 rounded-[3rem] p-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
               {/* Mode Switcher */}
               <div className="flex bg-white/5 p-1.5 rounded-3xl mb-12 relative overflow-hidden">
                  <motion.div 
                    initial={false}
                    animate={{ x: mode === 'login' ? 0 : '100.5%' }}
                    className="absolute inset-y-1.5 left-1.5 w-[48%] bg-[#DEFF9A] rounded-2xl shadow-[0_0_20px_rgba(222,255,154,0.4)]"
                  />
                  <button 
                    onClick={() => setMode('login')}
                    className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'login' ? 'text-[#061a1a]' : 'text-white/40'}`}
                  >
                     <div className="flex items-center justify-center gap-3">
                        <LogIn size={14} /> LOGIN
                     </div>
                  </button>
                  <button 
                    onClick={() => setMode('register')}
                    className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'register' ? 'text-[#061a1a]' : 'text-white/40'}`}
                  >
                     <div className="flex items-center justify-center gap-3">
                        <UserPlus size={14} /> REGISTRO
                     </div>
                  </button>
               </div>

               {/* Google SSO Button */}
               <button className="w-full py-4 rounded-3xl bg-white border border-white flex items-center justify-center gap-4 text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform mb-8 shadow-xl">
                  <Chrome size={20} />
                  Continuar con Google
               </button>

               <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-white/20 text-[8px] font-black uppercase tracking-widest">Ó acceso manual</span>
                  <div className="h-px flex-1 bg-white/10" />
               </div>

               {/* Manual Form */}
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-white/40 text-[9px] font-black uppercase tracking-widest ml-4">Email Corporativo</label>
                     <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#DEFF9A]/40" size={18} />
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rod.mx@tecnolingo.ai"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-medium focus:outline-none focus:border-[#DEFF9A]/50 focus:ring-1 focus:ring-[#DEFF9A]/20 transition-all placeholder:text-white/10"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-white/40 text-[9px] font-black uppercase tracking-widest ml-4">Password</label>
                     <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#DEFF9A]/40" size={18} />
                        <input 
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-medium focus:outline-none focus:border-[#DEFF9A]/50 focus:ring-1 focus:ring-[#DEFF9A]/20 transition-all placeholder:text-white/10"
                        />
                     </div>
                  </div>

                  <button 
                    disabled={isAuthenticating}
                    className="w-full py-6 rounded-3xl bg-[#DEFF9A] text-[#061a1a] text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(222,255,154,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                  >
                     {isAuthenticating ? (
                       <Terminal size={18} className="animate-spin" />
                     ) : (
                       <>
                         {mode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
                         <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                       </>
                     )}
                  </button>
               </form>

               {/* Demo Toggle */}
               <div className="mt-12 text-center">
                  <button 
                    onClick={handleDemoMode}
                    className="group"
                  >
                     <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] group-hover:text-cyan-400 transition-colors">¿Eres visitante? <span className="text-[#DEFF9A] group-hover:text-cyan-400 decoration-[#DEFF9A] underline underline-offset-8">EXPLORAR EN MODO DEMO</span></p>
                  </button>
               </div>
            </div>
         </motion.div>
      </div>

      {/* Footer Legal */}
      <footer className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[8px] font-black text-white/10 uppercase tracking-[0.5em] pointer-events-none">
         <span>Version: Alpha 0.8.2</span>
         <div className="w-1 h-1 rounded-full bg-white/20" />
         <span>© 2026 TECLINGO Protocols</span>
         <div className="w-1 h-1 rounded-full bg-white/20" />
         <span>Secure-Core Enabled</span>
      </footer>
    </motion.div>
  );
}
