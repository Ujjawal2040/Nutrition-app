import { motion } from 'framer-motion';

const NutrientCard = ({ label, value, target, unit, color, icon: Icon }) => {
  const percentage = Math.min(Math.round((value / target) * 100), 100);
  
  const colorMap = {
    orange: 'bg-orange-500 border-orange-500/30 text-orange-500 bg-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.3)]',
    blue: 'bg-blue-500 border-blue-500/30 text-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    green: 'bg-green-500 border-green-500/30 text-green-500 bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    yellow: 'bg-yellow-500 border-yellow-500/30 text-yellow-500 bg-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
  };

  const classes = colorMap[color] || colorMap.green;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl border ${classes.split(' ')[1]} ${classes.split(' ')[3]}`}>
          <Icon className={`${classes.split(' ')[2]} w-6 h-6`} />
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}<span className="text-sm font-normal text-slate-500 ml-1">{unit}</span></p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">{percentage}% of goal</span>
          <span className="text-slate-500">Goal: {target}{unit}</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${classes.split(' ')[0]} ${classes.split(' ')[4]}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NutrientCard;
