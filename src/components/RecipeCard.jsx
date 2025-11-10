// RecipeCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../redux/slices/recipeSlice';
import { toast } from 'react-toastify';
import { getProfile } from '../redux/slices/userSlice';

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);
  const favorites = profile?.favorites || [];
  const [isFavorited, setIsFavorited] = useState(
  favorites.some(fav => fav.idMeal === recipe.idMeal || fav._id === recipe._id)
);

  useEffect(() => {
  setIsFavorited(favorites.some(fav => fav.idMeal === recipe.idMeal || fav._id === recipe._id));
}, [favorites, recipe.idMeal, recipe._id]);

  const handleFavorite = async () => {
  if (!isAuthenticated) {
    toast.warning('Please login to favorite recipes');
    return;
  }

  try {
    // Optimistic update before waiting for server
    setIsFavorited((prev) => !prev);

    const response = await dispatch(toggleFavorite(recipe.idMeal)).unwrap();
    toast.success(response.message);

    // Re-sync from backend to make sure Redux store stays in sync
    dispatch(getProfile());
  } catch (err) {
    // Rollback if failed
    setIsFavorited((prev) => !prev);
    toast.error(err || 'Failed to update favorite');
  }
};

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.strMeal,
          text: `Check out ${recipe.strMeal} - ${recipe.strArea} cuisine!`,
          url: `${window.location.origin}/video/${recipe.idMeal}`,
        });
      } catch (err) {
        if (err.name !== 'AbortError') copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}/video/${recipe.idMeal}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied! Share with friends.');
    }).catch(() => toast.error('Copy failed'));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group cursor-pointer relative max-[400px]:h-[280px] h-[350px]"
         data-aos="zoom-in" data-aos-duration="800">
      {/* Image with hover effect */}
      <div className="relative overflow-hidden">
        <Link to={`/recipe/${recipe.idMeal}`}>
          <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal} 
          className="w-full h-56 object-fill transition-transform duration-500 group-hover:scale-110 max-[400px]:h-46"
        />
        </Link>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 px-2 py-1 rounded-full text-xs font-bold shadow-md">
            {recipe.strCategory}
          </span>
        </div>
      </div>
      
      <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 max-[400px]:p-2">
        <div className='flex justify-between'>
          <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">{recipe.strMeal}</h3>
          <div className='flex gap-1.5'>
             <button
                onClick={handleFavorite}
              >
                <span className={`text-2xl transition-all duration-300 ${isFavorited ? 'text-red-500 scale-110' : 'text-gray-400'}`}>
                  {isFavorited ? '❤️' : '🤍'}
                </span>
              </button>
              
              <button
                onClick={handleShare}
                title="Share this recipe"
                aria-label="Share"
              >
                <span className="text-xl">↗️</span>
              </button>
           </div>
        </div>
        <div className='flex justify-between'>
          <div className=''>
          <p className="text-gray-600 mb-2 text-sm">🌍 {recipe.strArea} | {recipe.strCategory}</p>
            <p className="text-gray-500 text-xs mb-4">
              ⏱️ {recipe.cookTime} min | 🔥 {recipe.nutrition.calories} cals
            </p>
            
        </div>
        {/* Actions */}
        <div className="flex items-center justify-evenly flex-col">
          {/* Video Link */}
            <Link 
              to={`/video/${recipe.idMeal}`} 
              className="text-orange-500 hover:text-orange-600 font-medium text-sm mb-3 inline-block transition-colors duration-300 underline-offset-2"
            >
              📺 Watch Video
            </Link>
           
        </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;