import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Activity, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile: {
      age: 25,
      gender: 'male',
      weight: 70,
      height: 175,
      activityLevel: 'moderately_active',
      dietaryPreference: 'vegetarian'
    }
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) alert(message);
    if (isSuccess || user) navigate('/');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('profile.')) {
      const field = name.split('.')[1];
      // Cast numeric fields to numbers
      const numericFields = ['age', 'weight', 'height'];
      const finalValue = numericFields.includes(field) ? Number(value) : value;
      
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, [field]: finalValue }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-4 border border-primary-500/30">
            <UserPlus className="text-primary-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white">Join Protus</h1>
          <p className="text-slate-400 mt-2">Personalize your nutrition journey</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {step === 1 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input type="text" name="name" value={formData.name} onChange={onChange} className="w-full input-field pl-11" placeholder="John Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full input-field pl-11" placeholder="john@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input type="password" name="password" value={formData.password} onChange={onChange} className="w-full input-field pl-11" placeholder="••••••••" required />
                </div>
              </div>
              <button type="button" onClick={nextStep} className="w-full btn-primary flex items-center justify-center gap-2">
                Next <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Age</label>
                  <input type="number" name="profile.age" value={formData.profile.age} onChange={onChange} className="w-full input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Gender</label>
                  <select name="profile.gender" value={formData.profile.gender} onChange={onChange} className="w-full input-field appearance-none">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Weight (kg)</label>
                  <input type="number" name="profile.weight" value={formData.profile.weight} onChange={onChange} className="w-full input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Height (cm)</label>
                  <input type="number" name="profile.height" value={formData.profile.height} onChange={onChange} className="w-full input-field" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Dietary Preference</label>
                <select name="profile.dietaryPreference" value={formData.profile.dietaryPreference} onChange={onChange} className="w-full input-field appearance-none">
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="flex-1 input-field flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> Back
                </button>
                <button type="submit" disabled={isLoading} className="flex-[2] btn-primary flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                </button>
              </div>
            </motion.div>
          )}
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
