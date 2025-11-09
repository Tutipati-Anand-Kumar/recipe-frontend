// SmartSuggestions.jsx
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import { useSelector, useDispatch } from 'react-redux';
import { getSuggestions } from '../redux/slices/recipeSlice';

const SmartSuggestions = () => {
  const dispatch = useDispatch();
  const { suggestions, loading } = useSelector((state) => state.recipe);

  useEffect(() => {
    dispatch(getSuggestions());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-600 drop-shadow-md">Smart Suggestions 🌟</h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating suggestions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {suggestions.map((recipe, index) => (
              <div key={`${recipe.idMeal}-${index}`} data-aos="fade-up" data-aos-delay={`${index * 100}`} data-aos-duration="800">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSuggestions;