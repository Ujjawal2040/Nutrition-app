import { useState, useEffect } from 'react';
import { Search, ChefHat, Filter, Info, Heart, X } from 'lucide-react';
import api from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';

import RecipeCard from '../components/Recipe/RecipeCard';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [chefResponse, setChefResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, userRes] = await Promise.all([
          api.get('/recipes'),
          api.get('/auth/me')
        ]);

        setRecipes(recipesRes.data.data.recipes);
        setFavorites(userRes.data.data.user.favorites.recipes || []);
        setGroceryList(userRes.data.data.user.groceryList || []);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleFavorite = async (recipeId) => {
    try {
      const response = await api.post('/stats/favorite', 
        { type: 'recipes', id: recipeId }
      );
      setFavorites(response.data.data.favorites.recipes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToList = async (items) => {
    try {
      // Deduplicate items
      const combined = [...groceryList];
      items.forEach(newItem => {
        if (!combined.some(item => item.name.toLowerCase() === newItem.name.toLowerCase())) {
          combined.push(newItem);
        }
      });
      
      await api.patch('/stats/grocery', { items: combined });
      setGroceryList(combined);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAIChef = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setChefResponse(null);
    try {
      const res = await api.post('/chat/health-guide', { 
        topic: "Healthy Recipe for " + search 
      });
      setChefResponse({ 
        query: search,
        content: res.data.data.guide 
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = (recipe.title || '').toLowerCase().includes((search || '').toLowerCase());
    const matchesCategory = category === 'all' || recipe.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary-500/20 rounded-2xl">
            <ChefHat className="text-primary-500" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white">Culinary Hub</h1>
        </div>
        <p className="text-slate-400 max-w-2xl">
          Discover nutrient-dense recipes designed to fuel your specific health goals. 
          Everything you need to eat clean without sacrificing flavor.
        </p>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search healthy recipes..." 
            className="w-full input-field pl-12 h-14"
            value={search || ''}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {['all', 'veg', 'non-veg'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                category === cat ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AI Chef Result */}
      <AnimatePresence>
        {chefResponse && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 overflow-hidden"
          >
            <div className="glass-card p-10 bg-gradient-to-br from-primary-950/20 to-transparent border-primary-500/20 relative">
               <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setChefResponse(null)}
                    className="p-2 w-10 h-10 rounded-full bg-white/5 text-slate-500 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
               </div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary-500 rounded-2xl shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]">
                    <ChefHat className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">AI Culinary Insight</h2>
                    <p className="text-xs text-primary-500 font-bold uppercase tracking-widest">Custom creation for "{chefResponse.query}"</p>
                  </div>
               </div>
               <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                    {chefResponse.content}
                  </div>
               </div>
               <div className="mt-10 pt-10 border-t border-white/5 flex gap-4">
                  <button className="btn-primary py-3 px-8 text-xs">Save to favorites</button>
                  <button className="px-8 py-3 bg-white/5 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Generate Shopping List</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-96 glass-card animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredRecipes.map((recipe) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <RecipeCard 
                  recipe={recipe} 
                  isFavorite={favorites.includes(recipe._id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToList={handleAddToList}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredRecipes.length === 0 && !loading && (
        <div className="text-center py-20 glass-card bg-white/[0.02] border-dashed border-2 border-white/5 rounded-[40px] max-w-xl mx-auto">
            <ChefHat size={64} className="mx-auto mb-6 text-slate-700" />
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">No Recipe Found?</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Our AI Chef can create a custom healthy recipe for "{search}" instantly.</p>
            <button 
              onClick={handleAIChef}
              className="btn-primary px-10 py-4 shadow-[0_10px_50px_rgba(var(--primary-rgb),0.3)] transition-all hover:-translate-y-1"
            >
              Ask AI Chef to Cook
            </button>
        </div>
      )}
    </div>
  );
};

export default Recipes;
