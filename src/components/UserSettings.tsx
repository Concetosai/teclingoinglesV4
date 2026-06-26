/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Zap,
  Globe,
  Camera,
  Signature,
  Award,
  FileText,
  Calendar,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Save,
  AlertTriangle,
  Fingerprint,
  QrCode,
  Download,
  Share2,
  Paperclip,
  CheckCircle2,
  Trash2,
  Plus,
  Monitor,
  X,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext, UserRole } from '../context/AppContext';
import { ModuleManagement } from './ModuleManagement';

export function UserSettings({ 
  role, 
  onContactTeacher 
}: { 
  role?: UserRole; 
  onContactTeacher?: (teacherId: string, greeting: string) => void;
}) {
  const { 
    institutionName, 
    setInstitutionName, 
    institutionLogo, 
    setInstitutionLogo,
    maintenanceMode,
    setMaintenanceMode,
    identityEnabled,
    currentRole: contextRole
  } = useAppContext();
  
  const effectiveRole = role || contextRole;
  
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'PERSONAL' | 'PROFESSIONAL' | 'SECURITY' | 'DIGITAL_CARD' | 'MODULES'>(effectiveRole === 'ALUMNO' ? 'PERSONAL' : 'PERSONAL');
  const [isDirty, setIsDirty] = useState(false);

  // States for Advisor booking and Toast status
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  
  // Docente Data (University Style)
  const [teacherData, setTeacherData] = useState({
    name: 'Mtra. Ana López',
    degree: 'Mtra. en Lingüística Aplicada',
    specialties: ['Inglés Académico', 'Filtro Afectivo', 'IA en el Aula'],
    bio: 'Especialista en la enseñanza de segundas lenguas con más de 12 años de trayectoria. Enfocada en la integración de modelos neuronales para la aceleración del aprendizaje.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    email: 'ana.lopez@teclingo.ai',
    employeeId: 'TEA-2026-042',
    curp: 'LOZA850612MDFXXXX',
    phone: '+52 833 456 7890',
    birthDate: '1985-06-12',
    certifications: [
      { id: '1', name: 'TOEFL iBT - 110 pts', date: '2025-01-10' },
      { id: '2', name: 'Cambridge C2 Proficiency', date: '2024-05-22' }
    ]
  });

  // Student Data (Active Learner)
  const [studentData, setStudentData] = useState({
    name: 'Kevin Marshall',
    level: 'Alumno Inmersivo A1',
    bio: 'Estudiante de nivel A1 enfocado en el dominio del idioma inglés a través de laboratorios de IA inmersiva.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    email: 'kevin.marshall@teclingo.ai',
    studentId: 'STU-2026-001',
    curp: 'MARC060515HDFRRL09',
    phone: '+52 833 987 6543',
    birthDate: '2006-05-15'
  });

  const [dirData, setDirData] = useState({
    name: 'Carlos Rodríguez',
    curp: 'RODC780512HDFRR05',
    phone: '+52 833 123 4567',
    birthDate: '1978-05-12',
    bio: 'Apasionado por la tecnología y la educación disruptiva.',
    email: 'carlos.rodriguez@teclingo.ai',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
  });

  const getProfileData = () => {
    if (effectiveRole === 'ALUMNO') {
      return {
        name: studentData.name,
        email: studentData.email,
        curp: studentData.curp,
        phone: studentData.phone,
        avatar: studentData.avatar,
        bio: studentData.bio,
        setName: (name: string) => setStudentData(prev => ({ ...prev, name })),
        setPhone: (phone: string) => setStudentData(prev => ({ ...prev, phone })),
        setBio: (bio: string) => setStudentData(prev => ({ ...prev, bio })),
        setAvatar: (avatar: string) => setStudentData(prev => ({ ...prev, avatar })),
      };
    } else if (effectiveRole === 'DIRECTOR') {
      return {
        name: dirData.name,
        email: dirData.email,
        curp: dirData.curp,
        phone: dirData.phone,
        avatar: dirData.avatar,
        bio: dirData.bio,
        setName: (name: string) => setDirData(prev => ({ ...prev, name })),
        setPhone: (phone: string) => setDirData(prev => ({ ...prev, phone })),
        setBio: (bio: string) => setDirData(prev => ({ ...prev, bio })),
        setAvatar: (avatar: string) => setDirData(prev => ({ ...prev, avatar })),
      };
    } else {
      return {
        name: teacherData.name,
        email: teacherData.email,
        curp: teacherData.curp,
        phone: teacherData.phone,
        avatar: teacherData.avatar,
        bio: teacherData.bio,
        setName: (name: string) => setTeacherData(prev => ({ ...prev, name })),
        setPhone: (phone: string) => setTeacherData(prev => ({ ...prev, phone })),
        setBio: (bio: string) => setTeacherData(prev => ({ ...prev, bio })),
        setAvatar: (avatar: string) => setTeacherData(prev => ({ ...prev, avatar })),
      };
    }
  };

  const profile = getProfileData();

  const [instData, setInstData] = useState({
    name: institutionName,
    slogan: 'Liderando el futuro con Inteligencia Artificial',
    phone: '+52 833 456 7890',
    address: 'Pánuco Hub / Dallas HQ',
    email: 'contacto@teclingo.ai',
    facebook: 'facebook.com/teclingo',
    instagram: 'instagram.com/teclingoaiedu',
    linkedin: 'linkedin.com/company/teclingo'
  });

  const handleSave = () => {
    if (effectiveRole === 'DIRECTOR') {
      setInstitutionName(instData.name);
    }
    setIsDirty(false);
    // Success toast or visual feedback
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 snap-center ${
        activeTab === id ? 'bg-[#38BDF8] text-white shadow-[0_0_20px_#38BDF840]' : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
    </button>
  );

  const DigitalCard = () => (
    <div className="relative group w-full max-w-[340px] sm:max-w-sm mx-auto">
      <motion.div 
        layoutId="digital-card"
        className="aspect-[1.58/1] w-full neo-glass rounded-3xl sm:rounded-[2.5rem] border-white/20 p-4 sm:p-8 flex flex-col justify-between overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      >
        {/* Chips & Textures */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#38BDF8]/10 blur-[40px] sm:blur-[50px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-[#DEFF9A]/5 blur-[30px] sm:blur-[40px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="flex justify-between items-start relative z-10 gap-2">
          <div className="flex gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-black/40 border border-white/20 overflow-hidden shrink-0">
               <img src={profile.avatar} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            <div className="min-w-0 flex-1">
               <h3 className="text-white text-[11px] sm:text-lg font-black tracking-tight leading-none uppercase italic truncate" title={profile.name}>{profile.name}</h3>
               <p className="text-[#38BDF8] text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest mt-1 truncate">{effectiveRole === 'ALUMNO' ? 'Alumno Inmersivo A1' : effectiveRole === 'DIRECTOR' ? 'Director Académico' : teacherData.degree}</p>
               <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                  {(effectiveRole === 'ALUMNO' ? ['Pioneers G1', 'Active Learner'] : effectiveRole === 'DIRECTOR' ? ['Plataforma', 'Gestión'] : teacherData.specialties.slice(0, 2)).map(s => (
                    <span key={s} className="text-[6px] sm:text-[7px] font-black text-white/40 border border-white/10 px-1 sm:px-1.5 py-0.5 rounded bg-white/5 uppercase truncate max-w-[70px]">{s}</span>
                  ))}
               </div>
            </div>
          </div>
          <div className="text-right shrink-0">
             <img src={institutionLogo} className="w-6 h-6 sm:w-8 sm:h-8 ml-auto mb-1 opacity-60" alt="Logo" />
             <p className="text-white/20 text-[6px] sm:text-[8px] font-black uppercase tracking-widest">ID: {effectiveRole === 'ALUMNO' ? 'STU-2026-001' : effectiveRole === 'DIRECTOR' ? 'DIR-2026-001' : teacherData.employeeId}</p>
          </div>
        </div>

        <div className="flex items-end justify-between relative z-10 mt-2">
          <div className="space-y-0.5">
             <p className="text-white/30 text-[6px] sm:text-[8px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Institutional Verification</p>
             <div className="flex items-center gap-1 sm:gap-2">
                <ShieldCheck size={10} className={`${effectiveRole === 'ALUMNO' ? "text-[#22D3EE]" : "text-[#4ADE80]"} sm:size-[14px] shrink-0`} />
                <span className="text-white text-[7px] sm:text-[10px] font-mono tracking-tighter uppercase whitespace-nowrap">{effectiveRole === 'ALUMNO' ? 'VERIFIED STUDENT' : effectiveRole === 'DIRECTOR' ? 'VERIFIED DIRECTOR' : 'VERIFIED DOCENTE ELITE'}</span>
             </div>
          </div>
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-2xl shrink-0">
             <QrCode size={120} className="w-full h-full text-black" />
          </div>
        </div>
      </motion.div>
      
      {/* Decorative background shadow */}
      <div className="absolute -inset-4 bg-[#38BDF8]/5 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-11 pb-16 lg:pb-32 px-1 sm:px-0">
       {/* Sidebar de Navegación Settings */}
       <div className="col-span-12 lg:col-span-3 space-y-4">
          <header className="mb-4 sm:mb-8">
             <h2 className="text-[#38BDF8] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-1 sm:mb-2">Academic Profile</h2>
             <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Configuración</h1>
          </header>
          
          <div className="flex flex-col gap-2">
             {effectiveRole === 'DIRECTOR' && identityEnabled && <TabButton id="IDENTITY" label="Identidad Institucional" icon={Globe} />}
             {effectiveRole === 'DIRECTOR' && <TabButton id="MODULES" label="Gestión de Módulos" icon={Sliders} />}
             <TabButton id="DIGITAL_CARD" label="Digital Card Preview" icon={ShieldCheck} />
             <TabButton id="PERSONAL" label="Identidad & Datos" icon={User} />
             {effectiveRole !== 'ALUMNO' && <TabButton id="PROFESSIONAL" label="Trayectoria & CV" icon={Award} />}
             <TabButton id="SECURITY" label="Seguridad & Acceso" icon={Fingerprint} />
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-black/40 border border-white/10 group overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-3 mb-4">
                <Award className="text-[#38BDF8]" size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Estatus Académico</span>
             </div>
             <p className="text-[20px] font-black text-white mb-1 uppercase tracking-tighter italic">
               {effectiveRole === 'ALUMNO' ? 'ALUMNO INMERSIVO' : 'DOCENTE ELITE'}
             </p>
             <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
               {effectiveRole === 'ALUMNO' 
                 ? 'Nivel A1 validado por TECLINGO AI Dallas Campus.' 
                 : 'Nivel de autoridad académica validado por la institución.'}
             </p>
          </div>
       </div>

       {/* Área de Edición */}
       <div className="col-span-12 lg:col-span-9 space-y-8">
          <AnimatePresence mode="wait">
             {activeTab === 'DIGITAL_CARD' && (
                <motion.div 
                  key="card-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                   <GlassCard title="Credential Preview" icon={ShieldCheck} accent="cyan">
                      <div className="flex flex-col items-center gap-12 py-12">
                         <DigitalCard />
                         <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                               <Download size={14} /> Descargar PDF
                            </button>
                            <button className="flex items-center gap-2 px-8 py-4 bg-[#38BDF8] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(56,189,248,0.4)] hover:scale-105 transition-all">
                               <Share2 size={14} /> Compartir con Alumnos
                            </button>
                         </div>
                         <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest text-center max-w-sm italic">
                            Esta tarjeta sirve como tu identificación oficial ante alumnos de nuevo ingreso y pares académicos.
                         </p>
                      </div>
                   </GlassCard>
                </motion.div>
             )}

             {activeTab === 'PERSONAL' && (
               <motion.div 
                 key="personal"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title="Identidad del Profesional" icon={User} accent="cyan">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Avatar Upload */}
                        <div className="md:col-span-2 flex items-center gap-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                           <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center relative group overflow-hidden">
                              <img src={profile.avatar} className="w-full h-full object-cover" alt="Avatar" />
                              <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                 <Camera size={20} className="text-white" />
                              </button>
                           </div>
                           <div className="flex-1">
                              <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Avatar Profesional</h4>
                              <p className="text-[9px] text-white/30 font-bold mb-4 uppercase tracking-widest">Se sincroniza con la Digital Card y Chats (Máx. 5MB)</p>
                              <button className="px-4 py-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#38BDF8] hover:bg-[#38BDF8]/20 transition-all font-bold">Subir Nueva Foto</button>
                           </div>
                        </div>
 
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Nombre Completo</label>
                           <input 
                            type="text" 
                            value={profile.name} 
                            onChange={(e) => { profile.setName(e.target.value); setIsDirty(true); }}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all italic"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                              Email Institucional <Lock size={10} />
                           </label>
                           <input 
                            type="text" 
                            value={profile.email} 
                            readOnly
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/20 text-xs font-bold outline-none cursor-not-allowed"
                           />
                        </div>
                        <div className="space-y-2 relative">
                           <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                              CURP <Lock size={10} />
                           </label>
                           <input 
                            type="text" 
                            value={`XXXX-XXXX-XXXX-${profile.curp.slice(-4)}`} 
                            readOnly
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/20 text-xs font-bold outline-none cursor-not-allowed"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Teléfono Personal</label>
                           <input 
                            type="text" 
                            value={profile.phone} 
                            onChange={(e) => { profile.setPhone(e.target.value); setIsDirty(true); }}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono"
                           />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Abstract Académico / Bio</label>
                           <textarea 
                            value={profile.bio} 
                            onChange={(e) => { 
                              profile.setBio(e.target.value); 
                              setIsDirty(true); 
                            }}
                            rows={3}
                            placeholder="Resume tu carrera académica..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/60 text-xs font-medium outline-none focus:border-[#38BDF8]/40 transition-all resize-none italic"
                           />
                        </div>

                        {effectiveRole === 'ALUMNO' && (
                          <div className="md:col-span-2 mt-8 p-8 rounded-[3rem] bg-gradient-to-br from-[#DEFF9A]/10 to-transparent border border-[#DEFF9A]/20">
                             <div className="flex items-center justify-between mb-8">
                                <div>
                                   <h4 className="text-[14px] font-black text-white uppercase tracking-tight italic">Docente Asignado</h4>
                                   <p className="text-[9px] text-[#DEFF9A] font-black uppercase tracking-[0.2em] mt-1">Líder de Red de Apoyo</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#DEFF9A] rounded-xl text-[#061a1a] text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_#DEFF9A40]">
                                   <Award size={14} /> DOCENTE ELITE
                                </div>
                             </div>
                             
                             <div className="flex flex-col sm:flex-row items-center gap-8 bg-black/40 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                                <div className="w-20 h-20 rounded-2xl border border-white/10 overflow-hidden shrink-0">
                                   <img src={teacherData.avatar} className="w-full h-full object-cover" alt="Teacher" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                   <h5 className="text-white text-xl font-black uppercase tracking-tighter mb-1">{teacherData.name}</h5>
                                   <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                                      <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">ID: {teacherData.employeeId}</span>
                                      <span className="text-white/10">•</span>
                                      <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">{teacherData.degree}</span>
                                   </div>
                                </div>
                                <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                                   <div className="flex gap-1">
                                      {[1,2,3,4,5].map(i => (
                                        <Zap key={i} size={14} fill={i <= 5 ? "#DEFF9A" : "transparent"} className={i <= 5 ? "text-[#DEFF9A]" : "text-white/10"} />
                                      ))}
                                   </div>
                                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Calificación IA: 9.8</p>
                                </div>
                                
                                <div className="absolute inset-0 bg-gradient-to-r from-[#DEFF9A]/05 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                             </div>
                             
                             <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <button 
                                  onClick={() => {
                                    if (onContactTeacher) {
                                      onContactTeacher(
                                        teacherData.employeeId,
                                        "Hello Teacher Ana, I would like some support with the mandatory subject pronouns, please."
                                      );
                                    }
                                  }}
                                  className="flex-1 py-4 px-6 bg-white/5 border border-white/10 hover:border-[#DEFF9A]/45 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-[#DEFF9A]/5 transition-all flex items-center justify-center gap-2"
                                >
                                   <Mail size={14} /> Contactar Docente
                                </button>
                                <button 
                                  onClick={() => setIsCalendarOpen(true)}
                                  className="flex-1 py-4 px-6 bg-gradient-to-r from-[#38BDF8] to-[#0284c7] border border-[#38BDF8]/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.35)] hover:scale-[1.02] hover:bg-opacity-95 transition-all flex items-center justify-center gap-2"
                                >
                                   <Calendar size={14} /> Agendar Asesoría
                                </button>
                             </div>
                          </div>
                        )}
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'PROFESSIONAL' && (
               <motion.div 
                 key="professional"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title="Trayectoria & Certificaciones" icon={Award} accent="cyan">
                     <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Grado Académico Principal</label>
                              <input 
                               type="text" 
                               value={teacherData.degree} 
                               onChange={(e) => { setTeacherData({...teacherData, degree: e.target.value}); setIsDirty(true); }}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[#DEFF9A] text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all uppercase"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Años de Experiencia</label>
                              <div className="flex items-center gap-4">
                                 <input 
                                  type="number" 
                                  value={12} readOnly 
                                  className="w-24 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all"
                                 />
                                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Años de cátedra</span>
                              </div>
                           </div>
                        </div>

                        {/* Repository of Certifications */}
                        <div className="space-y-6">
                           <div className="flex justify-between items-end">
                              <div>
                                 <h4 className="text-[12px] font-black text-white uppercase tracking-tight">Repositorio de Certificaciones</h4>
                                 <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Respaldo legal de tu formación profesional.</p>
                              </div>
                              <button className="flex items-center gap-2 px-4 py-2 bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#DEFF9A]/20 transition-all">
                                 <Plus size={14} /> Añadir Documento
                              </button>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <AnimatePresence>
                                 {teacherData.certifications.map(cert => (
                                    <motion.div 
                                      key={cert.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group"
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#DEFF9A]">
                                             <FileText size={20} />
                                          </div>
                                          <div>
                                             <p className="text-white text-[10px] font-black uppercase">{cert.name}</p>
                                             <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">VÁLIDO DESDE: {cert.date}</p>
                                          </div>
                                       </div>
                                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                             <Download size={14} />
                                          </button>
                                          <button className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500/40 hover:text-red-500 transition-all">
                                             <Trash2 size={14} />
                                          </button>
                                       </div>
                                    </motion.div>
                                 ))}
                              </AnimatePresence>
                           </div>
                        </div>

                        <div className="p-8 bg-[#38BDF8]/5 border border-[#38BDF8]/20 rounded-[2.5rem] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-full bg-[#38BDF8]/5 -skew-x-12 translate-x-16" />
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-16 h-16 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                                 <Award size={32} />
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-[13px] font-black text-white uppercase tracking-tight italic">Nivel de Excelencia Académica</h4>
                                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-loose">Tu perfil es visible para la Red de Apoyo universitaria.</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-2xl font-black text-[#DEFF9A]">100%</p>
                                 <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Validado</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'SECURITY' && (
               <motion.div 
                 key="security"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title="Protección de Acceso" icon={Lock} accent="orange">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Contraseña Actual</label>
                           <input type="password" value="********" readOnly className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/40 text-xs font-bold outline-none" />
                        </div>
                        <div className="flex items-end">
                           <button className="w-full py-4 rounded-2xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 text-[10px] font-black uppercase tracking-widest text-[#DEFF9A] hover:bg-[#DEFF9A]/10 transition-all">Cambiar Password</button>
                        </div>
                        
                        {effectiveRole === 'ALUMNO' && (
                          <div className="md:col-span-2 space-y-2">
                             <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Token de Acceso Unificado</label>
                             <div className="flex items-center gap-4">
                                <input 
                                  value="ALU-DALLAS-2026-X812-PROTO" 
                                  readOnly 
                                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[#38BDF8] text-xs font-mono font-black outline-none"
                                />
                                <button className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-white/40 hover:text-white transition-all">
                                   <Zap size={18} />
                                </button>
                             </div>
                             <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest mt-2 ml-1">Utiliza este token para vincular dispositivos de inmersión AR externos.</p>
                          </div>
                        )}

                        <div className="md:col-span-2 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-r from-orange-500/05 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                 <Fingerprint size={28} />
                              </div>
                              <div>
                                 <h4 className="text-[13px] font-black text-white uppercase tracking-tight">Acceso Biométrico / 2FA</h4>
                                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                   {effectiveRole === 'ALUMNO' 
                                     ? 'Protege tu identidad inmersiva con FaceID o TouchID en tu dispositivo.' 
                                     : 'Añade una capa extra de protección para tu firma institucional.'}
                                 </p>
                              </div>
                           </div>
                           <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_#F9731680] transition-all relative z-10">Configurar</button>
                        </div>

                        {effectiveRole === 'ALUMNO' && (
                          <div className="md:col-span-2 p-8 bg-black/20 rounded-[2.5rem] border border-white/5">
                             <div className="flex items-center gap-3 mb-6">
                                <Monitor size={18} className="text-white/20" />
                                <h4 className="text-[11px] font-black text-white uppercase tracking-tight">Vínculos & Sesiones Activas</h4>
                             </div>
                             <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center">
                                         <Monitor size={20} />
                                      </div>
                                      <div>
                                         <p className="text-white text-[10px] font-black uppercase">Web Browser - Teclingo Dashboard</p>
                                         <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">ACTUAL • DALLAS, TX</p>
                                      </div>
                                   </div>
                                   <span className="px-3 py-1 rounded-full bg-[#4ADE80]/10 text-[#4ADE80] text-[8px] font-black uppercase">En Línea</span>
                                </div>
                             </div>
                          </div>
                        )}
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'MODULES' && (
                <motion.div 
                  key="modules"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <ModuleManagement />
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {/* Floating Save Bar */}
       <AnimatePresence>
          {isDirty && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-8"
            >
               <div className="bg-[#38BDF8] rounded-[2rem] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(56,189,248,0.3)]">
                  <div className="flex items-center gap-4 px-4 text-white">
                     <Save size={20} />
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Cambios detectados</p>
                        <p className="text-[8px] font-bold opacity-80">Guarda para aplicar en tu perfil universitario</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => setIsDirty(false)}
                       className="px-6 py-3 rounded-2xl bg-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all font-bold"
                     >
                        Descartar
                     </button>
                     <button 
                       onClick={handleSave}
                       className="px-8 py-3 rounded-2xl bg-white text-[#38BDF8] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl font-bold"
                     >
                        Confirmar
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
       </AnimatePresence>

        <AnimatePresence>
           {isCalendarOpen && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCalendarOpen(false)}
                  className="absolute inset-0 bg-[#020b18]/80 backdrop-blur-md"
                />
                
                {/* Modal Container */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative z-10 w-full max-w-lg bg-[#0b0f19] border border-gray-800 rounded-[3rem] p-8 overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
                >
                   {/* Header Decoration */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                   
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <span className="text-[#DEFF9A] text-[8px] font-black uppercase tracking-[0.3em]">Reserva de Red de Apoyo</span>
                         <h3 className="text-white text-xl font-black italic tracking-tight uppercase mt-1">Agenda de Asesoría síncrona</h3>
                         <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Mtra. Ana López (Elite Coach)</p>
                      </div>
                      <button 
                        onClick={() => setIsCalendarOpen(false)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all border border-white/5"
                      >
                         <X size={16} />
                      </button>
                   </div>
                   
                   {/* Calendar Slots */}
                   <div className="space-y-4">
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                         <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Semana de clases activa (Próximos Horarios Disponibles)</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         {[
                           { id: '1', label: 'Lunes - 4:00 PM', desc: 'Teams síncrono' },
                           { id: '2', label: 'Lunes - 5:30 PM', desc: 'Google Meet' },
                           { id: '3', label: 'Miércoles - 9:00 AM', desc: 'Teams síncrono' },
                           { id: '4', label: 'Miércoles - 4:00 PM', desc: 'Google Meet' },
                           { id: '5', label: 'Viernes - 11:30 AM', desc: 'Teams síncrono' },
                           { id: '6', label: 'Viernes - 3:00 PM', desc: 'Google Meet' },
                         ].map(slot => {
                           const isSelected = selectedSlot === slot.label;
                           return (
                             <button
                               key={slot.id}
                               onClick={() => setSelectedSlot(slot.label)}
                               className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 group ${
                                 isSelected 
                                   ? 'bg-[#DEFF9A]/10 border-[#DEFF9A] text-[#DEFF9A] shadow-[0_0_20px_rgba(222,255,154,0.15)]'
                                   : 'bg-[#0f1424] hover:bg-[#141b30] border-gray-800 text-white/60 hover:text-white hover:border-gray-700'
                               }`}
                             >
                               <span className="text-[10px] font-black uppercase tracking-wider">{slot.label}</span>
                               <span className={`text-[8px] font-bold uppercase tracking-widest leading-none ${isSelected ? 'text-[#DEFF9A]/60' : 'text-white/20'}`}>
                                  {slot.desc}
                               </span>
                             </button>
                           );
                         })}
                      </div>
                   </div>

                   {/* Footer Controls */}
                   <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between gap-4">
                      <p className="text-[9px] text-white/30 uppercase tracking-widest max-w-[200px]">
                         La confirmación sincroniza la cita automáticamente con tu Google Calendar y Teams institucional.
                      </p>
                      <button
                        disabled={!selectedSlot}
                        onClick={() => {
                          if (selectedSlot) {
                            setToastMessage(`${selectedSlot} para desarrollo de Subject Pronouns`);
                            setShowToast(true);
                            setIsCalendarOpen(false);
                          }
                        }}
                        className="px-8 py-4 bg-[#DEFF9A] text-[#061a1a] font-black text-[10px] tracking-widest uppercase rounded-[1.5rem] hover:scale-105 transition-all shadow-[0_10px_20px_rgba(222,255,154,0.25)] disabled:opacity-30 disabled:pointer-events-none"
                      >
                         Confirmar Cita
                      </button>
                   </div>
                </motion.div>
             </div>
           )}
        </AnimatePresence>

        <AnimatePresence>
           {showToast && (
             <motion.div
               initial={{ opacity: 0, y: 50, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 50, scale: 0.9 }}
               className="fixed bottom-8 right-8 z-[130] max-w-md w-full bg-[#0a0f1d] border border-[#DEFF9A]/30 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(222,255,154,0.15)] flex items-start gap-4"
             >
               <div className="w-10 h-10 rounded-xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] shrink-0">
                  <Calendar size={20} className="animate-pulse" />
               </div>
               <div className="flex-1">
                  <h4 className="text-white text-xs font-black uppercase tracking-widest">[ 📅 ASESORÍA REGISTRADA CON LA MTRA. ANA LÓPEZ ]</h4>
                  <p className="text-[10px] text-[#DEFF9A] font-bold uppercase tracking-wider mt-1">{toastMessage}</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mt-2 font-mono">ID docente: {teacherData.employeeId} • Aula de Inmersión Virtual</p>
               </div>
               <button onClick={() => setShowToast(false)} className="text-white/20 hover:text-white transition-all">
                  <X size={16} />
               </button>
             </motion.div>
           )}
        </AnimatePresence>
    </div>
  );
}
