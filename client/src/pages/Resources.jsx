import { 
  BookOpen, 
  Zap, 
  Droplet, 
  Sun, 
  Pill, 
  ArrowLeft, 
  Clock, 
  Star, 
  ChevronRight,
  Lightbulb,
  Search,
  Heart,
  X,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';

const articles = [
  {
    title: "Optimizing Iron Absorption",
    excerpt: "Learn how to pair vitamin C with plant-based iron sources for maximum benefits. A critical guide for vegetarians.",
    icon: <Zap className="text-yellow-400" />,
    color: "yellow",
    readTime: "5 min",
    category: "Nutrition"
  },
  {
    title: "The Hydration Equation",
    excerpt: "Why 8 glasses a day is just a starting point and how to find your perfect intake based on body mass.",
    icon: <Droplet className="text-blue-400" />,
    color: "blue",
    readTime: "4 min",
    category: "Maintenance"
  },
  {
    title: "Vitamin D: The Sunshine Nutrient",
    excerpt: "Nearly 40% of adults are deficient. Find out how to get enough even during high-pollution or winter months.",
    icon: <Sun className="text-orange-400" />,
    color: "orange",
    readTime: "7 min",
    category: "Science"
  },
  {
    title: "The Power of B12",
    excerpt: "A critical guide on fortified foods and supplementation. Essential knowledge for the plant-powered athlete.",
    icon: <Pill className="text-purple-400" />,
    color: "purple",
    readTime: "6 min",
    category: "Supplements"
  }
];

const Resources = () => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const fetchGuide = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setGuideData(null);
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      const res = await axios.post('http://localhost:5000/api/chat/health-guide', { 
        topic: topic.title 
      }, {
        headers: { Authorization: `Bearer ${u.token}` }
      });
      setGuideData(res.data.data.guide);
    } catch (err) {
      console.error(err);
      setGuideData("Failed to generate guide. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto pb-24 relative">
      <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <header className="mb-16">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-500/10 rounded-2xl">
                <BookOpen className="text-primary-500" size={32} />
            </div>
            <h1 className="text-4xl font-black text-white">Health Library</h1>
        </div>
        <p className="text-slate-400 max-w-2xl leading-relaxed text-lg">
          Evidence-based education to empower your transformation. 
          Discover the science behind your habits via Protus Intelligence.
        </p>
      </header>

      <div className="relative mb-12 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
            type="text" 
            placeholder="Search guides, nutrients, or categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-field pl-12 h-14 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article) => (
            <motion.div 
              key={article.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className="glass-card p-8 group hover:bg-white/5 transition-all cursor-pointer border-white/5 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors`}>
                      {article.icon}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {article.readTime}</span>
                      <span className="bg-white/5 px-2 py-1 rounded">{article.category}</span>
                  </div>
              </div>

              <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                  {article.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-8">
                  {article.excerpt}
                  </p>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                  <button 
                    onClick={() => fetchGuide(article)}
                    className="text-primary-500 font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest"
                  >
                    Deep Dive <ChevronRight size={18} />
                  </button>
                  <Heart size={18} className="text-slate-700 hover:text-red-500 transition-colors" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredArticles.length === 0 && (
         <div className="text-center py-20 glass-card bg-white/[0.02] border-dashed border-2 border-white/5 rounded-[40px]">
            <Search size={64} className="mx-auto mb-6 text-slate-700" />
            <h3 className="text-2xl font-bold text-white mb-2">Topic not in library?</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Our AI can research and write a custom guide for "{search}" in seconds.</p>
            <button 
              onClick={() => fetchGuide({ title: search, icon: <Zap className="text-primary-400" /> })}
              className="btn-primary px-10 py-4 shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]"
            >
              Ask AI to Write Guide
            </button>
         </div>
      )}

      <AnimatePresence>
        {selectedTopic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-white/10"
            >
               <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary-500/10 rounded-lg">
                        {selectedTopic.icon}
                     </div>
                     <h2 className="text-xl font-bold text-white">{selectedTopic.title}</h2>
                  </div>
                  <button onClick={() => setSelectedTopic(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                     <X className="text-slate-400" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                  {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center gap-6">
                       <Loader2 className="text-primary-500 animate-spin" size={48} />
                       <div className="space-y-2">
                          <p className="text-lg font-bold text-white animate-pulse">Protus AI is researching your guide...</p>
                          <p className="text-sm text-slate-500">Connecting to clinical research databases...</p>
                       </div>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-slate max-w-none">
                       {guideData ? (
                         <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                            {guideData.split('\n').map((line, i) => {
                              if (line.startsWith('#')) return <h3 key={i} className="text-white font-black mt-10 first:mt-0">{line.replace(/#/g, '')}</h3>;
                              if (line.startsWith('**')) return <p key={i} className="font-bold text-primary-400">{line.replace(/\*\*/g, '')}</p>;
                              return <p key={i}>{line}</p>;
                            })}
                         </div>
                       ) : (
                         <div className="text-center py-20 opacity-20 italic">No guide loaded.</div>
                       )}
                    </div>
                  )}
               </div>

               <div className="p-6 bg-white/5 border-t border-white/5 flex justify-between items-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Generated by Llama 3.3 Health Hub</p>
                  <button onClick={() => window.print()} className="btn-primary py-2 px-6 text-xs">Download PDF</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special Advice Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-20 glass-card p-12 bg-gradient-to-br from-primary-600/10 via-primary-950/20 to-transparent border-primary-500/10 flex flex-col md:flex-row items-center gap-12"
      >
        <div className="flex-1">
            <div className="p-1 px-3 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-widest text-primary-500 inline-block mb-4">
                Personalized Learning
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Want specialized advice?</h2>
            <p className="text-slate-400 mb-8 max-w-xl text-lg leading-relaxed">
                As you continue to log your nutrition and activities, our engine builds 
                a unique profile of your deficiencies and strengths.
            </p>
            <div className="flex gap-4">
                <button className="btn-primary px-8">Join the Community</button>
                <button className="px-8 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2">
                    <Lightbulb size={20} className="text-yellow-500" /> Daily Tips
                </button>
            </div>
        </div>
        <div className="hidden lg:block">
            <div className="w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] absolute" />
            <Star size={120} className="text-primary-500/10 relative z-10 animate-[spin_10s_linear_infinite]" />
        </div>
      </motion.div>
    </div>
  );
};

export default Resources;
