/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  X, 
  ClipboardList, 
  BookOpen, 
  TrendingUp, 
  UserCheck, 
  Users,
  Info,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpenCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface StudentGradeData {
  id: string;
  name: string;
  controlClass: string;
  photo: string;
  scores: {
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
    grammar: number;
  };
  manualOverrides: {
    speaking: boolean;
    listening: boolean;
    reading: boolean;
    writing: boolean;
    grammar: boolean;
  };
  aiProposed: number;
  riskStatus: 'SAFE' | 'WARNING' | 'CRITICAL';
  aiBreakdown: {
    speaking: string;
    listening: string;
    readingWriting: string;
    attendance: string;
    consistency: string;
  };
}

interface GroupMetrics {
  id: string;
  name: string;
  career: string;
  level: string;
  averageProgress: number;
  attendanceAvg: number;
  studentsInRisk: number;
  totalStudents: number;
}

const groupsList: GroupMetrics[] = [
  {
    id: 'GRP-SYS-4A',
    name: 'Ing. Sistemas - 4º A',
    career: 'Ingeniería en Sistemas Computacionales',
    level: 'B1-Intermediate',
    averageProgress: 82,
    attendanceAvg: 94,
    studentsInRisk: 2,
    totalStudents: 8
  },
  {
    id: 'GRP-IND-2B',
    name: 'Ing. Industrial - 2º B',
    career: 'Ingeniería Industrial',
    level: 'A2-Elementary',
    averageProgress: 75,
    attendanceAvg: 88,
    studentsInRisk: 5,
    totalStudents: 6
  },
  {
    id: 'GRP-CIV-1C',
    name: 'Ing. Civil - 1º C',
    career: 'Ingeniería Civil',
    level: 'A1-Beginner',
    averageProgress: 68,
    attendanceAvg: 81,
    studentsInRisk: 4,
    totalStudents: 5
  },
  {
    id: 'GRP-ADM-3A',
    name: 'Lic. Administración - 3º A',
    career: 'Licenciatura en Administración',
    level: 'B2-Upper Intermediate',
    averageProgress: 89,
    attendanceAvg: 96,
    studentsInRisk: 1,
    totalStudents: 7
  }
];

