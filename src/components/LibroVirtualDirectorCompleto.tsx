/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Video, 
  ArrowLeft, 
  ArrowRight,
  BookMarked,
  Printer,
  Download,
  X,
  FileText,
  AlertCircle,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  List,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Users,
  Eye,
  Filter,
  ShieldAlert,
  Save,
  Check,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mallaCurricularModulo1, SemanaMalla } from '../data/mallaCurricularModulo1';
import { reactivosPorSemana, Reactivo } from '../data/reactivosWorkbook';

// Re-use same pedagogical theory dataset
function getLessonTheoryExplanation(semanaNum: number, ejeTematico: string): {
  grammarFocus: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  bullets: string[];
  toeflTip: string;
} {
  switch (semanaNum) {
    case 1:
      return {
        grammarFocus: "THE MANDATORY SUBJECT PRONOUNS (Sujeto Obligatorio)",
        tableHeaders: ["Subject Pronoun", "Verbo BE (Simple)", "Example Syntax"],
        tableRows: [
          ["I", "am", "I am a support engineer."],
          ["You", "are", "You are ready for TOEFL."],
          ["He / She / It", "is", "It is bound to port 3000."],
          ["We / They", "are", "They are from Monterrey."]
        ],
        bullets: [
          "Regla Base: En inglés, a diferencia del español, NUNCA se omite el pronombre sujeto. 'Es un ingeniero' se traduce obligatoriamente como 'He/She is an engineer'.",
          "El pronombre 'It' es vital para sistemas informáticos, servidores y estados operativos de error.",
          "Fórmulas de Cortesía: Complementa las interacciones con 'Nice to meet you', 'Good morning' y formas formales."
        ],
        toeflTip: "TOEFL iBT Key: En la sección de Structure & Written Expression, los reactivos suelen inducir al error omitiendo el sujeto 'It' antes de verbos meteorológicos o de estado. Recuerda siempre verificar su presencia."
      };
    case 2:
      return {
        grammarFocus: "DEMONSTRATIVES AND ARTICLES (This, That, These, Those)",
        tableHeaders: ["Type", "Singular", "Plural", "Relative Distance"],
        tableRows: [
          ["Near (Cerca)", "This (This pen)", "These (These boxes)", "Immediate interaction zone"],
          ["Far (Lejos)", "That (That system)", "Those (Those consoles)", "Auxiliary or remote server zone"]
        ],
        bullets: [
          "Regla de Artículos: Usa 'A' antes de consonantes (a laptop) and 'An' antes de vocales (an error).",
          "Para plurales irregulares o terminados en s, ch, sh, x, z, agrega '-es' (box ➔ boxes, brush ➔ brushes).",
          "Los pronombres demostrativos clasifican objetos físicos del aula y componentes de software."
        ],
        toeflTip: "TOEFL iBT Key: Presta atención a la correspondencia entre adjetivos demostrativos plurales ('These') y sustantivos singulares o viceversa — es una trampa recurrente para identificar fallas en concordancia de número."
      };
    case 3:
      return {
        grammarFocus: "THE GENITIVE CASE & POSSESSIVES ('s vs Of)",
        tableHeaders: ["Owner Profile", "Grammar Rule", "Example Output"],
        tableRows: [
          ["Singular Person", "Add 's", "Robert's workstation"],
          ["Plural ends in s", "Add only '", "The engineers' database"],
          ["Inanimate objects", "Prefer 'of'", "The port of the local proxy"]
        ],
        bullets: [
          "Possessive Adjectives (My, Your, His, Her, Its, Our, Their) indican pertenencia inequívoca.",
          "El Genitivo Sajón ('s) expresa relaciones familiares directas. Evita la traducción literal de 'La oficina de mi padre' (The office of my father) ➔ Prefiere 'My father's office'.",
          "No dupliques la posesión: 'Her Robert's cat' es incorrecto."
        ],
        toeflTip: "TOEFL iBT Key: En redacción formal, el uso excesivo de la preposición 'of' denota falta de fluidez natural. Reemplazarlo apropiadamente con el genitivo sajón o adjetivos posesivos aumenta la puntuación en cohesión."
      };
    case 4:
      return {
        grammarFocus: "CAPITALIZATION & PREPOSITIONS OF PLACE",
        tableHeaders: ["Category", "Grammar Rule", "Toefl Compliance Example"],
        tableRows: [
          ["Languages", "Always Capitalized", "I speak fluent English and Spanish."],
          ["Countries", "Always Capitalized", "We are originally from Mexico."],
          ["Origin Prep.", "Use 'From'", "She is from Monterrey, Canada."],
          ["Location Prep.", "Use 'In'", "We are currently living in Guadalajara."]
        ],
        bullets: [
          "Uso estricto de mayúsculas: Nacionalidades (French, British), Idiomas (Japanese), Ciudades y Países.",
          "La preposición 'From' denota procedencia u origen geográfico de datos o personas.",
          "'In' se utiliza para ciudades, países y continentes para delimitar posicionamiento operativo."
        ],
        toeflTip: "TOEFL iBT Key: La sección de Writing califica de forma muy estricta el uso de mayúsculas para idiomas ('english' con minúscula se considera error ortográfico grave). Revisa siempre tu texto final."
      };
    default:
      return {
        grammarFocus: `CONSOLIDATED ANALYSIS: ${ejeTematico.split(',')[0].toUpperCase()}`,
        tableHeaders: ["Parameter", "Target Grammatical Core", "Pedagogical Standard"],
        tableRows: [
          ["Active Structure", "Grammar block aligned to SEP guidelines", "Level A1.1 Common European Framework"],
          ["KPI Metric", "Speech timing, fluency under 1 minute limits", "TOEFL Primary and TOEFL Junior guidelines"]
        ],
        bullets: [
          "Repasa la unidad correspondiente para deponer respuestas espontáneas y precisas.",
          "Fomenta la audición asidua de pistas fonológicas para erradicar el acento regional en ambientes corporativos.",
          "Integra estas variables en tus reportes semanales de evidencias escolares."
        ],
        toeflTip: "TOEFL iBT Key: En las tareas integradas síncronas, priorizar la síntesis directa del texto sobre la redundancia verbal te asegura el máximo rango de aceptación por los evaluadores."
      };
  }
}

