import { Clock, Users, Flame, Heart, ShoppingCart, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite, onAddToList }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleAddClick = async () => {
    setAddingToCart(true);
    const items = recipe.ingredients.map(ing => ({ name: ing.name, amount: ing.amount, checked: false }));
    await onAddToList(items);
    setTimeout(() => setAddingToCart(false), 1500);
  };

  return (
    <div className="glass-card overflow-hidden group hover:bg-white/5 transition-all h-full flex flex-col border-white/5 shadow-2xl">
      <div className="relative h-56 bg-slate-900 overflow-hidden">
        <img 
          src={recipe.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop`} 
          alt={recipe.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        
        {/* Category Badge */}
        <span className="absolute bottom-4 left-4 bg-primary-500/20 backdrop-blur-md border border-primary-500/30 text-primary-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg">
            {recipe.category}
        </span>
        
        {/* Overlays */}
        <div className="absolute top-4 right-4 flex gap-2">
           <button 
             onClick={() => onToggleFavorite(recipe._id)}
             className={`p-3 rounded-2xl backdrop-blur-xl border transition-all ${
               isFavorite ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/5 border-white/10 text-white/50 hover:text-red-400 hover:bg-white/10'
             }`}
           >
             <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
           </button>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          {recipe.tags?.map((tag, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-2xl font-black text-white mb-3 line-clamp-1 group-hover:text-primary-400 transition-colors tracking-tight">{recipe.title}</h3>
        <p className="text-slate-400 text-sm mb-8 line-clamp-2 leading-relaxed italic">"{recipe.description}"</p>
        
        <div className="grid grid-cols-3 gap-6 mb-10 pt-6 border-t border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Minutes</span>
            <span className="text-base font-black text-white flex items-center gap-1.5"><Clock size={14} className="text-slate-500" /> {recipe.prepTime}</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5 pl-6">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protein</span>
            <span className="text-base font-black text-blue-400">{recipe.nutrients.protein}<span className="text-[10px] ml-1">g</span></span>
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5 pl-6">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Energy</span>
            <span className="text-base font-black text-orange-400">{recipe.nutrients.calories}<span className="text-[10px] ml-1 text-slate-600">kcal</span></span>
          </div>
        </div>

        <div className="mt-auto flex gap-4">
          <button 
            onClick={() => setShowGuide(true)}
            className="flex-1 py-4 bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-500 transition-all active:scale-95 shadow-xl"
          >
            View Guide
          </button>
          <button 
            onClick={handleAddClick}
            disabled={addingToCart}
            className={`w-14 h-14 rounded-2xl transition-all border flex items-center justify-center ${
              addingToCart 
              ? 'bg-green-500 border-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
              : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-primary-500 hover:border-primary-500'
            }`}
          >
            {addingToCart ? <CheckCircle size={24} /> : <ShoppingCart size={24} />}
          </button>
        </div>
      </div>

      {/* Modern Modal Overlay */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <div className="relative h-64">
                <img src={recipe.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <button 
                  onClick={() => setShowGuide(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-black text-white mb-6 tracking-tight">{recipe.title}</h2>
                
                <div className="grid grid-cols-2 gap-10 mb-10">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-primary-500 tracking-[0.2em] mb-4">Ingredients</h4>
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          <span>{ing.name} <span className="text-slate-500 text-xs ml-1">({ing.amount})</span></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] mb-4">Preparation</h4>
                    <div className="space-y-4">
                       {recipe.instructions.map((step, i) => (
                         <div key={i} className="flex gap-4">
                            <span className="text-xl font-black text-white/10">{i+1}</span>
                            <p className="text-sm text-slate-400 leading-relaxed">{step}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeCard;
