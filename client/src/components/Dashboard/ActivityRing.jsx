import { motion } from 'framer-motion';

const ActivityRing = ({ consumed, burned, target }) => {
  const percentageConsumed = Math.min((consumed / target) * 100, 100);
  const percentageBurned = Math.min((burned / (target * 0.2)) * 100, 100); // 20% of intake as active burn target

  return (
    <div className="relative flex items-center justify-center w-72 h-72 mx-auto group">
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-primary-500/5 blur-[80px] rounded-full group-hover:bg-primary-500/10 transition-all duration-1000" />
      
      <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
        {/* Total Consumed Ring */}
        <circle
          cx="144"
          cy="144"
          r="110"
          stroke="currentColor"
          strokeWidth="20"
          fill="transparent"
          className="text-white/[0.03]"
        />
        <motion.circle
          cx="144"
          cy="144"
          r="110"
          stroke="currentColor"
          strokeWidth="20"
          strokeDasharray={2 * Math.PI * 110}
          initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - percentageConsumed / 100) }}
          fill="transparent"
          strokeLinecap="round"
          className="text-primary-500"
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Calories Burned Ring (Inner) */}
        <circle
          cx="144"
          cy="144"
          r="85"
          stroke="currentColor"
          strokeWidth="14"
          fill="transparent"
          className="text-white/[0.03]"
        />
        <motion.circle
          cx="144"
          cy="144"
          r="85"
          stroke="currentColor"
          strokeWidth="14"
          strokeDasharray={2 * Math.PI * 85}
          initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - percentageBurned / 100) }}
          fill="transparent"
          strokeLinecap="round"
          className="text-yellow-500"
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute flex flex-col items-center">
        <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-black text-white tracking-tighter"
        >
            {consumed - burned}
        </motion.span>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Net Balance</span>
        <div className="mt-4 flex gap-1">
            {[1,2,3].map(i => (
                <div key={i} className="w-1 h-3 bg-primary-500/20 rounded-full" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityRing;
