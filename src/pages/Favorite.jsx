// Favorite.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../redux/slices/userSlice';
import { Link } from 'react-router-dom';

const Favorite = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const favorites = profile?.favorites || [];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-pink-600 drop-shadow-md">Your Favorites ❤️</h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No favorites yet. Start adding some!</p>
            <Link to="/" className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-105">
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((recipe, index) => (
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

export default Favorite;