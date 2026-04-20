import { motion } from 'framer-motion';
import { User, MessageCircle, Sparkles, TrendingUp } from 'lucide-react';

const DailyCoachCard = ({ name, burned, consumed, target }) => {
  const net = consumed - burned;
  const status = net <= target ? 'on-track' : 'over';

  return (
    <div className="flex flex-col gap-4">
      {/* Coach Message Bubble */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex gap-4 items-start"
      >
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary-500/20">
          <Sparkles size={20} />
        </div>
        <div className="glass-card p-5 rounded-tl-none border-primary-500/20 relative">
          <p className="text-sm leading-relaxed">
            Hey <span className="text-white font-bold">{name}</span>! 👋 
            {burned > 0 ? (
              <> You've burned <span className="text-yellow-500 font-bold">{burned} kcal</span> today through activity. That's fantastic progress!</>
            ) : (
              <> I see you haven't logged any physical activity yet. Even a 15-minute brisk walk can jumpstart your metabolism!</>
            )}
            <br /><br />
            {status === 'on-track' ? (
              <>You are currently <span className="text-green-500 font-bold">under your goal</span> by {target - net} kcal. You're doing great!</>
            ) : (
              <>You're slightly <span className="text-red-500 font-bold">over your goal</span>. Focus on lean protein and some light movement tonight!</>
            )}
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/5">Personalized Analysis</span>
          </div>
        </div>
      </motion.div>

      {/* Visual Recap Image Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-2 rounded-3xl border-white/5 shadow-2xl relative overflow-hidden group"
      >
        <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={12} className="text-primary-500" /> Active Burn
            </p>
            <h4 className="text-3xl font-black text-white">{burned} <span className="text-sm font-normal text-slate-500">kcal</span></h4>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
             <TrendingUp size={40} className="text-white" />
          </div>
        </div>
        {/* Decorative elements to simulate "Image/Chat" feel */}
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <MessageCircle size={100} />
        </div>
      </motion.div>
    </div>
  );
};

export default DailyCoachCard;
