import { useState, useEffect } from 'react';
import { ShoppingCart, Check, Trash2, Plus, ArrowLeft, Loader2, Apple, Beef, Carrot, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';


const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  const suggestions = [
    { name: 'Spinach', icon: <Carrot size={16} /> },
    { name: 'Oats', icon: <Coffee size={16} /> },
    { name: 'Chicken', icon: <Beef size={16} /> },
    { name: 'Apples', icon: <Apple size={16} /> }
  ];

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await api.get('/auth/me');
        setItems(response.data.data.user.groceryList || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const saveList = async (updatedItems) => {
    try {
      await api.patch('/stats/grocery', { items: updatedItems });
    } catch (err) {
      console.error(err);
    }
  };


  const addItem = (nameArg) => {
    const name = nameArg || newItem;
    if (!name.trim()) return;
    
    // De-duplicate
    if (items.some(i => i.name.toLowerCase() === name.toLowerCase())) return;

    const updated = [...items, { name: name.trim(), amount: '', checked: false }];
    setItems(updated);
    setNewItem('');
    saveList(updated);
  };

  const toggleItem = (idx) => {
    const updated = [...items];
    updated[idx].checked = !updated[idx].checked;
    setItems(updated);
    saveList(updated);
  };

  const removeItem = (idx) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    saveList(updated);
  };

  const clearCompleted = () => {
    const updated = items.filter(i => !i.checked);
    setItems(updated);
    saveList(updated);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-2xl mx-auto pb-24">
      <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <header className="mb-12">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-4">
                <ShoppingCart className="text-primary-500" size={36} fill="currentColor" /> Grocery Sync
                </h1>
                <p className="text-slate-400">Your cloud-synced checklist for optimal nutrition.</p>
            </div>
            {checkedCount > 0 && (
                <button 
                  onClick={clearCompleted}
                  className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  Clear Done
                </button>
            )}
        </div>
      </header>

      <div className="glass-card mb-10 p-2 group focus-within:border-primary-500/50 transition-all border-white/5">
        <div className="flex gap-2">
           <input 
             type="text" 
             value={newItem}
             onChange={(e) => setNewItem(e.target.value)}
             placeholder="Add healthy fuel (e.g., Avocado, Walnuts)..."
             className="flex-1 bg-transparent border-0 py-4 pl-4 text-white focus:ring-0 placeholder:text-slate-600"
             onKeyPress={(e) => e.key === 'Enter' && addItem()}
           />
           <button 
             onClick={() => addItem()} 
             className="px-6 bg-primary-600 rounded-xl text-white font-black hover:bg-primary-700 shadow-lg active:scale-95 transition-all"
           >
             ADD
           </button>
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-1">Quick Add Suggestions</p>
        <div className="flex flex-wrap gap-3">
            {suggestions.map((s, idx) => (
                <button 
                    key={idx}
                    onClick={() => addItem(s.name)}
                    className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-primary-500/10 hover:border-primary-500/30 transition-all"
                >
                    {s.icon} {s.name}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, idx) => (
            <motion.div 
              key={`${item.name}-${idx}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className={`glass-card p-5 flex items-center justify-between group border-white/5 ${item.checked ? 'bg-white/[0.02] border-transparent' : 'hover:border-white/10'}`}
            >
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => toggleItem(idx)}
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                    item.checked 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-white/20 hover:border-primary-500 bg-white/5'
                  }`}
                >
                  {item.checked && <Check size={16} strokeWidth={4} />}
                </button>
                <span className={`text-lg font-medium transition-all ${item.checked ? 'line-through text-slate-600 italic' : 'text-white'}`}>
                  {item.name}
                </span>
              </div>
              <button 
                onClick={() => removeItem(idx)}
                className="p-2 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {items.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] rounded-[32px] border-2 border-dashed border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium">Your checklist is clear.</p>
            <p className="text-xs text-slate-600 mt-2">Add items above or from the Recipe Hub.</p>
          </div>
        )}
      </div>

      {items.length > 0 && (
          <div className="mt-12 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                  {checkedCount} / {items.length} items collected
              </p>
          </div>
      )}
    </div>
  );
};

export default ShoppingList;
