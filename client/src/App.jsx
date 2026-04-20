import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NutritionTracker from './pages/NutritionTracker';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import FitnessHub from './pages/FitnessHub';
import FitnessTracker from './pages/FitnessTracker';
import Assistant from './components/Chat/Assistant';
import ShoppingList from './pages/ShoppingList';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 font-sans">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route 
            path="/" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tracker" 
            element={user ? <NutritionTracker /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/recipes" 
            element={user ? <Recipes /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/resources" 
            element={user ? <Resources /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/fitness-hub" 
            element={user ? <FitnessHub /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/fitness-tracker" 
            element={user ? <FitnessTracker /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/shopping-list" 
            element={user ? <ShoppingList /> : <Navigate to="/login" />} 
          />
        </Routes>
        {user && <Assistant />}
      </div>
    </Router>
  );
}

export default App;