const initialStudentsGrades: Record<string, StudentGradeData[]> = {
  'GRP-SYS-4A': [
    {
      id: 'STU-001',
      name: 'JEAN PÉREZ',
      controlClass: 'Ing. Sistemas - 4º A',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      scores: { speaking: 8.5, listening: 9.0, reading: 8.0, writing: 8.8, grammar: 8.2 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 8.5,
      riskStatus: 'SAFE',
      aiBreakdown: {
        speaking: 'Completó 12 prácticas en Lab IA. Presenta una mejora del 15% en fluidez. Sigue arrastrando errores menores en pronunciación de verbos regulares en pasado (-ed).',
        listening: '100% de acierto en los ejercicios de comprensión auditiva del Libro Virtual. Capta estructuras complejas y acentos variados sin dificultad.',
        readingWriting: 'Entregó las 4 tareas de la plataforma. La IA detectó uso de vocabulario avanzado en su último ensayo, con fallas leves en estructura de párrafos.',
        attendance: '95% de asistencia registrada en el Data Lake. Puntualidad impecable en check-ins de clase presencial.',
        consistency: 'Ritmo de estudio constante. Activo principalmente los martes y jueves en plataforma sincrónica.'
      }
    },
    {
      id: 'STU-002',
      name: 'MARÍA GARCÍA',
      controlClass: 'Ing. Sistemas - 4º A',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      scores: { speaking: 9.3, listening: 9.5, reading: 9.1, writing: 9.4, grammar: 9.0 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 9.3,
      riskStatus: 'SAFE',
      aiBreakdown: {
        speaking: 'Fluidez nativa excepcional en discusiones de grupo de sistemas. Vocabulario técnico robusto asignado de forma proactiva.',
        listening: 'Comprensión auditiva del 100% en audios de velocidad nativa acelerada (1.2x).',
        readingWriting: 'Estilo de redacción coherente, uso sofisticado de nexos y oraciones subordinadas. Evaluaciones directas al 9.4.',
        attendance: '98% de asistencia general. Solo una inasistencia justificada institucionalmente.',
        consistency: 'Hábitos diarios excelentes. Completa lecciones diarias de forma consistente antes del mediodía.'
      }
    },
    {
      id: 'STU-003',
      name: 'LUIS MARTÍNEZ',
      controlClass: 'Ing. Sistemas - 4º A',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      scores: { speaking: 5.8, listening: 6.2, reading: 6.8, writing: 5.5, grammar: 6.0 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 6.1,
      riskStatus: 'CRITICAL',
      aiBreakdown: {
        speaking: 'Dificultad severa para entablar diálogos interactivos de nivel intermedio. Falta de práctica en la herramienta de IA (solo 1 de 12 sesiones realizadas).',
        listening: 'Comprensión promedio baja en audios del Libro Virtual. Requiere repeticiones múltiples para captar palabras clave.',
        readingWriting: 'Solo entregó 1 de 4 tareas de redacción. Errores sistemáticos en concordancia sujeto-verbo y tiempo futuro.',
        attendance: '74% de asistencia. Acumula 4 retardos y 3 faltas en las últimas dos semanas.',
        consistency: 'Baja actividad general. Solo accede a la plataforma minutos antes del límite de entrega.'
      }
    },
    {
      id: 'STU-004',
      name: 'ANA SÁNCHEZ',
      controlClass: 'Ing. Sistemas - 4º A',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      scores: { speaking: 7.2, listening: 8.0, reading: 7.5, writing: 7.0, grammar: 7.6 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 7.5,
      riskStatus: 'WARNING',
      aiBreakdown: {
        speaking: 'Nivel medio. Buena entonación pero vocabulario limitado. Muestra timidez al usar el feedback conversacional en tiempo real.',
        listening: 'Nivel estable. Responde con soltura preguntas de opción múltiple, aunque flaquea en ejercicios de dictado libre.',
        readingWriting: 'Entregó 3 de 4 ensayos. Ortografía aceptable, pero abusa de traductores automatizados en frases coloquiales.',
        attendance: '85% de asistencia. Frecuentes salidas anticipadas reportadas por el sistema QR.',
        consistency: 'Rachas discontinuas. Estudia intensamente los domingos por la noche.'
      }
    },
    {
      id: 'STU-005',
      name: 'PEDRO RODRÍGUEZ',
      controlClass: 'Ing. Sistemas - 4º A',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      scores: { speaking: 8.0, listening: 8.2, reading: 7.9, writing: 8.0, grammar: 8.1 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 8.0,
      riskStatus: 'SAFE',
      aiBreakdown: {
        speaking: 'Buen ritmo. Logra expresarse de forma coherente en temas informales. Se sugiere forzar interacciones técnicas sobre software.',
        listening: '82% de aciertos generales en el simulador de comprensión de Teclingo.',
        readingWriting: 'Cumplió con todas las entregas. Gramática prolija pero con redacción un tanto robótica y formal.',
        attendance: '92% de asistencia. Puntualidad constante en bitácoras físicas y virtuales.',
        consistency: 'Estudio balanceado. Horarios de estudio estables de lunes a miércoles.'
      }
    },
    {
      id: 'STU-006',
      name: 'SOFÍA LÓPEZ',
      controlClass: 'Ing. Sistemas - 4º A',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      scores: { speaking: 7.8, listening: 7.4, reading: 8.2, writing: 7.5, grammar: 7.8 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 7.7,
      riskStatus: 'SAFE',
      aiBreakdown: {
        speaking: 'Dominio intermedio en fonética. Participante activa en roleplays dinámicos guiados por el docente.',
        listening: 'Comprensión correcta en diálogos normales. Requiere apoyo adicional en jerga o modismos regionales.',
        readingWriting: 'Entrega en tiempo. Demuestra excelente comprensión lectora en resúmenes técnicos.',
        attendance: '90% de asistencia. Cumple con el pase diario interactivo QR de manera diligente.',
        consistency: 'Regular. Registra actividad constante los lunes y viernes.'
      }
    },
    {
      id: 'STU-007',
      name: 'HÉCTOR VALENZUELA',
      controlClass: 'Ing. Sistemas - 4º A',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      scores: { speaking: 6.9, listening: 7.0, reading: 6.5, writing: 6.8, grammar: 6.4 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 6.7,
      riskStatus: 'WARNING',
      aiBreakdown: {
        speaking: 'Muestra dificultad en articulación espontánea y fluida. Se sugiere asignar más diálogos cortos interactivos.',
        listening: 'Habilidades de comprensión receptiva justas en conversaciones de nivel B1.',
        readingWriting: 'Escritura simplificada. Utiliza estructuras gramaticales de nivel muy básico.',
        attendance: '80% de asistencia. Un par de faltas no justificadas durante las prácticas.',
        consistency: 'Poco constante. Pérdida notable de ritmo los fines de semana.'
      }
    },
    {
      id: 'STU-008',
      name: 'ELENA DÍAZ',
      controlClass: 'Ing. Sistemas - 4º A',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      scores: { speaking: 8.8, listening: 8.9, reading: 8.6, writing: 8.7, grammar: 8.4 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 8.7,
      riskStatus: 'SAFE',
      aiBreakdown: {
        speaking: 'Excelente soltura e ingenio expresivo. Esfuerzo ejemplar en el laboratorio virtual de pronunciación.',
        listening: 'Gran agudeza auditiva. Identifica rápidamente ideas principales e intenciones implícitas en audios rápidos.',
        readingWriting: 'Excelente redacción de ensayos. Manejo correcto de tiempos progresivos y modales.',
        attendance: '94% de asistencia grupal registrada.',
        consistency: 'Ritmo estable de autoaprendizaje. Acceso diario de 30 minutos promedio en plataforma.'
      }
    }
  ],
  'GRP-IND-2B': [
    {
      id: 'STU-101',
      name: 'ROBERTO GÓMEZ',
      controlClass: 'Ing. Industrial - 2º B',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
      scores: { speaking: 7.5, listening: 7.8, reading: 8.0, writing: 7.2, grammar: 7.4 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 7.6,
      riskStatus: 'SAFE',
      aiBreakdown: {
        speaking: 'Fluidez acorde para el nivel elemental A2. Diálogo estructurado en oraciones cortas con pausas normales.',
        listening: 'Comprensión correcta de audios sencillos con soporte visual en el Libro Virtual de Industrial.',
        readingWriting: 'Escribe descripciones claras de procesos fabriles. Vocabulario básico bien cimentado.',
        attendance: '90% de asistencia.',
        consistency: 'Consistencia media en la realización de cuestionarios semanales de gramática.'
      }
    },
    {
      id: 'STU-102',
      name: 'EMILY WEBER',
      controlClass: 'Ing. Industrial - 2º B',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      scores: { speaking: 8.8, listening: 8.6, reading: 9.0, writing: 8.5, grammar: 8.7 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 8.7,
      riskStatus: 'SAFE',
      aiBreakdown: {
        speaking: 'Muy participativa. Su fluidez y vocabulario superan el estándar grupal del segundo semestre.',
        listening: 'Captura el sentido global de conversaciones rápidamente. Responde con soltura.',
        readingWriting: 'Excelente gramática y orden. Sabe estructurar reportes de inventario y diagramas en inglés.',
        attendance: '96% de asistencias.',
        consistency: 'Gran compromiso de autogestión diaria. 15 horas mensuales totales en plataforma de tutorías.'
      }
    },
    {
      id: 'STU-103',
      name: 'ALBERTO JUÁREZ',
      controlClass: 'Ing. Industrial - 2º B',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      scores: { speaking: 5.0, listening: 5.5, reading: 6.0, writing: 4.8, grammar: 5.2 },
      manualOverrides: { speaking: false, listening: false, reading: false, writing: false, grammar: false },
      aiProposed: 5.3,
      riskStatus: 'CRITICAL',
      aiBreakdown: {
        speaking: 'Inhabilidad parcial para entablar las oraciones básicas requeridas en A2. No utiliza los audios auxiliares intermitentes.',
        listening: 'Puntajes críticamente bajos en evaluaciones periódicas del Libro Virtual. No interactúa libremente.',
        readingWriting: 'Tareas incompletas o idénticas a traductores en línea sin edición propia.',
        attendance: '78% de asistencia virtual y presencial en los módulos.',
        consistency: 'Estudio de último minuto con picos de estrés marcados de forma negativa.'
      }
    }
  ]
};

export function TeacherGrades() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('GRP-SYS-4A');
  const [gradesData, setGradesData] = useState<Record<string, StudentGradeData[]>>(initialStudentsGrades);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'cards'>('grid');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'SAFE' | 'WARNING' | 'CRITICAL'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Drawer Auditoría State
  const [selectedStudentForAudit, setSelectedStudentForAudit] = useState<StudentGradeData | null>(null);

  // Helper values
  const currentGroup = groupsList.find(g => g.id === selectedGroupId) || groupsList[0];
  const studentsOfCurrentGroup = gradesData[selectedGroupId] || [];

  // Filter student grades
  const filteredStudents = studentsOfCurrentGroup.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || student.riskStatus === riskFilter;
    return matchesSearch && matchesRisk;
  });

  // Calculate dynamic group totals
  const currentGroupAvg = filteredStudents.length > 0 
    ? (filteredStudents.reduce((acc, s) => {
        const avg = (s.scores.speaking + s.scores.listening + s.scores.reading + s.scores.writing + s.scores.grammar) / 5;
        return acc + avg;
      }, 0) / filteredStudents.length).toFixed(1)
    : '0.0';

  // Handle score change
  const handleScoreChange = (studentId: string, skill: keyof StudentGradeData['scores'], value: string) => {
    // Clamp values between 0 and 10 or keep empty
    let numValue = value === '' ? 0 : parseFloat(value);
    if (numValue > 10) numValue = 10;
    if (numValue < 0) numValue = 0;

    setGradesData(prev => {
      const updatedStudents = prev[selectedGroupId].map(student => {
        if (student.id === studentId) {
          const newScores = { ...student.scores, [skill]: numValue };
          
          // Calculate proposed average automatically
          const proposedAvg = parseFloat(((newScores.speaking + newScores.listening + newScores.reading + newScores.writing + newScores.grammar) / 5).toFixed(1));
          
          // Determine new risk level dynamically
          let rStatus: StudentGradeData['riskStatus'] = 'SAFE';
          if (proposedAvg < 6.5) {
            rStatus = 'CRITICAL';
          } else if (proposedAvg < 7.6) {
            rStatus = 'WARNING';
          }

          return {
            ...student,
            scores: newScores,
            manualOverrides: {
              ...student.manualOverrides,
              [skill]: true
            },
            aiProposed: proposedAvg,
            riskStatus: rStatus
          };
        }
        return student;
      });
      return { ...prev, [selectedGroupId]: updatedStudents };
    });
  };

  // Reset override back to AI Suggestion
  const handleResetOverride = (studentId: string, skill: keyof StudentGradeData['scores']) => {
    // find original suggested value
    const originalPre = initialStudentsGrades[selectedGroupId]?.find(s => s.id === studentId);
    if (!originalPre) return;

    const originalSuggestedScore = originalPre.scores[skill];

    setGradesData(prev => {
      const updatedStudents = prev[selectedGroupId].map(student => {
        if (student.id === studentId) {
          const newScores = { ...student.scores, [skill]: originalSuggestedScore };
          const proposedAvg = parseFloat(((newScores.speaking + newScores.listening + newScores.reading + newScores.writing + newScores.grammar) / 5).toFixed(1));
          
          let rStatus: StudentGradeData['riskStatus'] = 'SAFE';
          if (proposedAvg < 6.5) {
            rStatus = 'CRITICAL';
          } else if (proposedAvg < 7.6) {
            rStatus = 'WARNING';
          }

          return {
            ...student,
            scores: newScores,
            manualOverrides: {
              ...student.manualOverrides,
              [skill]: false
            },
            aiProposed: proposedAvg,
            riskStatus: rStatus
          };
        }
        return student;
      });
      return { ...prev, [selectedGroupId]: updatedStudents };
    });

    showToast(`Se restableció el valor original de IA para la habilidad.`);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const saveAllGrades = () => {
    showToast(`¡Calificaciones consolidadas y sincronizadas con el Data Lake de forma exitosa!`);
  };

  return (
    <div className="space-y-12">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-[#061a1a] border-2 border-[#4ADE80] text-[#4ADE80] font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-3 shadow-[0_0_40px_rgba(74,222,128,0.25)] backdrop-blur-md"
          >
            <CheckCircle2 size={16} className="text-[#4ADE80] animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[#4ADE80] text-[10px] font-black uppercase tracking-[0.4em] mb-3">MÓDULO: SEGUIMIENTO INTEGRADO</h2>
          <h1 className="text-3xl md:text-4xl font-black text-white bevel-text uppercase tracking-tight">EVALUACIONES Y SUGERENCIAS IA</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button 
            onClick={saveAllGrades}
            className="px-6 py-3.5 rounded-2xl bg-[#4ADE80] text-[#061a1a] font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_30px_rgba(74,222,128,0.25)] transition-all flex items-center justify-center gap-2"
          >
            <BookOpenCheck size={14} />
            CONSOLIDAR SACT
          </button>
        </div>
      </header>

      {/* 1. Vista General: Ponderado por Grupos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {groupsList.map((group) => {
          const isSelected = selectedGroupId === group.id;
          return (
            <div 
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                isSelected 
                  ? 'bg-gradient-to-tr from-[#101114] to-[#121317] border-[#4ADE80] shadow-[0_0_25px_rgba(74,222,128,0.15)] scale-[1.02]' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl text-center ${isSelected ? 'bg-[#4ADE80]/15 text-[#4ADE80]' : 'bg-white/5 text-white/40'}`}>
                  <Users size={18} />
                </div>
                <span className={`text-[8px] font-mono font-black uppercase px-2.5 py-1 rounded-full border ${
                  isSelected ? 'border-[#4ADE80]/30 bg-[#4ADE80]/5 text-[#4ADE80]' : 'border-white/10 text-white/30'
                }`}>
                  {group.level}
                </span>
              </div>

              <h3 className="text-white font-black text-sm uppercase tracking-tight truncate mb-1">
                {group.name}
              </h3>
              <p className="text-white/40 text-[9px] uppercase tracking-wider font-bold mb-5 truncate leading-none">
                {group.career}
              </p>

              <div className="grid grid-cols-3 gap-0.5 pt-4 border-t border-white/5 text-[9px]">
                <div className="text-left">
                  <span className="block text-white/35 font-bold uppercase tracking-widest text-[7px] mb-0.5">Progreso</span>
                  <span className="text-white font-black">{group.averageProgress}%</span>
                </div>
                <div className="text-center border-x border-white/5">
                  <span className="block text-white/35 font-bold uppercase tracking-widest text-[7px] mb-0.5">Asistencia</span>
                  <span className="text-white font-black">{group.attendanceAvg}%</span>
                </div>
                <div className="text-right">
                  <span className="block text-white/35 font-bold uppercase tracking-widest text-[7px] mb-0.5">En Riesgo</span>
                  <span className={`font-black ${group.studentsInRisk > 2 ? 'text-red-400' : group.studentsInRisk > 0 ? 'text-amber-400' : 'text-[#4ADE80]'}`}>
                    {group.studentsInRisk} ALUM.
                  </span>
                </div>
              </div>

              {/* Status Dot */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.01] rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>
          );
        })}
      </div>

      {/* 2. Grid de Calificaciones (Vista de Grupo) */}
      <GlassCard 
        title={`PANEL DE EVALUACIÓN: ${currentGroup.name}`} 
        icon={ClipboardList} 
        accent="green"
      >
        {/* Caption description */}
        <p className="text-white/40 text-[10px] md:text-[11px] leading-relaxed mb-6 italic max-w-4xl border-l border-emerald-400/30 pl-3">
          El asistente propone calificaciones basándose en el ecosistema completo (tareas, libro virtual, prácticas de IA y asistencias desde el Data Lake). Como docente, tú posees el control absoluto: edita cualquier celda o haz clic en <span className="text-[#4ADE80] font-black">AUDITAR AI</span> para auditar el razonamiento detrás de cada propuesta de nota.
        </p>

        {/* Filtros y Herramientas */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-4 border-b border-white/5 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="BUSCAR UN ALUMNO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-xl bg-white/5 border border-white/5 focus:border-[#4ADE80] focus:ring-0 text-white font-mono text-[10px] uppercase font-bold placeholder-white/30 tracking-widest"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
              <button 
                onClick={() => setRiskFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${riskFilter === 'ALL' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setRiskFilter('SAFE')}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${riskFilter === 'SAFE' ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'text-white/40 hover:text-white'}`}
              >
                <div className="w-1 h-1 rounded-full bg-[#4ADE80]" /> Al corriente
              </button>
              <button 
                onClick={() => setRiskFilter('WARNING')}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${riskFilter === 'WARNING' ? 'bg-amber-400/20 text-amber-300' : 'text-white/40 hover:text-white'}`}
              >
                <div className="w-1 h-1 rounded-full bg-amber-400" /> Preventivo
              </button>
              <button 
                onClick={() => setRiskFilter('CRITICAL')}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${riskFilter === 'CRITICAL' ? 'bg-red-400/20 text-red-400' : 'text-white/40 hover:text-white'}`}
              >
                <div className="w-1 h-1 rounded-full bg-red-400" /> En Riesgo
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* KPI Promedio del grupo virtual */}
            <div className="px-4 py-2 border border-white/5 bg-white/5 rounded-xl text-[10px] font-mono">
               <span className="text-white/30 uppercase font-black mr-2 leading-none">PR. GRUPAL:</span>
               <span className="text-[#4ADE80] font-black">{currentGroupAvg}</span>
            </div>

            <div className="p-1 bg-white/5 border border-white/10 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-2 rounded-lg transition-all ${layoutMode === 'grid' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'}`}
                title="Vista Tabla"
              >
                <List size={13} />
              </button>
              <button
                onClick={() => setLayoutMode('cards')}
                className={`p-2 rounded-lg transition-all ${layoutMode === 'cards' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'}`}
                title="Vista Fichas"
              >
                <LayoutGrid size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL: GRID TABULAR O TARJETAS */}
        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <AlertTriangle className="mx-auto text-white/20 mb-4 animate-bounce" size={32} />
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">Ningún alumno coincide con los filtros aplicados</p>
          </div>
        ) : layoutMode === 'grid' ? (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5 pb-2 text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] font-mono text-left">
                  <th className="py-4 font-black">Alumno</th>
                  <th className="py-4 text-center font-black">SPEAKING</th>
                  <th className="py-4 text-center font-black">LISTENING</th>
                  <th className="py-4 text-center font-black">READING</th>
                  <th className="py-4 text-center font-black">WRITING</th>
                  <th className="py-4 text-center font-black">GRAMMAR</th>
                  <th className="py-4 text-center font-black">PROPUESTA FINAL</th>
                  <th className="py-4 text-right font-black">AUDITORÍA IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredStudents.map((student) => {
                  return (
                    <tr key={student.id} className="hover:bg-white/[0.01] transition-all group">
                      <td className="py-4 flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={student.photo} 
                            className="w-9 h-9 rounded-xl object-cover border border-white/10" 
                            alt={student.name} 
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-[3px] border-[#061a1a] flex items-center justify-center ${
                            student.riskStatus === 'SAFE' ? 'bg-[#4ADE80]' : student.riskStatus === 'WARNING' ? 'bg-amber-400' : 'bg-red-400'
                          }`} />
                        </div>
                        <div>
                          <p className="text-white text-[11px] font-black uppercase tracking-tight group-hover:text-white transition-colors">{student.name}</p>
                          <p className="text-white/30 text-[8px] font-mono tracking-wider uppercase mt-0.5 leading-none">{student.id}</p>
                        </div>
                      </td>

                      {/* SPEAKING INPUT */}
                      <td className="py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              value={student.scores.speaking}
                              onChange={(e) => handleScoreChange(student.id, 'speaking', e.target.value)}
                              className={`w-14 h-9 rounded-lg border text-center transition-all focus:ring-0 text-[11px] font-black ${
                                student.manualOverrides.speaking 
                                  ? 'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80]' 
                                  : 'bg-white/[0.02] border-white/5 text-white/50 hover:border-white/20'
                              }`}
                            />
                            {student.manualOverrides.speaking && (
                              <button 
                                onClick={() => handleResetOverride(student.id, 'speaking')}
                                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-400/20 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-black hover:scale-105 transition-all"
                                title="Regresar a sugerencia original IA"
                              >
                                <X size={7} strokeWidth={4} />
                              </button>
                            )}
                          </div>
                          {student.manualOverrides.speaking && (
                            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block leading-none">Manual</span>
                          )}
                        </div>
                      </td>

                      {/* LISTENING INPUT */}
                      <td className="py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              value={student.scores.listening}
                              onChange={(e) => handleScoreChange(student.id, 'listening', e.target.value)}
                              className={`w-14 h-9 rounded-lg border text-center transition-all focus:ring-0 text-[11px] font-black ${
                                student.manualOverrides.listening 
                                  ? 'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80]' 
                                  : 'bg-white/[0.02] border-white/5 text-white/50 hover:border-white/20'
                              }`}
                            />
                            {student.manualOverrides.listening && (
                              <button 
                                onClick={() => handleResetOverride(student.id, 'listening')}
                                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-400/20 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-black hover:scale-105 transition-all"
                                title="Regresar a sugerencia original IA"
                              >
                                <X size={7} strokeWidth={4} />
                              </button>
                            )}
                          </div>
                          {student.manualOverrides.listening && (
                            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block leading-none">Manual</span>
                          )}
                        </div>
                      </td>

                      {/* READING INPUT */}
                      <td className="py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              value={student.scores.reading}
                              onChange={(e) => handleScoreChange(student.id, 'reading', e.target.value)}
                              className={`w-14 h-9 rounded-lg border text-center transition-all focus:ring-0 text-[11px] font-black ${
                                student.manualOverrides.reading 
                                  ? 'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80]' 
                                  : 'bg-white/[0.02] border-white/5 text-white/50 hover:border-white/20'
                              }`}
                            />
                            {student.manualOverrides.reading && (
                              <button 
                                onClick={() => handleResetOverride(student.id, 'reading')}
                                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-400/20 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-black hover:scale-105 transition-all"
                                title="Regresar a sugerencia original IA"
                              >
                                <X size={7} strokeWidth={4} />
                              </button>
                            )}
                          </div>
                          {student.manualOverrides.reading && (
                            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block leading-none">Manual</span>
                          )}
                        </div>
                      </td>

                      {/* WRITING INPUT */}
                      <td className="py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              value={student.scores.writing}
                              onChange={(e) => handleScoreChange(student.id, 'writing', e.target.value)}
                              className={`w-14 h-9 rounded-lg border text-center transition-all focus:ring-0 text-[11px] font-black ${
                                student.manualOverrides.writing 
                                  ? 'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80]' 
                                  : 'bg-white/[0.02] border-white/5 text-white/50 hover:border-white/20'
                              }`}
                            />
                            {student.manualOverrides.writing && (
                              <button 
                                onClick={() => handleResetOverride(student.id, 'writing')}
                                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-400/20 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-black hover:scale-105 transition-all"
                                title="Regresar a sugerencia original IA"
                              >
                                <X size={7} strokeWidth={4} />
                              </button>
                            )}
                          </div>
                          {student.manualOverrides.writing && (
                            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block leading-none">Manual</span>
                          )}
                        </div>
                      </td>

                      {/* GRAMMAR INPUT */}
                      <td className="py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              value={student.scores.grammar}
                              onChange={(e) => handleScoreChange(student.id, 'grammar', e.target.value)}
                              className={`w-14 h-9 rounded-lg border text-center transition-all focus:ring-0 text-[11px] font-black ${
                                student.manualOverrides.grammar 
                                  ? 'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80]' 
                                  : 'bg-white/[0.02] border-white/5 text-white/50 hover:border-white/20'
                              }`}
                            />
                            {student.manualOverrides.grammar && (
                              <button 
                                onClick={() => handleResetOverride(student.id, 'grammar')}
                                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-400/20 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-black hover:scale-105 transition-all"
                                title="Regresar a sugerencia original IA"
                              >
                                <X size={7} strokeWidth={4} />
                              </button>
                            )}
                          </div>
                          {student.manualOverrides.grammar && (
                            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block leading-none">Manual</span>
                          )}
                        </div>
                      </td>

                      {/* PROPOSED AVERAGE */}
                      <td className="py-4 text-center md:px-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono ${
                          student.riskStatus === 'SAFE' 
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                            : student.riskStatus === 'WARNING' 
                              ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' 
                              : 'bg-red-400/10 border-red-400/25 text-red-400'
                        }`}>
                          <Sparkles size={11} className="shrink-0" />
                          <span className="text-xs font-black">{student.aiProposed}</span>
                        </div>
                      </td>

                      {/* AUDIT AI BUTTON */}
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setSelectedStudentForAudit(student)}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#4ADE80]/40 hover:bg-white/[0.08] active:bg-white/10 text-white font-mono text-[9px] font-black uppercase tracking-wider transition-all inline-flex items-center gap-1.5 group/btn"
                        >
                          <Sparkles size={10} className="text-[#4ADE80] group-hover/btn:scale-110 transition-transform" />
                          Auditar AI
                          <ChevronRight size={10} className="text-white/30 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* VISTA TARJETAS (Alternative layout requested with [ Cambiar a Vista Tarjetas ]) */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => {
              const overallAvg = student.aiProposed;
              return (
                <div 
                  key={student.id} 
                  className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.02] hover:border-white/10 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header profile inside card */}
                    <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={student.photo} 
                            className="w-10 h-10 rounded-xl object-cover border border-white/10" 
                            alt={student.name} 
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-[3px] border-[#061a1a] flex items-center justify-center ${
                            student.riskStatus === 'SAFE' ? 'bg-[#4ADE80]' : student.riskStatus === 'WARNING' ? 'bg-amber-400' : 'bg-red-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="text-white text-xs font-black uppercase tracking-tight">{student.name}</h4>
                          <span className="text-white/20 text-[8px] font-mono tracking-widest">{student.id}</span>
                        </div>
                      </div>

                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-mono ${
                        student.riskStatus === 'SAFE' 
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                          : student.riskStatus === 'WARNING' 
                            ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' 
                            : 'bg-red-400/10 border-red-400/25 text-red-400'
                      }`}>
                        <Sparkles size={10} className="text-[#4ADE80]" />
                        <span className="text-[10px] font-black">{overallAvg}</span>
                      </div>
                    </div>

                    {/* Skill Scores stack */}
                    <div className="space-y-3.5 mb-5">
                      {Object.entries(student.scores).map(([skillKey, scoreVal]) => {
                        const skill = skillKey as keyof StudentGradeData['scores'];
                        const isOverridden = student.manualOverrides[skill];
                        return (
                          <div key={skill} className="flex items-center justify-between gap-4">
                            <span className="text-white/40 text-[9px] font-black uppercase tracking-widest font-mono">
                              {skill}
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                value={scoreVal}
                                onChange={(e) => handleScoreChange(student.id, skill, e.target.value)}
                                className={`w-12 h-7.5 rounded-md border text-center transition-all focus:ring-0 text-[10px] font-mono font-black ${
                                  isOverridden 
                                    ? 'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80]' 
                                    : 'bg-white/[0.02] border-white/5 text-white/50 hover:border-white/20'
                                }`}
                              />
                              {isOverridden && (
                                <button 
                                  onClick={() => handleResetOverride(student.id, skill)}
                                  className="p-1 rounded bg-red-400/15 text-red-400 border border-red-400/25 hover:bg-red-400 hover:text-black transition-all"
                                  title="Restaurar sugerencia original IA"
                                >
                                  <X size={8} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions footer inside card */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-end">
                    <button
                      onClick={() => setSelectedStudentForAudit(student)}
                      className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] text-white font-mono text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all group/btn"
                    >
                      <Sparkles size={10} className="text-[#4ADE80]" />
                      Ver Razonamiento Académico
                      <ChevronRight size={10} className="text-white/30 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* 3. El Core: El Drawer de Auditoría de IA [👁️ Ver Razones] */}
      <AnimatePresence>
        {selectedStudentForAudit && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudentForAudit(null)}
              className="fixed inset-0 bg-[#020204] z-50 pointer-events-auto"
            />

            {/* Sliding Drawer Right Side */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-md md:max-w-lg bg-[#0d0f13] border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-50 flex flex-col justify-between overflow-hidden text-left"
            >
              {/* Drawer Header */}
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                     <Sparkles size={12} className="text-[#4ADE80] animate-pulse" />
                     <span className="text-[8px] font-mono font-black uppercase tracking-widest text-emerald-400">Auditoría de Rendimiento AI</span>
                  </div>
                  <h3 className="text-white text-lg font-black uppercase tracking-tight">Desglose Analítico</h3>
                </div>
                <button
                  onClick={() => setSelectedStudentForAudit(null)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-white/50 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                {/* Visual Student Banner */}
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#4ADE80]/5 blur-3xl rounded-full" />
                  
                  <div className="relative">
                    <img 
                      src={selectedStudentForAudit.photo} 
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10 shrink-0" 
                      alt="" 
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border-[3.5px] border-[#0d0f13] flex items-center justify-center ${
                      selectedStudentForAudit.riskStatus === 'SAFE' ? 'bg-[#4ADE80]' : selectedStudentForAudit.riskStatus === 'WARNING' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                  </div>

                  <div>
                     <h4 className="text-white text-md font-black uppercase tracking-tight leading-none mb-1.5">{selectedStudentForAudit.name}</h4>
                     <p className="text-white/40 text-[9px] font-mono tracking-widest uppercase mb-2 leading-none">{selectedStudentForAudit.id}</p>
                     <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">PROPUESTA GRUPAL:</span>
                        <span className="text-semibold text-[10px] text-white font-mono bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">8.5</span>
                     </div>
                  </div>
                </div>

                {/* KPI Suggested vs Current Overrides */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[8px] font-mono font-black text-white/30 uppercase tracking-wider block mb-1">Propuesta AI</span>
                    <span className="text-lg font-mono font-black text-emerald-400">{selectedStudentForAudit.aiProposed}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[8px] font-mono font-black text-white/30 uppercase tracking-wider block mb-1">Modificaciones</span>
                    <span className="text-lg font-mono font-black text-white">
                      {Object.values(selectedStudentForAudit.manualOverrides).filter(Boolean).length} <span className="text-sm text-white/20">/ 5</span>
                    </span>
                  </div>
                </div>

                {/* Audit breakdowns lists */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-white text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2">Evidencia Detallada por Habilidad</h4>

                  {/* SPEAKING */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-wider font-mono">Speaking Skills (Lab IA)</span>
                        <span className="text-white/50 text-[10px] font-black font-mono">{selectedStudentForAudit.scores.speaking} / 10</span>
                     </div>
                     <p className="text-white/50 text-[11px] leading-relaxed font-mono">
                        {selectedStudentForAudit.aiBreakdown.speaking}
                     </p>
                  </div>

                  {/* LISTENING */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 text-[9px] font-black uppercase tracking-wider font-mono">Listening Skills (Virtual Book)</span>
                        <span className="text-white/50 text-[10px] font-black font-mono">{selectedStudentForAudit.scores.listening} / 10</span>
                     </div>
                     <p className="text-white/50 text-[11px] leading-relaxed font-mono">
                        {selectedStudentForAudit.aiBreakdown.listening}
                     </p>
                  </div>

                  {/* READING & WRITING */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-400 text-[9px] font-black uppercase tracking-wider font-mono">Reading & Writing (Tareas)</span>
                        <span className="text-white/50 text-[10px] font-black font-mono">
                           {((selectedStudentForAudit.scores.reading + selectedStudentForAudit.scores.writing) / 2).toFixed(1)} / 10
                        </span>
                     </div>
                     <p className="text-white/50 text-[11px] leading-relaxed font-mono">
                        {selectedStudentForAudit.aiBreakdown.readingWriting}
                     </p>
                  </div>

                  {/* ATTENDANCE */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-400 text-[9px] font-black uppercase tracking-wider font-mono">Asistencias y QR (Data Lake)</span>
                        <span className="text-white/50 text-[10px] font-black font-mono">Sincronizado</span>
                     </div>
                     <p className="text-white/50 text-[11px] leading-relaxed font-mono">
                        {selectedStudentForAudit.aiBreakdown.attendance}
                     </p>
                  </div>

                  {/* STUDY PACE */}
                  <div className="p-4 rounded-2xl bg-[#4ADE80]/5 border border-[#4ADE80]/10">
                     <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={11} className="text-[#4ADE80]" />
                        <span className="text-[#4ADE80] text-[9px] font-black uppercase tracking-wider font-mono">Consistencia de Estudio AI</span>
                     </div>
                     <p className="text-white/60 text-[11px] leading-relaxed font-mono">
                        {selectedStudentForAudit.aiBreakdown.consistency}
                     </p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer controls */}
              <div className="p-6 md:p-8 bg-[#0a0c0f] border-t border-white/5 flex gap-4">
                 <button
                    onClick={() => setSelectedStudentForAudit(null)}
                    className="flex-1 py-4.5 rounded-2xl border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:border-white/25 active:scale-95 transition-all text-center leading-none"
                 >
                    Cerrar Auditoría
                 </button>
                 <button
                    onClick={() => {
                      showToast(`Auditoría validada de forma estricta para el estudiante ${selectedStudentForAudit.name}.`);
                      setSelectedStudentForAudit(null);
                    }}
                    className="flex-1 py-4.5 rounded-2xl bg-[#4ADE80] text-[#061a1a] font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(74,222,128,0.25)] active:scale-95 transition-all text-center leading-none"
                 >
                    Aceptar Propuestas
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
