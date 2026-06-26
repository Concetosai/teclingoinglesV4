/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useSpring, animate } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

interface VoltageMeterProps {
  value: number; // 0 to 100
  isProcessing?: boolean;
}

export function VoltageMeter({ value, isProcessing }: VoltageMeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Smooth value transitions
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 20
  });

  const playSound = (type: 'spark' | 'ping') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'spark') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (type === 'spark' ? 0.1 : 0.5));
    } catch (e) {
      // Audio might be blocked by browser
    }
  };

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        // Random activity during processing
        springValue.set(20 + Math.random() * 60);
        if (Math.random() > 0.8) playSound('spark');
      }, 150);
      return () => clearInterval(interval);
    } else {
      animate(springValue, value, {
        duration: 1.8,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(latest);
        }
      });

      if (value > 0) {
        if (value >= 76) {
          setTimeout(() => playSound('ping'), 800);
        } else {
          setTimeout(() => playSound('spark'), 500);
        }
      }
    }
  }, [value, isProcessing]);

  const getStatus = (v: number) => {
    if (v >= 76) return { label: 'NATIVE MATCH', color: 'text-[#DEFF9A]' };
    if (v >= 41) return { label: 'HIGH PERFORMANCE', color: 'text-yellow-400' };
    return { label: 'KEEP PRACTICING', color: 'text-red-500' };
  };

  const status = getStatus(value);

  // 30 segments for the digital bar
  const segments = Array.from({ length: 30 });

  return (
    <div className="w-full flex flex-col items-center">
       <div className="w-full max-w-2xl px-6 py-10 bg-black/40 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 relative z-10">
             <div className="flex flex-col text-center md:text-left">
                <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                   <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-[#DEFF9A] animate-pulse' : 'bg-white/20'}`} />
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-[.4em]">Phonetic Signature Analysis</span>
                </div>
                <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${status.color}`}>
                   {isProcessing ? 'CALIBRATING AUDIO SPECTROID...' : status.label}
                </h3>
             </div>
             
             <div className="flex items-baseline justify-center md:justify-end gap-2 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                <span className="text-4xl md:text-5xl font-mono font-black text-white italic tabular-nums leading-none">
                  {displayValue.toFixed(1)}
                </span>
                <span className="text-[#DEFF9A] font-black text-lg">%</span>
             </div>
          </div>

          {/* Digital Bars Container */}
          <div className="flex gap-1 md:gap-1.5 h-16 relative z-10">
             {segments.map((_, i) => {
                const threshold = (i / segments.length) * 100;
                const isActive = displayValue >= threshold;
                
                // Color levels (Same as analog)
                // 0-35 (Red), 36-75 (Yellow/Orange), 76-100 (Green)
                let colorClass = 'bg-white/5';
                let glowClass = '';
                
                if (isActive) {
                   if (threshold < 35) {
                      colorClass = 'bg-red-500';
                      glowClass = 'shadow-[0_0_15px_rgba(239,68,68,0.4)]';
                   } else if (threshold < 75) {
                      colorClass = 'bg-yellow-400';
                      glowClass = 'shadow-[0_0_15px_rgba(251,191,36,0.4)]';
                   } else {
                      colorClass = 'bg-[#DEFF9A]';
                      glowClass = 'shadow-[0_0_15px_rgba(222,255,154,0.4)]';
                   }
                }

                return (
                   <motion.div
                      key={i}
                      initial={false}
                      animate={{ 
                        opacity: isActive ? 1 : 0.1,
                        scaleY: isActive && isProcessing ? [1.1, 1] : 1
                      }}
                      transition={{ duration: 0.2, delay: i * 0.01 }}
                      className={`flex-1 rounded-sm ${colorClass} ${glowClass} transition-colors duration-500`}
                   />
                );
             })}
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 border-t border-white/5 pt-6">
             <div className="flex gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Base</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Advanced</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#DEFF9A] shadow-[0_0_8px_rgba(222,255,154,0.5)]" />
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Fluency</span>
                </div>
             </div>
             
             <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEFF9A] animate-pulse" />
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[.2em] whitespace-nowrap">
                   Neural Engine v2.0 • Audio-Sync: OK
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

