import { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  Cpu, 
  Layers, 
  Terminal, 
  ArrowUpRight, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface SystemNode {
  name: string;
  status: 'ONLINE' | 'ACTIVE' | 'SYNCING' | 'WARN';
  qps: number;
  latency: number;
}

interface LiveLog {
  id: string;
  time: string;
  severity: 'INFO' | 'SUCCESS' | 'WARN' | 'CRIT';
  module: string;
  message: string;
}

export function RealTimeMonitorPanel() {
  const [ping, setPing] = useState<number>(34);
  const [isPinging, setIsPinging] = useState(false);
  const [uptime, setUptime] = useState('02d:14h:32m:10s');
  const [logs, setLogs] = useState<LiveLog[]>([
    { id: '1', time: '17:31:02', severity: 'INFO', module: 'AUTH', message: 'Sesión iniciada por Dir. Hub TECLINGO' },
    { id: '2', time: '17:31:45', severity: 'SUCCESS', module: 'FOLIOS', message: 'Folio oficial #29481-B impreso electrónicamente' },
    { id: '3', time: '17:32:10', severity: 'SUCCESS', module: 'GRADES', message: 'Prof. Pedro S. guardó actas de examen extraordinario' },
    { id: '4', time: '17:33:05', severity: 'SUCCESS', module: 'SCHEDULES', message: 'Parrilla oficial sincronizada con el motor de asignación' },
    { id: '5', time: '17:34:11', severity: 'WARN', module: 'SYNC', message: 'Reintento de sincronización de nodo secundario exitosa' }
  ]);

  const [nodes, setNodes] = useState<SystemNode[]>([
    { name: 'Gateway Principal', status: 'ONLINE', qps: 45, latency: 12 },
    { name: 'Motor de Horarios Inteligente', status: 'ACTIVE', qps: 18, latency: 45 },
    { name: 'Base de Datos (Firestore Sync)', status: 'ONLINE', qps: 124, latency: 8 },
    { name: 'Canal de Notificaciones PUSH', status: 'SYNCING', qps: 3, latency: 130 },
  ]);

  // Simulate updating uptime and ping live
  useEffect(() => {
    const timer = setInterval(() => {
      // Latency simulation
      setPing(prev => {
        const offset = Math.floor(Math.random() * 9) - 4;
        const next = prev + offset;
        return next < 10 ? 12 : next > 120 ? 32 : next;
      });

      // Update seconds of Uptime
      const now = new Date();
      const secs = String(now.getSeconds()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const hrs = String(now.getHours()).padStart(2, '0');
      setUptime(`02d:${hrs}h:${mins}m:${secs}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate incoming live activity logs
  useEffect(() => {
    const logPool = [
      { severity: 'INFO' as const, module: 'USERS', message: 'Docente ingresó al libro virtual para registrar avances' },
      { severity: 'SUCCESS' as const, module: 'LIBRARY', message: 'Unidad de estudio "Álgebra Lineal Avanzada" consultada' },
      { severity: 'SUCCESS' as const, module: 'GROUPS', message: 'Sincronización de cupos completada para Grupo A1-102' },
      { severity: 'WARN' as const, module: 'SECURITY', message: 'Intento de escritura bloqueado en módulo de folios (Solo Director)' },
      { severity: 'INFO' as const, module: 'BI', message: 'Reporte académico BI descargado en formato CSV' },
      { severity: 'SUCCESS' as const, module: 'CLASS', message: 'Auto-avance de reloj horario activó unidad de lección #4' }
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];
      const newLog: LiveLog = {
        id: String(Date.now()),
        time: timeString,
        severity: randomLog.severity,
        module: randomLog.module,
        message: randomLog.message
      };

      setLogs(prev => [newLog, ...prev.slice(0, 8)]);
      
      // Randomly update node latency / QPS
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          qps: Math.max(2, node.qps + Math.floor(Math.random() * 11) - 5),
          latency: Math.max(4, node.latency + Math.floor(Math.random() * 7) - 3)
        }))
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const triggerManualDiagnostics = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPing(12);
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];
      setLogs(prev => [
        {
          id: String(Date.now()),
          time: timeString,
          severity: 'SUCCESS',
          module: 'DIAG',
          message: 'Diagnóstico recursivo general completado con éxito (0 fallas)'
        },
        ...prev
      ]);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">
            Hacker-Engine Control Panel
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            REAL-TIME <span className="text-cyan-400">TELEMETRY</span>
          </h1>
        </div>

        <button 
          onClick={triggerManualDiagnostics}
          disabled={isPinging}
          className="flex items-center gap-2 bg-[#DEFF9A] text-[#061a1a] shadow-[0_0_25px_rgba(222,255,154,0.3)] px-5 py-3 rounded-full font-black uppercase text-[9px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={isPinging ? 'animate-spin' : ''} />
          {isPinging ? 'Analizando...' : 'Ejecutar Diagnóstico'}
        </button>
      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="!p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-cyan-400 p-2 rounded-xl bg-white/5">
            <Activity size={18} className="animate-pulse" />
          </div>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Latencia de Red</p>
          <h3 className="text-3xl font-black text-white tracking-tighter mt-2">{ping} <span className="text-xs text-cyan-400">ms</span></h3>
          <p className="text-[9px] text-[#DEFF9A] uppercase font-bold tracking-wider mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#DEFF9A] rounded-full animate-ping" /> Canal seguro SSL TLS_1.3
          </p>
        </GlassCard>

        <GlassCard className="!p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-[#DEFF9A] p-2 rounded-xl bg-white/5">
            <Wifi size={18} />
          </div>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Uptime del Servidor</p>
          <h3 className="text-3xl font-black text-white tracking-tighter mt-2 font-mono">{uptime}</h3>
          <p className="text-[9px] text-white/30 uppercase font-medium mt-1">Zonas de replicación activas</p>
        </GlassCard>

        <GlassCard className="!p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-amber-400 p-2 rounded-xl bg-white/5">
            <Cpu size={18} />
          </div>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Carga de Procesador</p>
          <h3 className="text-3xl font-black text-white tracking-tighter mt-2">14.2%</h3>
          <p className="text-[9px] text-cyan-400 uppercase font-black mt-1">Óptimo • 16 núcleos lógicos</p>
        </GlassCard>

        <GlassCard className="!p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-pink-400 p-2 rounded-xl bg-white/5">
            <Layers size={18} />
          </div>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Sistemas Conectados</p>
          <h3 className="text-3xl font-black text-white tracking-tighter mt-2">10 / 10</h3>
          <p className="text-[9px] text-[#DEFF9A] uppercase font-black mt-1">Integración ERP fluida</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ACTIVE RUNNING NODES */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.25em]">Sincronización de Nodos Activa</h3>
          <div className="space-y-4">
            {nodes.map((node) => (
              <div key={node.name}>
                <GlassCard className="!p-5 hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{node.name}</h4>
                      <div className="flex gap-4 mt-1">
                        <p className="text-[10px] text-white/40">Latencia: <b className="text-cyan-400">{node.latency} ms</b></p>
                        <p className="text-[10px] text-white/40">Frecuencia: <b className="text-[#DEFF9A]">{node.qps} RQS</b></p>
                      </div>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-wider ${
                      node.status === 'ONLINE' || node.status === 'ACTIVE'
                        ? 'bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20'
                        : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* CYBER TELEMETRY LIVE STREAM */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.25em]">Registro de Actividad en Vivo (Terminal)</h3>
            <div className="flex items-center gap-1 text-[8px] font-black uppercase text-cyan-400 tracking-widest animate-pulse">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /> LIVE FEED
            </div>
          </div>

          <GlassCard className="!p-6 bg-black/60 border-white/5 font-mono text-xs text-white/80 space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-[10px] text-white/30 uppercase font-black">
              <Terminal size={12} className="text-cyan-400" /> consola de eventos centralizada
            </div>
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 hover:bg-white/5 pl-1 py-1 rounded transition-colors"
                  >
                    <span className="text-cyan-500 shrink-0 text-[10px]">{log.time}</span>
                    <span className={`text-[9px] font-bold px-1 rounded uppercase tracking-wider shrink-0 text-center min-w-[55px] ${
                      log.severity === 'SUCCESS' ? 'text-[#DEFF9A] bg-[#DEFF9A]/10 border border-[#DEFF9A]/20' :
                      log.severity === 'WARN' ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' :
                      log.severity === 'CRIT' ? 'text-red-400 bg-red-400/10 border border-red-400/20' :
                      'text-blue-400 bg-blue-400/10 border border-blue-400/20'
                    }`}>
                      {log.module}
                    </span>
                    <p className="text-white/70 leading-relaxed break-all tracking-tight sm:tracking-normal">{log.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
