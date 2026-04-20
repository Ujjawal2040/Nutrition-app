import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Utensils, 
  Loader2, 
  Sparkles, 
  Flame, 
  Coffee,
  Sun,
  Moon,
  Cookie,
  Camera,
  ArrowLeft,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchFood, logFood, getDailyLog } from '../store/slices/nutritionSlice';
import axios from 'axios';

const mealIcons = {
  breakfast: <Coffee size={18} className="text-orange-400" />,
  lunch: <Sun size={18} className="text-yellow-400" />,
  dinner: <Moon size={18} className="text-blue-400" />,
  snack: <Cookie size={18} className="text-purple-400" />
};

const NutritionTracker = () => {
  const [query, setQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  
  const dispatch = useDispatch();
  const { searchResults, dailyLog, isLoading } = useSelector(state => state.nutrition);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getDailyLog(new Date().toISOString()));
  }, [dispatch]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setAiResult(null);
    if (query && typeof query === 'string' && query.trim()) {
      dispatch(searchFood(query));
    }
  };

  const handleLog = (food, isAI = false) => {
    const logData = {
      foodId: isAI ? 'custom' : food._id,
      foodName: food.name,
      nutrients: food.nutrients,
      quantity: food.servingSize?.value || 100,
      mealType: selectedMeal,
      date: new Date().toISOString()
    };
    dispatch(logFood(logData));
    if (isAI) setAiResult(null);
  };

  const handleAIQuickLog = async () => {
    if (!query || typeof query !== 'string' || !query.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const uString = localStorage.getItem('user');
      if (!uString) return;
      const u = JSON.parse(uString);
      
      const res = await axios.post('http://localhost:5000/api/chat', 
        { message: "Extract nutrients from this meal description: " + query + ". Output pure JSON with keys: name, calories, protein, carbs, fats." }, 
        { headers: { Authorization: "Bearer " + u.token } }
      );
      
      const rx = new RegExp('\\{.*\\}', 's');
      const match = res.data.reply.match(rx);
      if (match) {
        const aiExtraction = JSON.parse(match[0]);
        // Create a temporary "Loggable" card
        setAiResult({
            _id: 'ai-temp-' + Date.now(), // Fake ID
            name: aiExtraction.name,
            nutrients: {
                calories: aiExtraction.calories,
                protein: aiExtraction.protein,
                carbs: aiExtraction.carbs,
                fats: aiExtraction.fats
            },
            servingSize: { value: 100, unit: 'g' }
        });
        setQuery(aiExtraction.name || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const totalCals = dailyLog?.dailySummary?.totalCalories || 0;
  const goalCals = user?.goals?.calories || 2000;
  const remaining = goalCals - totalCals;
  const progressPercent = Math.min((totalCals / goalCals) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-all">
                <ArrowLeft size={20} /> <span className="text-sm font-bold uppercase tracking-widest">Dashboard</span>
            </Link>
            <div className="text-right">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Nutrient Log</h1>
                <p className="text-xs font-black text-primary-500 uppercase tracking-widest mt-1">Metabolic Tracking Node</p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10 border-primary-500/10">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Search className="text-primary-500" size={28} /> <span className="uppercase tracking-tight">Discovery</span>
                  </h2>
                  <div className="flex gap-2">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
                      <button
                        key={meal}
                        onClick={() => setSelectedMeal(meal)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedMeal === meal ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-white/5 border-white/5 text-slate-500'
                        }`}
                      >
                        {meal}
                      </button>
                    ))}
                  </div>
              </div>

              <div className="relative mb-8">
                <input
                  type="text"
                  className="w-full input-field h-16 pl-6 pr-40 text-lg border-white/5 font-medium"
                  placeholder="What did you have?"
                  value={query || ''}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    <button 
                      onClick={handleAIQuickLog}
                      className="h-12 px-4 bg-primary-500/10 border border-primary-500/20 text-primary-500 rounded-xl hover:bg-primary-500 hover:text-white transition-all flex items-center gap-2"
                    >
                        {aiLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">AI Log</span>
                    </button>
                    <button 
                      onClick={() => handleSearch()}
                      className="h-12 px-6 bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:-translate-y-1 transition-all"
                    >
                        Search
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {/* AI Result Card */}
                    {aiResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-6 flex items-center justify-between border-primary-500/50 bg-primary-500/10 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-1 bg-primary-500 text-white text-[8px] font-black uppercase tracking-widest">AI Result</div>
                            <div>
                                <h3 className="font-black text-white uppercase tracking-tight">{aiResult.name}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] font-black text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">{aiResult.nutrients.calories} kcal</span>
                                    <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{aiResult.nutrients.protein}g P</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleLog(aiResult, true)}
                                className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-primary-500/50"
                            >
                                <Plus size={24} />
                            </button>
                        </motion.div>
                    )}

                    {searchResults.map((food) => (
                        <motion.div
                            key={food._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 flex items-center justify-between hover:bg-white/5 border-white/5 group"
                        >
                            <div>
                                <h3 className="font-black text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{food.name}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] font-black text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">{food.nutrients.calories} kcal</span>
                                    <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{food.nutrients.protein}g P</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleLog(food)}
                                className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-500 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all"
                            >
                                <Plus size={24} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
              </div>

              {searchResults.length === 0 && !isLoading && !aiResult && query && (
                <div className="py-20 text-center glass-card bg-primary-500/5 border-dashed border-2 border-primary-500/20 rounded-[40px]">
                    <Sparkles size={48} className="mx-auto mb-6 text-primary-500 animate-pulse" />
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Item not in our vault?</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">"{query}" is missing from the local list. Let Protus AI research it and log it for you instantly.</p>
                    <button 
                      onClick={handleAIQuickLog}
                      className="btn-primary px-10 py-4 shadow-[0_10px_50px_rgba(var(--primary-rgb),0.3)]"
                    >
                      Ask AI to Log "{query}"
                    </button>
                </div>
              )}

              {searchResults.length === 0 && !isLoading && !query && (
                <div className="py-20 text-center opacity-20 italic font-medium">
                    Search for meals or use AI Log for complex descriptions...
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-8 border-white/5 bg-white/[0.02]">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <History className="text-primary-500" /> Feeding Timeline
                </h2>

                <div className="space-y-12">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                        const mealItems = dailyLog?.meals?.filter((m) => m.mealType === mealType) || [];
                        const mealCals = mealItems.reduce((sum, item) => sum + (item.nutrients?.calories || 0), 0);
                        
                        return (
                            <div key={mealType} className="relative pl-8 border-l-2 border-white/5">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        {mealIcons[mealType]}
                                        <h3 className="text-xs font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-primary-500/30">{mealType}</h3>
                                    </div>
                                    <span className="text-xs font-black text-slate-500">{mealCals} kcal</span>
                                </div>
                                <div className="space-y-3">
                                    {mealItems.map((item, idx) => (
                                        <div key={idx} className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase group-hover:text-primary-400 transition-colors">{item.foodName || item.foodId?.name}</p>
                                                <p className="text-[10px] font-black text-slate-600 uppercase">{item.quantity}g</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-primary-500">{item.nutrients?.calories}</p>
                                                <p className="text-[10px] font-bold text-slate-700 uppercase">kcal</p>
                                            </div>
                                        </div>
                                    ))}
                                    {mealItems.length === 0 && (
                                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest pl-2 opacity-30">Pending...</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 pt-10 border-t border-white/5">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cumulative Intake</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white tracking-tighter">{totalCals}</span>
                                <span className="text-xs font-black text-primary-500 uppercase">kcal</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-black text-slate-200">{remaining < 0 ? 0 : remaining} kcal left</span>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: progressPercent + "%" }}
                            className="h-full bg-primary-500 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                        />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;