// Student mock submissions database
interface StudentSubmission {
  studentId: string;
  studentName: string;
  avatar: string;
  progress: number; // 1-18 completion
  grades: Record<number, number>; // week -> grade
  answers: Record<number, {
    classwork?: Record<string, string>;
    homework?: string;
    feedbackTeacher?: string;
    grade?: number;
  }>;
}

const initialStudents: StudentSubmission[] = [
  {
    studentId: "ST-01",
    studentName: "José Robert Garza",
    avatar: "JR",
    progress: 12,
    grades: { 1: 95, 2: 90, 3: 88, 4: 92, 5: 100 },
    answers: {
      1: {
        classwork: { 
          s1_r1: "It is a beautiful day today in Greenfield.", 
          s1_r2: "My name is José Garza",
          s1_r3: "Good morning, Hello, Good afternoon",
          s1_r4: "I am from Mexico and I speak Spanish and English.",
          s1_r5: "Hello everyone, my name is Jose, I am 22 and I want to improve my formal writing skills in English. Nice to meet you all!"
        },
        homework: "Good morning recruiter. My name is Jose Garza, I am 22 years old and my nationality is Mexican. I live in Greenfield system.",
        feedbackTeacher: "Excelente redacción formal. Cumple con el sujeto obligatorio It.",
        grade: 95
      },
      2: {
        classwork: { 
          s2_r1: "whiteboard, book, pointer", 
          s2_r2: "these",
          s2_r3: "I have a green pen on my desk. Also, I have some files in my backpack.",
          s2_r4: "These books are very green and big on the table.",
          s2_r5: "In my room, this computer is extremely fast. That shelf has my English books. These notebook sheets are for vocabulary notes."
        },
        homework: "My inventory check list contains: This router near me. That server console over there. These ethernet cables in my hand.",
        feedbackTeacher: "Bien aplicados los demostrativos de distancia.",
        grade: 90
      }
    }
  },
  {
    studentId: "ST-02",
    studentName: "Amelia Watson",
    avatar: "AW",
    progress: 8,
    grades: { 1: 85, 2: 95, 3: 92 },
    answers: {
      1: {
        classwork: { s1_r1: "It is a nice day today in Greenfield.", s1_r2: "I am Watson" },
        homework: "Hello there. Amelia Watson here, 20. Originally from London, UK. Pleasure to meet you.",
        feedbackTeacher: "Muy fluido. Trata de mantener un tono ligeramente más formal en redacción escrita.",
        grade: 85
      },
      2: {
        classwork: { s2_r1: "keyboard, mouse, screen", s2_r2: "this" },
        homework: "Inventory list: This screens on desk. These mouse buttons. That server rack on the secondary area.",
        feedbackTeacher: "Cuidado con la concordancia de plurales (these screen -> these screens).",
        grade: 95
      }
    }
  },
  {
    studentId: "ST-03",
    studentName: "Carlos Santana",
    avatar: "CS",
    progress: 4,
    grades: { 1: 70 },
    answers: {
      1: {
        classwork: { s1_r1: "Is a nice day...", s1_r2: "Carlos" },
        homework: "Hi, I am Carlos, I am from Guadalajara, Mexico. I am 21.",
        feedbackTeacher: "Omitiste el sujeto 'It' en el primer reactivo. 'Is a nice...' -> 'It is a nice...'.",
        grade: 70
      }
    }
  }
];

