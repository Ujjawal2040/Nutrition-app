import { 
  BookOpen, 
  Dumbbell, 
  Zap, 
  PlayCircle, 
  ArrowRight, 
  Search, 
  ChevronRight, 
  Target, 
  Trophy, 
  Info, 
  X,
  Loader2,
  BrainCircuit,
  Flame,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import api from '../config/api';


const exercises = [
  { name: "Bench Press", category: "Chest", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop" },
  { name: "Deadlift", category: "Back", image: "https://images.unsplash.com/photo-1541534741688-6078c65b5a33?q=80&w=800&auto=format&fit=crop" },
  { name: "Squat", category: "Legs", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" },
  { name: "Overhead Press", category: "Shoulders", image: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=800&auto=format&fit=crop" }
];

const fitnessBlogs = [
  {
    title: "The Science of Hypertrophy",
    excerpt: "Why the 'anabolic window' is a myth and how to actually structure your protein intake for gains.",
    category: "Science",
    icon: <BrainCircuit className="text-blue-500" />
  },
  {
    title: "Cardio vs. Weights for Fat Loss",
    excerpt: "Which one burns more calories? The answer depends on your long-term metabolic health.",
    category: "Metabolic",
    icon: <Flame className="text-orange-500" />
  }
];

const FitnessHub = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('exercise'); // 'exercise' or 'article'

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) || 
    ex.category.toLowerCase().includes(search.toLowerCase())
  );

  const fetchContent = async (topic, type = 'exercise') => {
    setLoading(true);
    setContentData(null);
    setSelectedTopic(topic);
    setViewType(type);
    
    try {
      const endpoint = type === 'exercise' ? 'workout-deep-dive' : 'health-guide';
      const payload = type === 'exercise' ? { exercise: topic.title || topic.name } : { topic: topic.title || topic.name };
      
      const res = await api.post(`/chat/${endpoint}`, payload);

      
      setContentData(type === 'exercise' ? res.data.data : res.data.data.guide);
    } catch (err) {
      console.error(err);
      setContentData(type === 'exercise' 
        ? { steps: ["Error loading guide."], muscles: [], difficulty: "N/A", proTips: [] }
        : "Failed to load the article. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-7xl mx-auto pb-32 relative">
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-5xl font-black text-white mb-3 flex items-center gap-4">
                <Dumbbell className="text-primary-500" size={48} /> Fitness Hub
                </h1>
                <p className="text-slate-400 text-lg max-w-xl">
                    Our AI Personal Training suite. Learn form, build routines, and master your physique.
                </p>
            </div>
            <button 
              onClick={() => fetchContent({ name: "Custom AI Workout Plan" }, 'exercise')}
              className="px-8 py-4 bg-primary-600 rounded-2xl text-white font-black hover:bg-primary-700 shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] transition-all flex items-center gap-3 whitespace-nowrap active:scale-95"
            >
              <Zap size={24} fill="currentColor" /> Generate AI Workout
            </button>
        </div>
      </header>

      {/* Discovery Search */}
      <div className="relative mb-16 max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
        <input 
            type="text" 
            placeholder="Search exercises (e.g., Pullups, RDL)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-field pl-14 h-16 text-xl text-white rounded-[24px]"
        />
        {search && (
            <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => fetchContent({ name: search }, 'exercise')}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-2 rounded-xl font-bold text-sm"
            >
                AI Guide
            </motion.button>
        )}
      </div>

      {/* Exercise Grid */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Target className="text-primary-500" /> Movement Library
            </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExercises.map((ex, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              onClick={() => fetchContent(ex, 'exercise')}
              className="glass-card overflow-hidden group cursor-pointer border-white/5"
            >
              <div className="h-48 relative overflow-hidden">
                 <img src={ex.image} alt={ex.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                 <span className="absolute bottom-4 left-4 bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                    {ex.category}
                 </span>
              </div>
              <div className="p-5 flex items-center justify-between">
                <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{ex.name}</h3>
                <ChevronRight className="text-slate-600 group-hover:text-primary-500 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Science Base */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-8 text-white">Fitness & Science</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fitnessBlogs.map((post, i) => (
                    <div 
                      key={i} 
                      onClick={() => fetchContent(post, 'article')}
                      className="glass-card p-8 group hover:bg-white/5 transition-all cursor-pointer flex flex-col h-full border-white/5"
                    >
                        <div className="w-12 h-12 bg-white/5 rounded-xl mb-6 flex items-center justify-center group-hover:bg-primary-500/10">
                            {post.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">"{post.excerpt}"</p>
                        <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            Read Deep Dive <ArrowRight size={14} />
                        </span>
                    </div>
                ))}
            </div>
        </div>
        <div className="glass-card p-8 bg-primary-950/20 border-primary-500/20">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Weekly Legend
            </h2>
            <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Consistency King</p>
                    <p className="text-white font-bold">4 Day Gym Streak</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Burned</p>
                    <p className="text-white font-bold">1,420 kcal this week</p>
                </div>
                <button 
                  onClick={() => navigate('/fitness-tracker')}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-primary-500 transition-all"
                >
                    View Your Stats
                </button>
            </div>
        </div>
      </section>

      {/* Unified Detail Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-slate-950/90 backdrop-blur-xl transition-all"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="glass-card w-full max-w-5xl h-fit max-h-[90vh] overflow-hidden flex flex-col border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
               <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary-500/50">
                        <img src="/trainer.png" alt="AI Trainer" className="w-full h-full object-cover" />
                     </div>
                     <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedTopic.name || selectedTopic.title}</h2>
                  </div>
                  <button onClick={() => setSelectedTopic(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                     <X className="text-slate-400" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                  {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center gap-6">
                       <Loader2 className="text-primary-500 animate-spin" size={64} />
                       <div className="space-y-4">
                          <p className="text-2xl font-black text-white animate-pulse uppercase">
                            Protus {viewType === 'exercise' ? 'Trainer' : 'Researcher'} is analyzing...
                          </p>
                       </div>
                    </div>
                  ) : viewType === 'exercise' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                       <div className="space-y-10">
                          <div>
                             <h4 className="text-primary-500 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Clock size={16} /> Step-by-Step Guide
                             </h4>
                             <div className="space-y-6">
                                {contentData?.steps?.map((step, i) => (
                                   <div key={i} className="flex gap-4">
                                      <span className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 font-bold shrink-0">{i+1}</span>
                                      <p className="text-slate-300 text-lg leading-relaxed">{step}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                          <div className="p-6 bg-white/[0.03] rounded-[32px] border border-white/5">
                             <h4 className="text-yellow-500 font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Info size={16} /> Pro Tips
                             </h4>
                             <ul className="space-y-3">
                                {contentData?.proTips?.map((tip, i) => (
                                   <li key={i} className="text-sm text-slate-400 flex items-start gap-2 italic">
                                      <span className="text-yellow-500 mt-1">✦</span> {tip}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                       <div className="space-y-10">
                          <div className="h-64 rounded-[40px] bg-slate-900 overflow-hidden relative border border-white/5 shadow-2xl">
                             <img src="/gym.png" alt="Trainer" className="w-full h-full object-cover opacity-60" />
                             <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-t from-slate-950 to-transparent">
                                <p className="text-center font-bold text-white text-xl uppercase tracking-widest bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                    {contentData?.difficulty} Effort
                                </p>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="glass-card p-6 bg-white/5 text-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Primary Muscles</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                   {contentData?.muscles?.map((m, i) => (
                                      <span key={i} className="bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full text-[10px] font-bold border border-primary-500/20">{m}</span>
                                   ))}
                                </div>
                             </div>
                             <div className="glass-card p-6 bg-white/5 text-center flex flex-col justify-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Volume Guidance</p>
                                <p className="text-lg font-black text-white">{contentData?.recommendedVolume}</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => { setSelectedTopic(null); navigate('/fitness-tracker'); }}
                            className="w-full py-6 bg-primary-600 rounded-[32px] text-white font-black text-xl hover:bg-primary-700 shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center gap-4 transition-all hover:-translate-y-2"
                          >
                             Log This Session <Flame fill="currentColor" />
                          </button>
                       </div>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-slate max-w-none">
                       {contentData ? (
                         <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                            {contentData.split('\n').map((line, i) => {
                              if (line.startsWith('#')) return <h3 key={i} className="text-white font-black mt-10 first:mt-0 text-2xl uppercase tracking-tighter">{line.replace(/#/g, '')}</h3>;
                              if (line.startsWith('**')) return <p key={i} className="font-bold text-primary-400 border-l-2 border-primary-500 pl-4 py-1 bg-primary-500/5">{line.replace(/\*\*/g, '')}</p>;
                              return <p key={i}>{line}</p>;
                            })}
                         </div>
                       ) : (
                         <div className="text-center py-20 opacity-20 italic">No article loaded.</div>
                       )}
                    </div>
                  )}
               </div>

               {viewType === 'article' && (
                  <div className="p-6 bg-white/5 border-t border-white/5 flex justify-between items-center">
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Generated by Llama 3.3 Science Hub</p>
                     <button onClick={() => window.print()} className="btn-primary py-2 px-6 text-xs shadow-lg">Download PDF</button>
                  </div>
               )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FitnessHub;
