import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Weight, Ruler, Activity, Save, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/api';


const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    weight: user?.data?.user?.profile?.weight || '',
    height: user?.data?.user?.profile?.height || '',
    activityLevel: user?.data?.user?.profile?.activityLevel || 'sedentary',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const response = await api.patch('/auth/update-profile', 
        { profile: { ...user.data.user.profile, ...formData } }
      );
      
      // Update local storage
      const u = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...u, data: { ...u.data, user: response.data.data.user } };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-2xl mx-auto">
      <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="glass-card p-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <p className="text-slate-400">Manage your health metrics and goals</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Weight size={16} /> Current Weight (kg)
              </label>
              <input 
                type="number" 
                name="weight"
                value={formData.weight}
                onChange={onChange}
                className="w-full input-field"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Ruler size={16} /> Height (cm)
              </label>
              <input 
                type="number" 
                name="height"
                value={formData.height}
                onChange={onChange}
                className="w-full input-field"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Activity size={16} /> Activity Level
            </label>
            <select 
              name="activityLevel"
              value={formData.activityLevel}
              onChange={onChange}
              className="w-full input-field bg-slate-900"
            >
              <option value="sedentary">Sedentary (Office job)</option>
              <option value="lightly_active">Lightly Active (1-2 days/week)</option>
              <option value="moderately_active">Moderately Active (3-5 days/week)</option>
              <option value="very_active">Very Active (6-7 days/week)</option>
              <option value="extra_active">Extra Active (Athlete/Physical Job)</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                success 
                ? 'bg-green-500 text-white' 
                : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
              }`}
            >
              {loading ? 'Updating...' : success ? <><CheckCircle size={20} /> Profile Updated</> : <><Save size={20} /> Save Changes</>}
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Saving changes will automatically recalculate your daily calorie and macro goals.
            </p>
          </div>
        </form>
      </div>

      <div className="mt-8 glass-card p-6 border-l-4 border-primary-500">
         <h4 className="font-bold text-white mb-2">Did you know?</h4>
         <p className="text-sm text-slate-400">
           Updating your weight regularly helps Protus keep your nutrition targets accurate as your body composition changes!
         </p>
      </div>
    </div>
  );
};

export default Profile;
