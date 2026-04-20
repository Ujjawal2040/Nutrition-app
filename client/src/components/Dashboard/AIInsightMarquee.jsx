import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../config/api';


const AIInsightMarquee = () => {
  const [insight, setInsight] = useState("Protus AI is analyzing your performance...");

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await api.post('/chat', 
          { message: "Give me a 1-sentence quick health insight or encouragement based on my profile." }
        );
        setInsight(res.data.reply);

      } catch (err) {
        console.error(err);
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="w-full bg-primary-500/5 border-b border-primary-500/10 h-10 flex items-center overflow-hidden">
      <div className="flex items-center gap-2 px-6 border-r border-primary-500/20 bg-primary-500/5 h-full relative z-10 shrink-0">
          <Sparkles size={14} className="text-primary-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">AI Insight</span>
      </div>
      <div className="flex-1 whitespace-nowrap overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="inline-block px-10 text-xs text-slate-400 font-medium"
          >
            {insight} • {insight} • {insight}
          </motion.div>
      </div>
    </div>
  );
};

export default AIInsightMarquee;
