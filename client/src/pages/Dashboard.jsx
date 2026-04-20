import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Flame, 
  Dumbbell, 
  Beef, 
  Search, 
  ChefHat,
  TrendingUp,
  Droplet,
  User,
  BookOpen,
  Zap,
  ShoppingCart,
  LayoutGrid,
  History,
  Target,
  Focus,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import NutrientCard from '../components/Dashboard/NutrientCard';
import WaterTracker from '../components/Dashboard/WaterTracker';
import WeeklyChart from '../components/Dashboard/WeeklyChart';
import ActivityRing from '../components/Dashboard/ActivityRing';
import DailyCoachCard from '../components/Dashboard/DailyCoachCard';
import Achievements from '../components/Dashboard/Achievements';
import AIInsightMarquee from '../components/Dashboard/AIInsightMarquee';

const Dashboard = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const [dailyLog, setDailyLog] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${u.token}` };
      
      const [logRes, statsRes, userRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/nutrition/log?date=${new Date().toISOString()}`, { headers }),
        axios.get('http://localhost:5000/api/stats/weekly', { headers }),
        axios.get('http://localhost:5000/api/auth/me', { headers })
      ]);

      setDailyLog(logRes.data.data.log);
      setWeeklyStats(statsRes.data.data.stats.map(s => s.calories));
      setUserData(userRes.data.data.user);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const seedMockData = async () => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      await axios.post('http://localhost:5000/api/stats/seed-history', {}, {
        headers: { Authorization: `Bearer ${u.token}` }
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    calories: { 
      current: dailyLog?.dailySummary?.totalCalories || 0, 
      target: userData?.goals?.calories || 2000, 
    },
    burned: dailyLog?.dailySummary?.totalCaloriesBurned || 0,
    macros: [
      { label: "Protein", val: dailyLog?.dailySummary?.totalProtein || 0, target: userData?.goals?.protein || 150, unit: "g", color: "blue", icon: Beef },
      { label: "Carbs", val: dailyLog?.dailySummary?.totalCarbs || 0, target: userData?.goals?.carbs || 250, unit: "g", color: "green", icon: ChefHat },
      { label: "Fats", val: dailyLog?.dailySummary?.totalFats || 0, target: userData?.goals?.fats || 70, unit: "g", color: "yellow", icon: Dumbbell },
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <AIInsightMarquee />

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full pb-32">
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 text-primary-500 mb-2">
                <LayoutGrid size={20} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Command Center</span>
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter">
                Hello, <span className="text-primary-500">{userData?.name.split(' ')[0]}</span>
            </h1>
          </motion.div>
          
          <div className="flex flex-wrap gap-3">
            <Link to="/shopping-list" className="glass-card px-5 py-3 flex items-center gap-2 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest border-white/5">
              <ShoppingCart size={18} className="text-primary-500" /> List
            </Link>
            <Link to="/profile" className="glass-card px-5 py-3 flex items-center gap-2 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest border-white/5">
              <User size={18} className="text-blue-500" /> Account
            </Link>
            <Link to="/tracker" className="btn-primary py-3 px-8 text-sm flex items-center gap-2 shadow-[0_10px_40px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 transition-all">
              <Plus size={20} /> Log Meal
            </Link>
          </div>
        </header>

        {/* Bento Grid v2 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-8 h-full">
          
          {/* Daily Goal Ring (Main Bento) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 lg:row-span-2 glass-card p-10 flex flex-col items-center justify-between border-primary-500/10 bg-gradient-to-br from-primary-950/10 to-transparent"
          >
            <div className="text-center">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Metabolic Rate</h3>
                <p className="text-2xl font-black text-white">Daily Balance</p>
            </div>
            
            <ActivityRing 
              consumed={stats.calories.current} 
              burned={stats.burned} 
              target={stats.calories.target} 
            />

            <div className="grid grid-cols-2 gap-6 w-full pt-10 border-t border-white/5">
               <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Consumed</p>
                  <p className="text-2xl font-black text-primary-500 tracking-tighter">{stats.calories.current}<span className="text-[10px] ml-1">kcal</span></p>
               </div>
               <div className="text-center border-l border-white/5 pl-6">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Burned</p>
                  <p className="text-2xl font-black text-yellow-500 tracking-tighter">-{stats.burned}<span className="text-[10px] ml-1">kcal</span></p>
               </div>
            </div>
          </motion.div>

          {/* AI Daily Coach (Hero Bento) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card overflow-hidden h-full"
          >
            <DailyCoachCard 
              name={userData?.name.split(' ')[0]} 
              burned={stats.burned} 
              consumed={stats.calories.current} 
              target={stats.calories.target} 
            />
          </motion.div>

          {/* Water Node */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <WaterTracker initialWater={dailyLog?.dailySummary?.waterIntake || 0} />
          </motion.div>

          {/* Real Trends Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-10 border-white/5"
          >
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary-500/10 rounded-2xl">
                        <TrendingUp className="text-secondary-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Biological Trends</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">7 Day Activity Cycle</p>
                    </div>
                </div>
                <button 
                  onClick={seedMockData}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl hover:bg-primary-500 transition-all"
                >
                  Sync History
                </button>
             </div>
             <WeeklyChart data={weeklyStats} />
          </motion.div>

          {/* Quick Actions & Macro Hub */}
          <div className="lg:col-span-1 flex flex-col gap-6">
             <div className="grid grid-cols-1 gap-4">
                {stats.macros.map((m, i) => (
                    <div key={i} className="glass-card p-5 border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 bg-${m.color}-500/10 rounded-lg group-hover:scale-110 transition-transform`}>
                                <m.icon className={`text-${m.color}-500`} size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{m.label}</p>
                                <p className="text-lg font-black text-white">{m.val}<span className="text-xs ml-1 opacity-40">{m.unit}</span></p>
                            </div>
                        </div>
                        <div className="w-12 h-1 bg-white/5 rounded-full relative overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((m.val/m.target)*100, 100)}%` }}
                                className={`absolute h-full bg-${m.color}-500`}
                            />
                        </div>
                    </div>
                ))}
             </div>
             
             <div onClick={() => navigate('/fitness-tracker')} className="flex-1 glass-card p-6 border-dashed border-2 border-primary-500/20 flex flex-col items-center justify-center gap-4 hover:border-primary-500/50 cursor-pointer group bg-primary-500/[0.02]">
                <div className="w-12 h-12 rounded-full border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500 group-hover:scale-110 transition-all">
                    <Zap className="text-primary-500 group-hover:text-white" size={24} />
                </div>
                <p className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary-400">Log Activity</p>
             </div>
          </div>
        </div>

        {/* Global Hub Strip */}
        <section className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           <Achievements count={userData?.badges?.length || 0} />
           
           <Link to="/recipes" className="glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-all group border-white/5">
               <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                   <ChefHat size={24} />
               </div>
               <span className="font-black text-xs uppercase tracking-widest">Recipe Hub</span>
           </Link>
           
           <Link to="/fitness-hub" className="glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-all group border-white/5">
               <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                   <Dumbbell size={24} />
               </div>
               <span className="font-black text-xs uppercase tracking-widest">AI Trainer</span>
           </Link>
           
           <Link to="/resources" className="glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-all group border-white/5">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                   <BookOpen size={24} />
               </div>
               <span className="font-black text-xs uppercase tracking-widest">Library</span>
           </Link>

           <Link to="/shopping-list" className="glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-all group border-white/5 hidden lg:flex">
               <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                   <ShoppingCart size={24} />
               </div>
               <span className="font-black text-xs uppercase tracking-widest">Grocery</span>
           </Link>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
