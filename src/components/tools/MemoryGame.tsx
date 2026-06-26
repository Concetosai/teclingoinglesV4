/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  RotateCcw, 
  Trophy, 
  Timer, 
  Brain,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface Card {
  id: number;
  content: string;
  image?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onClose: () => void;
  level: string;
}

const MEMORY_DATA = [
  { word: 'Airport', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109c05c?auto=format&fit=crop&q=80&w=150' },
  { word: 'Passport', img: 'https://images.unsplash.com/photo-1544027993-37dbfe43522e?auto=format&fit=crop&q=80&w=150' },
  { word: 'Flight', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109c05c?auto=format&fit=crop&q=80&w=150' },
  { word: 'Baggage', img: 'https://images.unsplash.com/photo-1565026073747-4835bc407b2b?auto=format&fit=crop&q=80&w=150' },
  { word: 'Departure', img: 'https://images.unsplash.com/photo-1490430657723-4d607c1503fc?auto=format&fit=crop&q=80&w=150' },
  { word: 'Destination', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=150' },
  { word: 'Ticket', img: 'https://images.unsplash.com/photo-1544027993-37dbfe43522e?auto=format&fit=crop&q=80&w=150' },
  { word: 'Lounge', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=150' },
];

export function MemoryGame({ onClose, level }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const initGame = useCallback(() => {
    const shuffled = [...MEMORY_DATA, ...MEMORY_DATA]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        content: item.word,
        image: item.img,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsGameOver(false);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (startTime && !isGameOver) {
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isGameOver]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched || isGameOver) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      
      if (cards[firstId].content === cards[secondId].content) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstId].isMatched = true;
          matchedCards[secondId].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(prev => {
            const newMatches = prev + 1;
            if (newMatches === MEMORY_DATA.length) {
              setIsGameOver(true);
            }
            return newMatches;
          });
        }, 600);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstId].isFlipped = false;
          resetCards[secondId].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#061a1a]/98 backdrop-blur-2xl"
    >
      <div className="w-full max-w-5xl h-[90vh] flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Memory Challenge</h2>
              <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest">{level} • Holiday Edition</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 px-8 py-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Timer size={16} className="text-cyan-400" />
                <span className="text-white font-black">{timer}s</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={16} className="text-purple-400" />
                <span className="text-white font-black">{moves} Movimientos</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-yellow-400" />
                <span className="text-white font-black">{matches}/{MEMORY_DATA.length}</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Game Grid */}
        <div className="flex-1 grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4 overflow-y-auto p-2">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className="relative aspect-[3/4] cursor-pointer perspective-1000"
            >
              <motion.div
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full h-full relative transform-style-3d shadow-xl rounded-2xl md:rounded-[2rem]"
              >
                {/* Front (Hidden) */}
                <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-[#DEFF9A]/10 flex items-center justify-center relative">
                    <Sparkles className="text-[#DEFF9A]/20" size={40} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#DEFF9A]/5 to-transparent" />
                  </div>
                </div>

                {/* Back (Visible) */}
                <div className="absolute inset-0 backface-hidden rotateY-180 bg-white/10 border border-[#DEFF9A]/40 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                  {card.isMatched && (
                    <div className="absolute top-2 right-2 text-[#DEFF9A]">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                  {card.image && (
                     <img src={card.image} alt="" className="w-full h-2/3 object-cover rounded-xl mb-4 opacity-80" />
                  )}
                  <p className="text-white text-[10px] md:text-sm font-black uppercase tracking-widest">{card.content}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Footer/Mobile stats */}
        <div className="md:hidden flex justify-around p-4 bg-white/5 rounded-2xl border border-white/5">
             <div className="flex flex-col items-center">
                <span className="text-white/40 text-[8px] font-black uppercase mb-1">Tiempo</span>
                <span className="text-white font-black">{timer}s</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-white/40 text-[8px] font-black uppercase mb-1">Moves</span>
                <span className="text-white font-black">{moves}</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-white/40 text-[8px] font-black uppercase mb-1">Logros</span>
                <span className="text-white font-black tracking-widest">{matches}/{MEMORY_DATA.length}</span>
             </div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center z-[300] p-6"
            >
              <div className="absolute inset-0 bg-[#061a1a]/80 backdrop-blur-md" />
              <motion.div 
                className="relative bg-white/5 border border-[#DEFF9A]/30 p-12 rounded-[4rem] text-center max-w-md w-full neo-glass"
              >
                <div className="w-24 h-24 bg-[#DEFF9A] rounded-full mx-auto flex items-center justify-center text-[#061a1a] shadow-[0_0_60px_rgba(222,255,154,0.4)] mb-8">
                  <Trophy size={48} />
                </div>
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">¡EXCELENTE DOMINIO!</h3>
                <p className="text-[#DEFF9A] text-xs font-black uppercase tracking-[0.3em] mb-8">Pioneer Level Cleared</p>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-white/20 text-[8px] font-black mb-1 uppercase tracking-widest">Tiempo</p>
                      <p className="text-2xl font-black text-white">{timer}s</p>
                   </div>
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-white/20 text-[8px] font-black mb-1 uppercase tracking-widest">Precisión</p>
                      <p className="text-2xl font-black text-white">{Math.round((MEMORY_DATA.length / moves) * 100)}%</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={initGame}
                    className="w-full py-5 bg-[#DEFF9A] text-[#061a1a] rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.2)] hover:scale-105 transition-all"
                  >
                    Jugar de Nuevo
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full py-5 bg-white/5 text-white/60 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Volver al Hub
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Sparkles({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
