import { Trophy, Award, Zap, Droplet, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Achievements = ({ badges = [] }) => {
  const allBadges = [
    { name: '7-Day Streak', icon: <Zap className="text-yellow-500" />, label: 'Log every day for a week' },
    { name: 'Hydration Hero', icon: <Droplet className="text-blue-500" />, label: 'Meet 2.5L goal 3 days in a row' },
    { name: 'Goal Crusher', icon: <Trophy className="text-primary-500" />, label: 'Hit exact calorie target' },
    { name: 'Recipe Explorer', icon: <Star className="text-orange-500" />, label: 'Try 5 new recipes' },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Award className="text-primary-500" /> My Achievements
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {allBadges.map((badge, idx) => {
          const isEarned = badges.some(b => b.name === badge.name);
          return (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-2xl flex flex-col items-center text-center gap-2 border transition-all ${
                isEarned 
                  ? 'bg-primary-500/10 border-primary-500/30' 
                  : 'bg-white/5 border-white/5 opacity-40 grayscale'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 mb-1 ${isEarned ? 'animate-pulse' : ''}`}>
                {badge.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">{badge.name}</p>
              <p className="text-[9px] text-slate-500 italic leading-tight">{badge.label}</p>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary-600/20 to-transparent border border-primary-500/10">
         <p className="text-[11px] text-slate-400 font-medium">Keep tracking to unlock more trophies! Every log counts toward your greatness. 🚀</p>
      </div>
    </div>
  );
};

export default Achievements;