export function LibroVirtualDirectorCompleto() {
  const [semanaActivaIndice, setSemanaActivaIndice] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'pdf' | 'duplex'>('pdf');
  const [zoomPdf, setZoomPdf] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [subSeccion, setSubSeccion] = useState<'ejercicios' | 'tareas'>('ejercicios');

  // Directory Administrative overrides & view modes
  const [students, setStudents] = useState<StudentSubmission[]>(initialStudents);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("ST-01");
  const [teacherFeedback, setTeacherFeedback] = useState<string>("");
  const [tempGrade, setTempGrade] = useState<string>("95");
  const [alertSaved, setAlertSaved] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Custom audio player simulator state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioTime, setAudioTime] = useState<number>(45);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioTime(prev => {
          if (prev >= 60) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const pageContainerRef = useRef<HTMLDivElement>(null);

  const semanaActual = mallaCurricularModulo1[semanaActivaIndice];
  const theoryDetails = getLessonTheoryExplanation(semanaActual.semana, semanaActual.eje_tematico);

  const activeStudent = students.find(s => s.studentId === selectedStudentId) || students[0];

  useEffect(() => {
    // Sync temporal feedback inputs when student or week changes
    const submission = activeStudent.answers[semanaActual.semana];
    if (submission) {
      setTeacherFeedback(submission.feedbackTeacher || "");
      setTempGrade(String(submission.grade || 100));
    } else {
      setTeacherFeedback("");
      setTempGrade("100");
    }
  }, [selectedStudentId, semanaActivaIndice]);

  const handleSaveFeedback = () => {
    setStudents(prev => prev.map(s => {
      if (s.studentId === activeStudent.studentId) {
        const existingAnswers = s.answers[semanaActual.semana] || { classwork: {}, homework: "" };
        const updatedSemester = {
          ...existingAnswers,
          feedbackTeacher: teacherFeedback,
          grade: Number(tempGrade) || 100
        };
        return {
          ...s,
          grades: {
            ...s.grades,
            [semanaActual.semana]: Number(tempGrade) || 100
          },
          answers: {
            ...s.answers,
            [semanaActual.semana]: updatedSemester
          }
        };
      }
      return s;
    }));

    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
  };

  const totalSemanas = mallaCurricularModulo1.length;

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemanaActivaIndice(Number(e.target.value) - 1);
  };

  const handlePageNext = () => {
    if (semanaActivaIndice < totalSemanas - 1) {
      setSemanaActivaIndice(prev => prev + 1);
    }
  };

  const handlePagePrev = () => {
    if (semanaActivaIndice > 0) {
      setSemanaActivaIndice(prev => prev - 1);
    }
  };

  // Stats summaries
  const averageGrade = Math.round(
    students.reduce((acc, s) => {
      const gradesList = Object.values(s.grades) as number[];
      if (gradesList.length === 0) return acc;
      return acc + (gradesList.reduce((a, b) => a + b, 0) / gradesList.length);
    }, 0) / students.length
  );

  const filteredStudents = students.filter(s => 
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* DIRECTIVE HUB INDICATORS */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/20 via-[#0a1a2b]/40 to-transparent border border-indigo-505/20 flex flex-col xl:flex-row justify-between gap-6 text-left">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/10 text-indigo-400 font-mono text-[9px] font-black px-2.5 py-1 rounded border border-indigo-500/20 uppercase tracking-widest">
              MONITOR DE CLASES VIRTUAL - ADMINISTRATIVO
            </span>
            <span className="text-white/40 text-[10px] font-mono">• TECLINGO SUITE DIRECTIVA</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">
            AUDITORÍA DE AVANCES & LIBRO VIRTUAL MAESTRO
          </h2>
          <p className="text-xs text-white/50 max-w-xl leading-relaxed">
            Examina los materiales curriculares de los 6 semestres principales. Supervisa síncronamente las respuestas del workbook y portafolios asíncronos ingresados por tus alumnos inscritos.
          </p>
        </div>

        {/* Dynamic Metric Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-white/30 text-[9px] font-mono block uppercase">Promedio Grupal</span>
            <span className="text-xl font-black text-[#DEFF9A]">{averageGrade} / 100</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-white/30 text-[9px] font-mono block uppercase">Alumnos Activos</span>
            <span className="text-xl font-black text-white">{students.length} Registrados</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
            <span className="text-white/30 text-[9px] font-mono block uppercase">Malla Curricular</span>
            <span className="text-xl font-black text-cyan-400">18 Semanas</span>
          </div>
        </div>
      </div>

      {/* FILTER & SELECT BAR COMPONENT */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-[#091524]/60 border border-white/5 p-4 rounded-2xl text-left">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Users size={16} />
          </div>
          <div className="text-left shrink-0">
            <p className="text-white text-xs font-bold leading-normal">Filtro de Audiencia Escolar</p>
            <p className="text-[10px] text-white/40 font-mono">
              Visualizando avances de: <strong className="text-indigo-400">{activeStudent.studentName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 ml-1 sm:ml-4">
            <span className="text-[10px] font-mono text-white/40 font-bold uppercase">Alumno:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono font-semibold cursor-pointer"
            >
              {students.map((st) => (
                <option key={st.studentId} value={st.studentId} className="bg-[#040e1a] text-white">
                  {st.studentName} ({st.studentId}) — Mod. {st.progress}/18
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Week navigation fast picker */}
        <div className="flex items-center gap-2 self-end lg:self-center font-mono text-[10px]">
          <span className="text-white/40 uppercase">Eje de Estudio:</span>
          <select
            value={semanaActual.semana}
            onChange={handleDropdownSelect}
            className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
          >
            {mallaCurricularModulo1.map((s) => (
              <option key={s.semana} value={s.semana} className="bg-[#05111d] text-white">
                Semana {s.semana.toString().padStart(2, '0')} — {s.unidad_libro.split(':')[1]?.trim() || s.unidad_libro}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CORE GRID LAYOUT: LEFT SIDEBAR WITH CONTENT VIEW, RIGHT SIDEBAR FOR STUDENT MONITORING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* PDF ACTIVE CURRICULA FRAMEWORK (8 GRID SPACES) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border border-white/10 rounded-3xl bg-[#030d1a] overflow-hidden shadow-2xl">
            
            {/* ACTION CHROM BAR */}
            <div className="bg-[#020710]/80 border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2 text-white text-[11px] font-mono">
                <span className="p-1 px-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-[9px]">
                  REVISIÓN
                </span>
                <span className="truncate text-white/70 italic font-medium">
                  Vista Instructor • {semanaActual.unidad_libro}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={handlePagePrev}
                  disabled={semanaActivaIndice === 0}
                  className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                </button>
                <span className="text-[10px] text-white/50 font-mono">
                  S{semanaActual.semana.toString().padStart(2, '0')} / {totalSemanas.toString().padStart(2, '0')}
                </span>
                <button 
                  type="button"
                  onClick={handlePageNext}
                  disabled={semanaActivaIndice === totalSemanas - 1}
                  className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CURRICULAR PRINT INSIDE SINK CONTAINER */}
            <div className="bg-slate-800/40 p-6 md:p-8 flex justify-center overflow-x-auto">
              <div className="bg-white text-slate-800 rounded-lg shadow-2xl p-6 md:p-10 w-full max-w-[650px] relative text-left">
                
                {/* Header branding */}
                <div className="border-b border-slate-200 pb-2.5 mb-5 flex justify-between items-center text-[8px] text-slate-400 font-mono font-bold uppercase tracking-widest text-left">
                  <span>TECLINGO ACADEMIC LIBRARY PROJECT</span>
                  <span className="text-[#059669]">{semanaActual.paginas}</span>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-left">
                    <span className="bg-emerald-100 text-[#0c4f34] text-[8px] font-mono font-black px-2 py-0.5 rounded uppercase">
                      {semanaActual.unidad_libro}
                    </span>
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-mono text-emerald-600 font-black tracking-wider uppercase block">
                      SEMANA {semanaActual.semana.toString().padStart(2, '0')} • ACADEMIC MATERIAL
                    </span>
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none text-left">
                      {semanaActual.eje_tematico}
                    </h1>
                  </div>

                  {/* Syllabus theory */}
                  <div className="pt-3 space-y-4 text-left">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-left">
                      <strong className="text-[9px] font-mono font-black text-emerald-700 block uppercase tracking-wider">
                        📝 GRAMMAR & VOCABULARY CRITERIA:
                      </strong>
                      <p className="text-[11px] font-bold text-slate-800 uppercase italic">
                        {theoryDetails.grammarFocus}
                      </p>
                    </div>

                    {theoryDetails.tableHeaders && theoryDetails.tableRows && (
                      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
                        <table className="w-full min-w-[340px] text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wide">
                              {theoryDetails.tableHeaders.map((head, i) => (
                                <th key={i} className="p-2 font-bold">{head}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {theoryDetails.tableRows.map((row, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-none text-slate-800">
                                {row.map((val, k) => (
                                  <td key={k} className="p-2 font-semibold">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="space-y-1.5 pl-1 text-[11px] text-slate-600 font-medium text-left">
                      {theoryDetails.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-left">
                          <span className="text-emerald-500 font-bold">•</span>
                          <p className="flex-1 text-left">{b}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10.5px] text-amber-950 font-sans italic text-left">
                      <strong>TOEFL Prep Tip:</strong> {theoryDetails.toeflTip}
                    </div>

                    <div className="text-[10px] font-mono text-emerald-700 uppercase font-black bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                      INDICADOR KPI: {semanaActual.kpi.replace('🏆 Evidencia: ', '')}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 mt-6 text-[8px] font-mono text-slate-400 flex justify-between">
                  <span>TECLINGO CONTROL PLAN</span>
                  <span>PAGE {semanaActual.semana * 2} OF 36</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* AUDITING WORKBOOK & EVALUATION DRAWER (4 GRID SPACES) */}
        <div className="lg:col-span-4 bg-[#051120] border border-white/5 rounded-3xl p-5 space-y-5 text-left">
          
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Users size={16} className="text-white/50" />
            <h3 className="text-xs font-black font-mono uppercase tracking-wider text-white">
              Respuestas Del Alumno
            </h3>
          </div>

          {/* Student details widget */}
          <div className="p-3 bg-[#030911] rounded-2xl border border-white/5 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                {activeStudent.avatar}
              </div>
              <div className="text-left">
                <span className="text-white text-xs font-bold leading-snug block">{activeStudent.studentName}</span>
                <span className="text-[10px] text-white/40 block font-mono">ID: {activeStudent.studentId} • Progreso {activeStudent.progress}/18</span>
              </div>
            </div>

            <span className="bg-emerald-500/10 text-[#22c55e] border border-emerald-500/20 text-[9px] font-mono font-black px-1.5 py-0.5 rounded shrink-0">
              Activo
            </span>
          </div>

          {/* CHOOSE SUB-TABS (CLASSWORK / HOMEWORK SUBMISSIONS) */}
          <div className="flex gap-2 bg-black/40 p-1 border border-white/5 rounded-xl">
            <button
              type="button"
              onClick={() => setSubSeccion('ejercicios')}
              className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                subSeccion === 'ejercicios' ? 'bg-indigo-500/15 text-indigo-400' : 'text-white/40 hover:text-white/60'
              }`}
            >
              Classwork
            </button>
            <button
              type="button"
              onClick={() => setSubSeccion('tareas')}
              className={`flex-1 text-[10px] font-black font-mono py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                subSeccion === 'tareas' ? 'bg-yellow-500/15 text-yellow-400' : 'text-white/40 hover:text-white/60'
              }`}
            >
              Homework / KPI
            </button>
          </div>

          {/* ACTIVE SUBMISSION VIEWER CARD */}
          {(() => {
            const currentWeekGrade = activeStudent.grades[semanaActual.semana];
            const isExcellent = currentWeekGrade && currentWeekGrade >= 90;
            return (
              <div className={`p-4 rounded-2xl min-h-[180px] flex flex-col justify-between text-left gap-3 transition-all duration-300 ${
                isExcellent 
                  ? 'bg-emerald-950/30 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'bg-black/60 border border-white/5'
              }`}>
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/30 mb-2 border-b border-white/5 pb-1 text-left">
                    <span>SEMANA {semanaActual.semana} DEL WORKBOOK</span>
                    <span className="text-[#DEFF9A] uppercase tracking-wider font-bold">ENTREGADO</span>
                  </div>

                  {isExcellent && (
                    <div className="mb-3 text-[10px] font-mono font-black text-[#10b981] flex items-center gap-1.5 animate-pulse bg-emerald-500/10 px-2 py-1 rounded w-fit border border-emerald-500/20">
                      <span>[ ENTREGA APROBADA - EXCELENTE ]</span>
                    </div>
                  )}

                  {subSeccion === 'ejercicios' ? (
                    /* CLASSWORK REVIEW SUBMISSIONS */
                    <div className="space-y-3.5 text-left font-sans">
                      {reactivosPorSemana[semanaActual.semana]?.map((r) => {
                        const ans = activeStudent.answers[semanaActual.semana]?.classwork?.[r.id];
                        return (
                          <div key={r.id} className="space-y-1.5">
                            <span className="text-[9.5px] text-white/40 font-mono uppercase font-black block">{r.titulo} ({r.tipo})</span>
                            <div className="p-2.5 bg-[#030911] border border-white/5 rounded-xl">
                              <p className="text-[11px] text-white/95 font-mono break-words whitespace-pre-wrap">
                                {ans || <span className="italic text-white/20">[ Sin responder por el alumno ]</span>}
                              </p>
                            </div>

                            {/* Audio component for presentation / "Formulario de Contacto del Alumno" */}
                            {(r.id === "s1_r2" || r.titulo?.includes("Formulario de Contacto")) && (
                              <div className="mt-3 p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-white/40 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                                    <Volume2 size={12} className="text-[#10b981]" />
                                    AUDIO DE PRESENTACIÓN DE 1 MIN
                                  </span>
                                  <span className="text-[#10b981] font-black tracking-tight block">
                                    [ Bridge Accent Match: 92% ]
                                  </span>
                                </div>
                                
                                {/* Minimalist Player controls */}
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-8 h-8 rounded-full bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] border border-[#10b981]/30 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                                  >
                                    {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} className="ml-0.5" fill="currentColor" />}
                                  </button>
                                  
                                  <div className="flex-1 space-y-1">
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                                      {/* Progress bar */}
                                      <div 
                                        className="h-full bg-gradient-to-r from-emerald-500 to-[#10b981] rounded-full transition-all duration-300"
                                        style={{ width: `${(audioTime / 60) * 100}%` }}
                                      />
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-mono text-white/30">
                                      <span>0:{audioTime < 10 ? `0${audioTime}` : audioTime} / 1:00</span>
                                      {isPlaying && <span className="text-[#10b981] font-bold animate-pulse">PLAYING KPI AUDIT...</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }) || (
                        <p className="text-[11px] text-white/30 italic">No hay respuestas cargadas en esta semana.</p>
                      )}
                    </div>
                  ) : (
                    /* PORTAFOLIOS ASYNCHRONOUS EVIDENCE REVIEW */
                    <div className="space-y-2.5 text-left">
                      <span className="text-[9px] text-amber-400 font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15">
                        Evidencia de Portafolio Sometida
                      </span>
                      <div className="p-3 bg-[#030911] border border-white/5 rounded-xl">
                        <p className="text-[11px] text-white/90 leading-relaxed font-sans break-words whitespace-pre-wrap">
                          {activeStudent.answers[semanaActual.semana]?.homework || (
                            <span className="italic text-white/25">El alumno no ha cargado evidencias para esta semana.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Assessment grade label */}
                <div className="pt-2 flex justify-between items-center border-t border-white/5">
                  <span className="text-[10px] text-white/40 font-mono">Calificación Archivada:</span>
                  <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${isExcellent ? 'bg-emerald-500/20 text-[#10b981]' : 'bg-indigo-500/10 text-indigo-400'}`}>
                    {activeStudent.grades[semanaActual.semana] ? `${activeStudent.grades[semanaActual.semana]} / 100` : 'Pendiente'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* ADMIN RETRACTIVE & FEEDBACK WRITER INTERFACE */}
          <div className="p-5 bg-indigo-950/20 rounded-2xl border border-indigo-500/10 space-y-4 text-left">
            <span className="text-[10px] font-mono font-black text-indigo-300 uppercase tracking-widest block flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-indigo-400" />
              RETROALIMENTACIÓN ACADÉMICA
            </span>

            <div className="space-y-1.5">
              <span className="text-[9.5px] text-white/40 block">Calificar Entrega (0 - 100):</span>
              <div className="flex justify-center">
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={tempGrade} 
                  onChange={(e) => setTempGrade(e.target.value)}
                  placeholder="95" 
                  className="w-24 bg-[#111827] border border-emerald-500/20 focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none rounded-xl p-2.5 text-center text-xl font-mono text-[#10b981] font-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9.5px] text-white/40 block">Anotaciones del Director / Instructor:</span>
              <textarea
                rows={3}
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
                placeholder="Escribe la retroalimentación técnica o palmadita en la espalda aquí, compadre..."
                className="w-full bg-[#111827] border border-white/5 focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none rounded-xl p-3 text-xs text-white placeholder-white/20 transition-all resize-y font-sans custom-scrollbar"
              />
            </div>

            <div className="pt-2.5 space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                <span className="uppercase tracking-tight text-white/30">Control Oficial Sifv Encriptado:</span>
                <span>SIFV_TX_0x{activeStudent.studentId}_W{semanaActual.semana}_SECURE</span>
              </div>

              {alertSaved && (
                <div className="text-emerald-400 text-xs font-mono font-bold animate-pulse text-center bg-emerald-900/20 py-2.5 border border-emerald-500/20 rounded-xl">
                  ✓ ¡Auditoría Guardada Exitosamente en SIFV!
                </div>
              )}

              <button 
                type="button"
                onClick={handleSaveFeedback}
                className="w-full bg-[#10b981] hover:bg-[#059669] active:scale-[0.98] text-black font-black uppercase text-xs tracking-widest p-4 rounded-2xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={14} className="text-black" />
                <span>Guardar Auditoría Oficial</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
