/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Edit3, 
  ChevronLeft, 
  Timer, 
  Zap, 
  Brain, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

const mockQuestions: Question[] = [
  // A1 Questions
  {
    id: 1,
    text: "Choose the correct form: 'She ________ to the park every morning.'",
    options: ["Go", "Goes", "Going", "Gone"],
    correct: 1,
    explanation: "Para la tercera persona del singular en Presente Simple, añadimos 's' o 'es' al verbo.",
    level: 'A1'
  },
  {
    id: 2,
    text: "Which is a synonym for the word 'Huge'?",
    options: ["Small", "Tiny", "Enormous", "Thin"],
    correct: 2,
    explanation: "'Enormous' significa extremadamente grande, al igual que 'Huge'.",
    level: 'A1'
  },
  {
    id: 3,
    text: "Choose the correct option: 'They ________ to the gym twice a week.'",
    options: ["Goes", "Go", "Going", "Went"],
    correct: 1,
    explanation: "Con sujetos en plural como 'They', el verbo en Presente Simple se mantiene en su forma base.",
    level: 'A1'
  },
  {
    id: 4,
    text: "Complete: 'My brother ________ a new car.'",
    options: ["Has", "Have", "Having", "Is"],
    correct: 0,
    explanation: "Usamos 'has' para la tercera persona singular (he, she, it) del verbo 'have'.",
    level: 'A1'
  },
  {
    id: 5,
    text: "Which is the correct question?",
    options: ["Where you live?", "Where do you live?", "Where does you live?", "Where are you live?"],
    correct: 1,
    explanation: "Las preguntas en Presente Simple necesitan el auxiliar 'do' para el sujeto 'you'.",
    level: 'A1'
  },
  {
    id: 6,
    text: "Select the negative form: 'I like apples.'",
    options: ["I no like apples.", "I not like apples.", "I don't like apples.", "I doesn't like apples."],
    correct: 2,
    explanation: "Usamos 'don't' (do not) para negar en Presente Simple con el sujeto 'I'.",
    level: 'A1'
  },
  {
    id: 7,
    text: "What time is it?: 10:15",
    options: ["Ten fifty", "A quarter past ten", "Ten and fifteen", "Quarter to ten"],
    correct: 1,
    explanation: "'A quarter past ten' es la forma natural de decir las diez y cuarto.",
    level: 'A1'
  },
  {
    id: 8,
    text: "Choose the correct pronoun: '________ are my best friends.'",
    options: ["He", "She", "They", "It"],
    correct: 2,
    explanation: "Usamos 'They' para referirnos a un grupo de personas en plural.",
    level: 'A1'
  },
  {
    id: 9,
    text: "Complete: 'There ________ three books on the table.'",
    options: ["Is", "Am", "Are", "Be"],
    correct: 2,
    explanation: "Usamos 'there are' para sustantivos en plural.",
    level: 'A1'
  },
  {
    id: 10,
    text: "What is the opposite of 'Difficult'?",
    options: ["Hard", "Easy", "Fast", "Slow"],
    correct: 1,
    explanation: "'Easy' es lo opuesto a algo difícil.",
    level: 'A1'
  },

  // A2 Questions
  {
    id: 11,
    text: "Identify the error: 'I has been working here for three years.'",
    options: ["I", "has", "working", "for"],
    correct: 1,
    explanation: "El auxiliar correcto para 'I' en Presente Perfecto es 'have', no 'has'.",
    level: 'A2'
  },
  {
    id: 12,
    text: "Select the correct modal: 'I ________ speak three languages when I was five.'",
    options: ["Can", "Could", "Should", "Must"],
    correct: 1,
    explanation: "Usamos 'could' para expresar una habilidad en el pasado.",
    level: 'A2'
  },
  {
    id: 13,
    text: "Choose the correct preposition: 'He is very interested ________ learning Japanese.'",
    options: ["In", "On", "At", "For"],
    correct: 0,
    explanation: "El adjetivo 'interested' siempre va seguido de la preposición 'in'.",
    level: 'A2'
  },
  {
    id: 14,
    text: "Select the correct relative pronoun: 'The man ________ lives next door is a famous doctor.'",
    options: ["Which", "Who", "Whose", "Whom"],
    correct: 1,
    explanation: "Usamos 'who' como pronombre relativo para referirnos a personas.",
    level: 'A2'
  },
  {
    id: 15,
    text: "Complete the comparative: 'This car is ________ than that one.'",
    options: ["More fast", "Fastest", "Faster", "As fast"],
    correct: 2,
    explanation: "Para adjetivos cortos de una sílaba, el comparativo se forma añadiendo '-er'.",
    level: 'A2'
  },
  {
    id: 16,
    text: "Choose the correct past simple: 'They ________ to Italy last summer.'",
    options: ["Went", "Gone", "Go", "Was go"],
    correct: 0,
    explanation: "'Went' es el pasado irregular del verbo 'go'.",
    level: 'A2'
  },
  {
    id: 17,
    text: "Complete: 'Have you ________ finished your homework?'",
    options: ["Ever", "Yet", "Already", "Never"],
    correct: 2,
    explanation: "Usamos 'already' para indicar que algo se ha completado antes de lo esperado.",
    level: 'A2'
  },
  {
    id: 18,
    text: "Select the correct quantity word: 'How ________ sugar do you need?'",
    options: ["Many", "Much", "A few", "Lot"],
    correct: 1,
    explanation: "Sugar es un sustantivo incontable, por lo que usamos 'much' para preguntar por la cantidad.",
    level: 'A2'
  },
  {
    id: 19,
    text: "Choose the correct future form: 'Look at those clouds! It ________ rain.'",
    options: ["Will", "Is going to", "Shall", "Going to"],
    correct: 1,
    explanation: "Usamos 'going to' para predicciones basadas en evidencia presente.",
    level: 'A2'
  },
  {
    id: 20,
    text: "Select the correct adverb: 'She sings ________.'",
    options: ["Wait", "Beautifully", "Good", "Bad"],
    correct: 1,
    explanation: "Usamos adverbios (normalmente acabados en -ly) para describir cómo se realiza una acción.",
    level: 'A2'
  },

  // B1 Questions
  {
    id: 21,
    text: "Identify the voice: 'The book was written by George Orwell.'",
    options: ["Active Voice", "Passive Voice", "Future Tense", "Conditional"],
    correct: 1,
    explanation: "Es voz pasiva porque el sujeto (The book) recibe la acción realizada por el agente (George Orwell).",
    level: 'B1'
  },
  {
    id: 22,
    text: "Complete the sentence: 'If I ________ you, I would take that job immediately.'",
    options: ["Am", "Was", "Were", "Been"],
    correct: 2,
    explanation: "En oraciones condicionales de tipo 2, se usa 'were' para todas las personas del verbo 'to be'.",
    level: 'B1'
  },
  {
    id: 23,
    text: "Select the correct connector: '________ it was raining, they went for a walk.'",
    options: ["Because", "Although", "However", "Despite"],
    correct: 1,
    explanation: "Usamos 'although' para introducir una concesión o contraste.",
    level: 'B1'
  },
  {
    id: 24,
    text: "Complete: 'I wish I ________ more time to travel.'",
    options: ["Have", "Had", "Has", "Having"],
    correct: 1,
    explanation: "Usamos el pasado simple después de 'wish' para expresar un deseo sobre una situación presente.",
    level: 'B1'
  },
  {
    id: 25,
    text: "Choose the correct reported speech: 'I am hungry,' he said.",
    options: ["He said he is hungry.", "He said he was hungry.", "He said I am hungry.", "He said he hungry."],
    correct: 1,
    explanation: "En estilo indirecto, el presente simple suele cambiar a pasado simple.",
    level: 'B1'
  },
  {
    id: 26,
    text: "Select the correct gerund/infinitive: 'I enjoy ________ to classical music.'",
    options: ["Listen", "To listen", "Listening", "Listened"],
    correct: 2,
    explanation: "El verbo 'enjoy' siempre va seguido de la forma -ing (gerundio).",
    level: 'B1'
  },
  {
    id: 27,
    text: "Which modal expresses advice?: 'You ________ see a doctor about that cough.'",
    options: ["Must", "Should", "Can", "Could"],
    correct: 1,
    explanation: "'Should' se utiliza comúnmente para dar consejos o sugerencias.",
    level: 'B1'
  },
  {
    id: 28,
    text: "Complete: 'The house ________ built in 1920.'",
    options: ["Is", "Was", "Be", "Were"],
    correct: 1,
    explanation: "Forma de voz pasiva en pasado simple: Subject + was/were + past participle.",
    level: 'B1'
  },
  {
    id: 29,
    text: "Choose the correct perfect tense: 'By the time she arrived, we ________ dinner.'",
    options: ["Had finished", "Have finished", "Finished", "Will finish"],
    correct: 0,
    explanation: "Usamos el Past Perfect para una acción que ocurrió antes de otra acción en el pasado.",
    level: 'B1'
  },
  {
    id: 30,
    text: "Select the correct phrasal verb: 'Don't ________, you can do it!'",
    options: ["Give in", "Give up", "Give out", "Give back"],
    correct: 1,
    explanation: "'Give up' significa rendirse.",
    level: 'B1'
  },

  // B2 Questions
  {
    id: 31,
    text: "Which tense is this: 'I will have finished my project by next Friday.'",
    options: ["Future Simple", "Future Continuous", "Future Perfect", "Past Perfect"],
    correct: 2,
    explanation: "El 'Future Perfect' se usa para acciones que habrán terminado en un punto específico del futuro.",
    level: 'B2'
  },
  {
    id: 32,
    text: "Select the correct condition: 'If I had known, I ________ you.'",
    options: ["Would help", "Will help", "Would have helped", "Help"],
    correct: 2,
    explanation: "Condicional tipo 3: If + Past Perfect, would have + past participle.",
    level: 'B2'
  },
  {
    id: 33,
    text: "Choose the correct phrase: 'Hardly ________ the station when the train left.'",
    options: ["I had reached", "Had I reached", "I reached", "Did I reach"],
    correct: 1,
    explanation: "Usamos inversión después de adverbios negativos como 'Hardly' al inicio de la frase.",
    level: 'B2'
  },
  {
    id: 34,
    text: "Complete: 'It is essential that he ________ here on time.'",
    options: ["Be", "Is", "Was", "Am"],
    correct: 0,
    explanation: "Después de expresiones de importancia/urgencia, usamos el modo subjuntivo (forma base).",
    level: 'B2'
  },
  {
    id: 35,
    text: "Identify the usage of 'Used to': 'I ________ play football every weekend.'",
    options: ["Am used to", "Used to", "Get used to", "Was usage"],
    correct: 1,
    explanation: "'Used to' describe hábitos o estados pasados que ya no ocurren.",
    level: 'B2'
  },
  {
    id: 36,
    text: "Choose the correct form: 'The manager objects to ________ the strategy.'",
    options: ["Change", "Changing", "Changed", "Be change"],
    correct: 1,
    explanation: "La construcción 'object to' va seguida de un gerundio.",
    level: 'B2'
  },
  {
    id: 37,
    text: "Select the correct passive: 'They are repairing the road.'",
    options: ["The road is being repaired.", "The road is repaired.", "The road will be repaired.", "The road was repaired."],
    correct: 0,
    explanation: "Voz pasiva del presente continuo: is/are being + past participle.",
    level: 'B2'
  },
  {
    id: 38,
    text: "Complete: 'Due to his illness, he ________ stay in bed.'",
    options: ["Is bound to", "Bound for", "Is bound", "Binding"],
    correct: 0,
    explanation: "'Bound to' expresa una fuerte probabilidad o certeza.",
    level: 'B2'
  },
  {
    id: 39,
    text: "Identify the error: 'I prefer coffee than tea.'",
    options: ["I", "prefer", "coffee", "than"],
    correct: 3,
    explanation: "Usamos 'to' después de 'prefer', no 'than'.",
    level: 'B2'
  },
  {
    id: 40,
    text: "Choose the correct quantifier: 'There is ________ hope of finding survivors.'",
    options: ["Little", "A little", "Few", "A few"],
    correct: 0,
    explanation: "Usamos 'little' (sin 'a') para indicar una cantidad casi inexistente o insuficiente.",
    level: 'B2'
  },

  // C1 Questions
  {
    id: 41,
    text: "Which expresses a hypothetical past?: 'If only I ________ more attention!'",
    options: ["Paid", "Would pay", "Had paid", "Have paid"],
    correct: 2,
    explanation: "Usamos 'If only' + Past Perfect para lamentar algo del pasado.",
    level: 'C1'
  },
  {
    id: 42,
    text: "Select the correct inversion: 'Not until much later ________ the truth.'",
    options: ["He learned", "Did he learn", "He did learn", "Has he learned"],
    correct: 1,
    explanation: "Después de expresiones negativas temporales al inicio, realizamos inversión del auxiliar.",
    level: 'C1'
  },
  {
    id: 43,
    text: "Complete using the correct emphasis: 'What I need ________ a long holiday.'",
    options: ["Is", "Are", "Am", "Be"],
    correct: 0,
    explanation: "En oraciones escindidas con 'What', el verbo concuerda con el predicado.",
    level: 'C1'
  },
  {
    id: 44,
    text: "Choose the most formal: 'Should you require assistance, do not ________ to contact us.'",
    options: ["Wait", "Reluctant", "Hesitate", "Delay"],
    correct: 2,
    explanation: "'Hesitate' es el término estándar formal en correspondencia para invitar al contacto.",
    level: 'C1'
  },
  {
    id: 45,
    text: "Identify the advanced phrasal verb: 'The project fell ________ due to lack of funding.'",
    options: ["Through", "Down", "Away", "Off"],
    correct: 0,
    explanation: "'Fall through' significa fracasar o no llegar a concretarse.",
    level: 'C1'
  },
  {
    id: 46,
    text: "Select the correct usage: 'He is said ________ the richest man in town.'",
    options: ["Being", "That he is", "To be", "Is"],
    correct: 2,
    explanation: "Estructura de infinitivo personal pasivo: It is said + to-infinitive.",
    level: 'C1'
  },
  {
    id: 47,
    text: "Which is more appropriate?: 'No sooner ________ than the phone rang.'",
    options: ["I had sat down", "Had I sat down", "Did I sit down", "Sitting down"],
    correct: 1,
    explanation: "La estructura 'No sooner... than' requiere inversión y el uso de Past Perfect.",
    level: 'C1'
  },
  {
    id: 48,
    text: "Complete: 'The government is ________ of the public's concerns.'",
    options: ["Mindful", "Attention", "Caring", "Thinking"],
    correct: 0,
    explanation: "'Mindful of' es una forma avanzada y académica de decir consciente o atento a.",
    level: 'C1'
  },
  {
    id: 49,
    text: "Select the correct participle clause: '________ by the news, she broke into tears.'",
    options: ["Shocking", "Shocked", "Being shocked", "Having shocked"],
    correct: 1,
    explanation: "Usamos el participio pasado para cláusulas de motivo con significado pasivo.",
    level: 'C1'
  },
  {
    id: 50,
    text: "Choose the correct idiom: 'He decided to stop working ________.'",
    options: ["For good", "By good", "In good", "With good"],
    correct: 0,
    explanation: "'For good' significa permanentemente.",
    level: 'C1'
  },

  // C2 Questions
  {
    id: 51,
    text: "Which is a hallmark of C2 prose?: 'The sheer ________ of the task was daunting.'",
    options: ["Magnitude", "Big", "Scale", "Extension"],
    correct: 0,
    explanation: "'Magnitude' aporta un matiz de seriedad y escala apropiado para niveles superiores.",
    level: 'C2'
  },
  {
    id: 52,
    text: "Select the most sophisticated phrase: 'Let us ________ aside any differences.'",
    options: ["Put", "Set", "Lay", "Leave"],
    correct: 1,
    explanation: "'Set aside' es común en contextos de negociación formal o diplomacia.",
    level: 'C2'
  },
  {
    id: 53,
    text: "Complete using the correct nuance: 'The evidence points ________ to his involvement.'",
    options: ["Clearly", "Inevitably", "Indubitably", "Inescapably"],
    correct: 2,
    explanation: "'Indubitably' es un adverbio de registro muy alto que significa sin duda alguna.",
    level: 'C2'
  },
  {
    id: 54,
    text: "Choose the complex structure: 'Were it not for your help, I ________ finished.'",
    options: ["Will not have", "Would not have", "Haven't", "Hadn't"],
    correct: 1,
    explanation: "Inversión en condicionales: 'Were it not for...' equivale a 'If it hadn't been for...'.",
    level: 'C2'
  },
  {
    id: 55,
    text: "Identify the literary phrasal verb: 'The rumors were entirely ________ of truth.'",
    options: ["Void", "Empty", "Lacking", "Bereft"],
    correct: 3,
    explanation: "'Bereft of' es una forma literaria de decir carente de algo (especialmente algo positivo).",
    level: 'C2'
  },
  {
    id: 56,
    text: "Select the correct advanced noun: 'There is a ________ of evidence for that theory.'",
    options: ["Paucity", "Few", "Little", "Scarcity"],
    correct: 0,
    explanation: "'Paucity' es un término académico preciso para indicar una escasez extrema.",
    level: 'C2'
  },
  {
    id: 57,
    text: "Choose the correct collocation: 'He holds an ________ belief in human progress.'",
    options: ["Unshakeable", "Immovable", "Fixed", "Hard"],
    correct: 0,
    explanation: "'Unshakeable belief' is a strong, natural native-like collocation.",
    level: 'C2'
  },
  {
    id: 58,
    text: "Identify the correct use of 'Notwithstanding': '________ the weather, the event was a success.'",
    options: ["Notwithstanding", "In spite", "Despite of", "Regardless"],
    correct: 0,
    explanation: "'Notwithstanding' can be used as a preposition meaning 'despite' in formal registers.",
    level: 'C2'
  },
  {
    id: 59,
    text: "Select the correct 'lest' structure: 'He kept quiet lest he ________ his secret.'",
    options: ["Reveal", "Reveals", "Revealed", "Would reveal"],
    correct: 0,
    explanation: "'Lest' is followed by the subjunctive (base form) or 'should'.",
    level: 'C2'
  },
  {
    id: 60,
    text: "Choose the most precise verb: 'She ________ over her decision for weeks.'",
    options: ["Thought", "Agonized", "Reflected", "Pondered"],
    correct: 1,
    explanation: "'Agonized' expresses a high level of mental struggle and intensity.",
    level: 'C2'
  }
];

