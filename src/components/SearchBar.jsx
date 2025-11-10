// SearchBar.jsx (Fixed version with onSelect)
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchRecipes } from '../redux/slices/recipeSlice';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({
  onResults,
  onSelect, // ✅ new prop
  type = 'name',
  noNavigate = false,
  placeholder = "Search recipes by ingredient or name...",
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: searchLoading } = useSelector((state) => state.recipe);

  const fetchSuggestions = useCallback(
    async (q) => {
      if (!q.trim()) {
        setSuggestions([]);
        return;
      }
      setSuggestionLoading(true);
      try {
        const result = await dispatch(searchRecipes({ query: q, type: 'name' })).unwrap();
        setSuggestions((result?.recipes?.recipes || result?.recipes || result || []).slice(0, 5));
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setSuggestionLoading(false);
      }
    },
    [dispatch]
  );

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      if (typingTimeout) clearTimeout(typingTimeout);
      const timeout = setTimeout(() => fetchSuggestions(value), 400);
      setTypingTimeout(timeout);
    },
    [fetchSuggestions, typingTimeout]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!query.trim()) return;
      setSuggestions([]);
      try {
        const result = await dispatch(searchRecipes({ query, type })).unwrap();
        const data = result?.recipes?.recipes || result?.recipes || result || [];
        if (onResults) onResults(data); // ✅ simplified
        if (!noNavigate) navigate('/');
      } catch (err) {
        console.error('Error searching:', err);
        if (onResults) onResults([]);
      }
    },
    [query, dispatch, type, onResults, navigate, noNavigate]
  );

  const handleSelectSuggestion = useCallback(
    (meal) => {
      setQuery(meal.strMeal);
      setSuggestions([]);
      if (onSelect) onSelect(meal); // ✅ directly notify parent
    },
    [onSelect]
  );

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 max-[400px]:gap-1">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="p-3 w-full rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none max-[400px]:px-1 max-[400px]:py-2"
        />
        <button
          type="submit"
          disabled={searchLoading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg max-[400px]:px-2 max-[400px]:py-2"
        >
          {searchLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Suggestions dropdown */}
      {suggestionLoading && (
        <div className="absolute left-0 w-full bg-white rounded-lg shadow-lg mt-2 z-50 text-gray-600 text-center p-3">
          ⏳ Loading suggestions...
        </div>
      )}
      {!suggestionLoading && suggestions.length > 0 && (
        <div className="absolute left-0 w-full bg-white rounded-lg shadow-lg mt-2 z-50 text-left text-black">
          {suggestions.map((meal) => (
            <div
              key={meal.idMeal}
              className="p-3 hover:bg-orange-100 cursor-pointer flex items-center gap-3"
              onClick={() => handleSelectSuggestion(meal)} // ✅ direct click
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-10 h-10 rounded-md object-cover"
              />
              <span>{meal.strMeal}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
