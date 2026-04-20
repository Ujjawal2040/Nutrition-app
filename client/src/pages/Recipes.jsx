import { useState, useEffect } from 'react';
import { Search, ChefHat, Filter, Info, Heart } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeCard from '../components/Recipe/RecipeCard';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = JSON.parse(localStorage.getItem('user'));
        const headers = { Authorization: `Bearer ${u.token}` };

        const [recipesRes, userRes] = await Promise.all([
          axios.get('http://localhost:5000/api/recipes', { headers }),
          axios.get('http://localhost:5000/api/auth/me', { headers })
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
      const u = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('http://localhost:5000/api/stats/favorite', 
        { type: 'recipes', id: recipeId },
        { headers: { Authorization: `Bearer ${u.token}` } }
      );
      setFavorites(response.data.data.favorites.recipes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToList = async (items) => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      // Deduplicate items
      const combined = [...groceryList];
      items.forEach(newItem => {
        if (!combined.some(item => item.name.toLowerCase() === newItem.name.toLowerCase())) {
          combined.push(newItem);
        }
      });
      
      await axios.patch('http://localhost:5000/api/stats/grocery', 
        { items: combined },
        { headers: { Authorization: `Bearer ${u.token}` } }
      );
      setGroceryList(combined);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAIChef = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      const res = await axios.post('http://localhost:5000/api/chat/health-guide', { 
        topic: "Healthy Recipe for " + search 
      }, {
        headers: { Authorization: "Bearer " + u.token }
      });
      
      // We'll treat the guide as a temporary recipe for now
      alert("AI Chef says: \n\n" + res.data.data.guide);
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
