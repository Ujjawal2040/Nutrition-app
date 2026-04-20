import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Zap, 
  ArrowLeft, 
  Plus, 
  CheckCircle, 
  Trash2, 
  Flame, 
  Dumbbell, 
  Activity,
  Award,
  History,
  TrendingUp,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';


const FitnessTracker = () => {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('moderate');
  const [status, setStatus] = useState('idle');
  const [todayLogs, setTodayLogs] = useState([]);
  const [userWeight, setUserWeight] = useState(70);
  const [activeLogId, setActiveLogId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, logRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/activity/recent')
        ]);

        setUserWeight(userRes.data.data.user.profile.weight || 70);
        setTodayLogs(logRes.data.data.activities);
        setActiveLogId(logRes.data.data.logId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search) return;
    const fetchActivities = async () => {
      try {
        const response = await api.get(`/activity/search?q=${search}`);
        setActivities(response.data.data.activities);
      } catch (err) {
        console.error(err);
      }
    };
    const delayDebounce = setTimeout(fetchActivities, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Live Calorie Burn Calculation
  const liveBurn = useMemo(() => {
    if (!selectedActivity) return 0;
    const multiplier = intensity === 'high' ? 1.2 : intensity === 'low' ? 0.8 : 1.0;
    return Math.round((selectedActivity.metValue * multiplier * 3.5 * userWeight * Number(duration)) / 200);
  }, [selectedActivity, duration, intensity, userWeight]);

  const handleLog = async () => {
    if (!selectedActivity) return;
    setStatus('logging');
    try {
      const res = await api.post('/activity/log', {
        activityId: selectedActivity._id,
        duration,
        intensity,
        date: new Date().toISOString()
      });
      
      setTodayLogs(res.data.data.log.activities);
      setActiveLogId(res.data.data.log._id);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setSelectedActivity(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleDelete = async (idx) => {
    try {
      const res = await api.delete(`/activity/${activeLogId}/${idx}`);
      setTodayLogs(res.data.data.log.activities);
    } catch (err) {
      console.error(err);
    }
  };


  const quickLogItems = [
    { name: 'Walking', icon: <Activity className="text-blue-400" />, id: 'walking' },
    { name: 'Running', icon: <TrendingUp className="text-orange-400" />, id: 'running' },
    { name: 'Weight Lifting', icon: <Dumbbell className="text-purple-400" />, id: 'weights' },
    { name: 'Cricket', icon: <Award className="text-green-400" />, id: 'cricket' }
  ];

  const totalBurnedToday = todayLogs.reduce((sum, act) => sum + act.caloriesBurned, 0);

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto pb-24">
      <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <header className="mb-2">
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-4">
               <Zap className="text-yellow-500" fill="currentColor" /> Active Sync
            </h1>
            <p className="text-slate-400">Log your movements to optimize your net calorie balance.</p>
          </header>

          {/* Search Section */}
          <div className="glass-card p-2 relative">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search 100+ exercises..." 
                  className="w-full bg-white/5 border-0 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary-500 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             
             <AnimatePresence>
               {search && activities.length > 0 && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute z-[70] w-full left-0 mt-2 bg-[#0a0f18] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                 >
                   {activities.map(act => (
                     <button 
                       key={act._id} 
                       onClick={() => { setSelectedActivity(act); setSearch(''); }}
                       className="w-full p-4 flex items-center justify-between hover:bg-primary-500/10 transition-all text-left border-b border-white/5 group"
                     >
                       <div>
                         <p className="font-bold text-white group-hover:text-primary-400 transition-colors">{act.name}</p>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{act.category}</p>
                       </div>
                       <Plus size={18} className="text-primary-500" />
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {!selectedActivity && !search ? (
              <motion.div 
                key="empty" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {quickLogItems.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSearch(item.name)}
                    className="glass-card p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-all border-white/5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.name}</span>
                  </button>
                ))}
              </motion.div>
            ) : selectedActivity && !search ? (
              <motion.div 
                key="selected"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-8 space-y-8 border-primary-500/20"
              >
                 <div className="flex items-start justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2">
                           Selected Workout
                        </div>
                        <h2 className="text-3xl font-black text-white">{selectedActivity.name}</h2>
                        <p className="text-slate-400 text-sm italic">"{selectedActivity.description || 'Boost your metabolism with this activity.'}"</p>
                    </div>
                    <button onClick={() => setSelectedActivity(null)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-all">
                        <X size={20} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Clock size={16} /> Duration
                            </label>
                            <span className="text-2xl font-black text-white">{duration} <span className="text-xs text-slate-400 font-medium">min</span></span>
                        </div>
                        <input 
                            type="range" min="1" max="180" 
                            value={duration} onChange={(e) => setDuration(e.target.value)}
                            className="slider-primary w-full"
                        />
                    </div>

                    <div className="space-y-6">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Zap size={16} /> Intensity Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['low', 'moderate', 'high'].map(level => (
                                <button 
                                    key={level}
                                    onClick={() => setIntensity(level)}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                        intensity === level 
                                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' 
                                        : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>

                 {/* Real-time Result Card */}
                 <div className="bg-primary-600/10 border border-primary-500/20 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-primary-500 mb-1">Estimated Burn</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white">{liveBurn}</span>
                            <span className="text-sm font-bold text-slate-400">kcal</span>
                        </div>
                    </div>
                    <Flame size={48} className="text-primary-500 animate-pulse" />
                 </div>

                 <button 
                    onClick={handleLog}
                    disabled={status === 'logging'}
                    className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
                        status === 'success' ? 'bg-green-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-primary-500/20'
                    }`}
                 >
                    {status === 'logging' ? <Loader2 className="animate-spin" /> : 
                     status === 'success' ? <><CheckCircle size={24} /> Session Saved!</> : 
                     <><Plus size={24} /> Log Session</>}
                 </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Sidebar History */}
        <div className="space-y-8">
           <div className="glass-card p-8">
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                <History size={20} className="text-primary-500" /> Today's Log
              </h3>
              
              <div className="space-y-4">
                 {todayLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-slate-400">
                             {log.duration}m
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">{log.activityName}</p>
                             <p className="text-[10px] font-medium text-orange-400">-{log.caloriesBurned} kcal</p>
                          </div>
                       </div>
                       <button onClick={() => handleDelete(idx)} className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                 ))}
                 
                 {todayLogs.length === 0 && (
                    <div className="text-center py-8 opacity-20">
                       <Activity size={48} className="mx-auto mb-2" />
                       <p className="text-xs">No activities logged yet.</p>
                    </div>
                 )}
              </div>

              {todayLogs.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500">Daily Total</span>
                      <span className="text-xl font-black text-primary-500">-{totalBurnedToday} kcal</span>
                   </div>
                </div>
              )}
           </div>

           <div className="glass-card p-8 bg-primary-600/5 border-primary-500/10">
              <h4 className="text-sm font-bold text-white mb-3">Why track activity?</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Tracking physical stats allows Protus to calculate your **Net Calorie Balance**. 
                Meeting your calorie goal is easier when you offset your consumption with consistent movement.
              </p>
              <div className="flex items-center gap-2 text-primary-500 text-[10px] font-black uppercase tracking-widest">
                 <Award size={14} /> Earn consistency badges
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const Loader2 = ({ className }) => <Activity className={`animate-pulse ${className}`} />;

export default FitnessTracker;