export function TestMaker({ onClose }: { onClose: () => void }) {
  const [difficulty, setDifficulty] = useState<Question['level'] | 'Mixed'>('Mixed');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isStarted, setIsStarted] = useState(false);

  // Initialize quiz with 10 questions
  const startQuiz = (level: Question['level'] | 'Mixed') => {
    let pool = [...mockQuestions];
    if (level !== 'Mixed') {
      pool = pool.filter(q => q.level === level);
    }
    
    // Select 10 random questions from the pool
    const selected = pool
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    
    setQuizQuestions(selected);
    setDifficulty(level);
    setIsStarted(true);
    setCurrentIdx(0);
    setScore(0);
    setTimeLeft(30);
    setShowResult(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  useEffect(() => {
    if (isStarted && !showResult && timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isAnswered, isStarted, showResult]);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === quizQuestions[currentIdx].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  if (!isStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] bg-[#061a1a]/98 backdrop-blur-3xl flex items-center justify-center p-8"
      >
        <div className="max-w-2xl w-full neo-glass rounded-[4rem] p-12 md:p-16 border-white/5 space-y-12 text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto">
               <Brain size={48} />
            </div>
            
            <div className="space-y-4">
               <h1 className="text-4xl font-black text-white uppercase tracking-tight">AI Scanner</h1>
               <p className="text-purple-400 text-xs font-black uppercase tracking-[0.3em]">Grammar & Structure Matrix</p>
               <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                  Comienza una evaluación diagnóstica de 10 preguntas generada por IA para detectar tu nivel gramatical preciso.
               </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                 <button 
                  key={lvl}
                  onClick={() => startQuiz(lvl as Question['level'])}
                  className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group"
                 >
                    <span className="block text-white font-black text-xl mb-1">{lvl}</span>
                    <span className="text-[8px] font-black uppercase text-purple-400 tracking-widest">{lvl === 'A1' || lvl === 'A2' ? 'Basic' : lvl === 'B1' || lvl === 'B2' ? 'Intermediate' : 'Advanced'}</span>
                 </button>
               ))}
               <button 
                onClick={() => startQuiz('Mixed')}
                className="col-span-2 md:col-span-3 p-6 rounded-[2rem] bg-purple-500 text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(168,85,247,0.3)]"
               >
                  Test Adaptativo (Mixto)
               </button>
            </div>

            <button onClick={onClose} className="text-white/20 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
               Cancelar y Salir
            </button>
        </div>
      </motion.div>
    );
  }

  if (showResult) {
    const finalScorePerc = Math.round((score / quizQuestions.length) * 100);
    let detectedLevel = 'A1';
    if (difficulty !== 'Mixed') {
      detectedLevel = finalScorePerc >= 80 ? `${difficulty}+` : difficulty;
    } else {
      if (finalScorePerc >= 95) detectedLevel = 'C2';
      else if (finalScorePerc >= 85) detectedLevel = 'C1';
      else if (finalScorePerc >= 70) detectedLevel = 'B2';
      else if (finalScorePerc >= 50) detectedLevel = 'B1';
      else if (finalScorePerc >= 30) detectedLevel = 'A2';
      else detectedLevel = 'A1';
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[120] bg-[#061a1a]/98 backdrop-blur-3xl flex items-center justify-center p-8"
      >
         <div className="max-w-xl w-full text-center space-y-12">
            <div className="w-32 h-32 rounded-[2.5rem] bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto shadow-[0_0_50px_rgba(168,85,247,0.3)]">
               <Award size={64} />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-white uppercase tracking-tight">Evaluación Completada</h2>
               <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.4em]">Resumen de Desempeño IA</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Puntaje Final</p>
                  <h4 className="text-3xl font-black text-white">{finalScorePerc}%</h4>
               </div>
               <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Nivel Detectado</p>
                  <h4 className="text-3xl font-black text-purple-400">{detectedLevel}</h4>
               </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 text-left">
               <div className="flex items-center gap-3 mb-4">
                  <Brain size={20} className="text-purple-400" />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Análisis de la IA</span>
               </div>
               <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                  Has demostrado un dominio sólido en {difficulty === 'Mixed' ? 'estructuras generales' : difficulty}. Se detectaron {10 - score} áreas de mejora que han sido integradas a tu ruta PDP de aprendizaje adaptativo.
               </p>
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={() => setIsStarted(false)}
                 className="flex-1 py-6 rounded-3xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/10"
               >
                  Reiniciar Test
               </button>
               <button 
                 onClick={onClose}
                 className="flex-1 py-6 rounded-3xl bg-purple-500 text-white text-[11px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform"
               >
                  Regresar al Dashboard
               </button>
            </div>
         </div>
      </motion.div>
    );
  }

  const currentQ = quizQuestions[currentIdx];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-[#061a1a]/98 backdrop-blur-3xl overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto p-8 py-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={onClose}
            className="flex items-center gap-3 text-white/40 hover:text-purple-400 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/30">
               <ChevronLeft size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Salir del Examen</span>
          </button>

          <div className="text-center">
             <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">AI Scanner</h1>
             <p className="text-purple-400 text-[9px] font-black uppercase tracking-[0.3em]">AI Grammar & Structure Matrix · Beta 1.0</p>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Pregunta actual</p>
                <p className="text-2xl font-black text-purple-400 tracking-tighter">{currentIdx + 1} / {quizQuestions.length}</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <TrendingUp size={20} />
             </div>
          </div>
        </header>

        {/* Progress Bar Container */}
        <div className="max-w-4xl mx-auto w-full mb-20 space-y-4">
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,1)]"
              />
           </div>
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                 <Zap size={12} className="text-purple-400" />
                 <span className="text-purple-400 text-[8px] font-black uppercase tracking-widest">Adaptive: {currentQ.level}</span>
              </div>
              
              <div className="flex items-center gap-2">
                 <Timer size={14} className="text-white/20" />
                 <span className={`text-[10px] font-black tabular-nums ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white/40'}`}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                 </span>
              </div>
           </div>
        </div>

        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center relative">
          {/* Question Panel */}
          <div className="w-full neo-glass border-white/5 rounded-[4rem] p-12 md:p-16 space-y-12">
              <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight text-center leading-tight">
                 {currentQ.text}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentQ.options.map((opt, i) => {
                   let statusStyles = "bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.08] hover:border-white/20";
                   if (isAnswered) {
                      if (i === currentQ.correct) {
                        statusStyles = "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
                      } else if (selectedOption === i) {
                        statusStyles = "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
                      } else {
                        statusStyles = "bg-white/[0.01] border-white/5 text-white/20 opacity-40";
                      }
                   }

                   return (
                     <button
                       key={i}
                       onClick={() => handleAnswer(i)}
                       disabled={isAnswered}
                       className={`p-6 md:p-8 rounded-[2rem] border-2 transition-all text-base md:text-lg font-black uppercase tracking-tight flex items-center justify-between group ${statusStyles}`}
                     >
                        <span>{opt}</span>
                        {isAnswered && i === currentQ.correct && <CheckCircle2 size={24} />}
                        {isAnswered && i === selectedOption && i !== currentQ.correct && <XCircle size={24} />}
                     </button>
                   );
                 })}
              </div>

              <AnimatePresence>
                 {isAnswered && (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-8"
                   >
                      <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border-l-4 border-purple-500">
                         <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-2">Explicación IA</p>
                         <p className="text-white text-base font-medium leading-relaxed">{currentQ.explanation}</p>
                      </div>

                      <button 
                        onClick={handleNext}
                        className="w-full py-6 rounded-3xl bg-white text-[#061a1a] text-xs font-black uppercase tracking-[0.2em] hover:bg-purple-400 hover:text-white transition-all flex items-center justify-center gap-4 group"
                      >
                         Siguiente Pregunta <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                   </motion.div>
                 )}
              </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

