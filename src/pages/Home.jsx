// Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import { useSelector, useDispatch } from 'react-redux';
import { searchRecipes } from '../redux/slices/recipeSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { recipes: rawResponse, loading } = useSelector((state) => state.recipe);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search
  const handleSearch = (query, type = 'name') => {
    setSearchQuery(query);
    setCurrentPage(1);
    dispatch(searchRecipes({ query, type, page: 1, limit: 20 }));
  };

  useEffect(() => {
    // Default load
    handleSearch('');
  }, [dispatch]);

  useEffect(() => {
    if (rawResponse && typeof rawResponse === 'object') {
      setTotalPages(rawResponse.totalPages || 1);
    }
  }, [rawResponse]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    dispatch(searchRecipes({ query: searchQuery, type: 'name', page, limit: 20 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentRecipes = rawResponse?.recipes || [];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-[400px]:py-4">
        <h1 className="text-3xl font-bold mb-6 max-[400px]:text-[22px] max-[400px]:mb-3">Featured Recipes</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : currentRecipes.length === 0 ? (
          <p className="text-center text-gray-500">No recipes found. Try another search!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;