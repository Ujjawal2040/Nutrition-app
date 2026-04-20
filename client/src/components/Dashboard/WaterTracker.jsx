import { motion } from 'framer-motion';
import { Plus, Droplet } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../config/api';


const WaterTracker = ({ initialWater }) => {
  const [water, setWater] = useState(initialWater || 0);
  const goal = 3000; // 3L
  const percentage = Math.min((water / goal) * 100, 100);

  useEffect(() => {
    setWater(initialWater);
  }, [initialWater]);

  const addWater = async (amount) => {
    try {
      const newTotal = water + amount;
      setWater(newTotal);
      
      await api.patch('/nutrition/log/water', { 
        amount: newTotal, 
        date: new Date().toISOString() 
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card p-8 flex flex-col h-full relative overflow-hidden group">
      {/* Background Wave Effect */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: `${100 - percentage}%` }}
        transition={{ type: 'spring', damping: 20, stiffness: 40 }}
        className="absolute inset-0 bg-primary-500/10 pointer-events-none"
      >
        <svg viewBox="0 0 120 28" className="absolute -top-6 w-[200%] animate-[wave_10s_linear_infinite] fill-primary-500/20">
            <path d="M0 15 Q30 0 60 15 t60 0 v20 h-120 z" />
        </svg>
      </motion.div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-500/20 rounded-lg">
                <Droplet className="text-blue-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Hydration</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" className="stroke-white/5 fill-transparent" strokeWidth="8" />
                    <motion.circle 
                        cx="80" cy="80" r="70" 
                        className="stroke-blue-500 fill-transparent" 
                        strokeWidth="8" 
                        strokeDasharray={440}
                        animate={{ strokeDashoffset: 440 - (440 * percentage) / 100 }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-white">{Math.round(percentage)}%</span>
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{water}ml / {goal}ml</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-8">
            <button 
              onClick={() => addWater(250)}
              className="py-3 bg-white/5 border border-white/5 rounded-2xl text-white font-bold hover:bg-blue-500/20 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> 250ml
            </button>
            <button 
              onClick={() => addWater(500)}
              className="py-3 bg-white/5 border border-white/5 rounded-2xl text-white font-bold hover:bg-blue-500/20 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> 500ml
            </button>
        </div>
      </div>

      <style>{`
        @keyframes wave {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default WaterTracker;
