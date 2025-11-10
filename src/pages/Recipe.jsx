import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleFavorite } from "../redux/slices/recipeSlice";
import { getProfile } from "../redux/slices/userSlice";
import api from "../utils/api"; // axios instance for fetching single recipe

const Recipe = () => {
  const { idMeal } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);
  const favorites = profile?.favorites || [];

  const [recipe, setRecipe] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
  const fetchRecipe = async () => {
    try {
      const { data } = await api.get(`/recipes/${idMeal}`);
      setRecipe(data);
    } catch (err) {
      toast.error("Failed to load recipe details");
    }
  };
  fetchRecipe();
}, [idMeal]);


  useEffect(() => {
    if (recipe) {
      setIsFavorited(
        favorites.some(
          (fav) => fav.idMeal === recipe.idMeal || fav._id === recipe._id
        )
      );
    }
  }, [favorites, recipe]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.warning("Please login to favorite recipes");
      return;
    }

    try {
      setIsFavorited((prev) => !prev);
      const response = await dispatch(toggleFavorite(recipe.idMeal)).unwrap();
      toast.success(response.message);
      dispatch(getProfile());
    } catch (err) {
      setIsFavorited((prev) => !prev);
      toast.error(err || "Failed to update favorite");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${recipe.idMeal}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.strMeal,
          text: `Check out ${recipe.strMeal} - ${recipe.strArea} cuisine!`,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}/video/${recipe.idMeal}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => toast.success("Link copied! Share with friends."))
      .catch(() => toast.error("Copy failed"));
  };

  if (!recipe) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-xl">
        Loading recipe details...
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-6"
      data-aos="fade-up"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto relative transition-all duration-500">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {recipe.strMeal}
          </h2>
          <div className="flex gap-3">
            <button onClick={handleFavorite} title="Add to Favorites">
              <span
                className={`text-3xl transition-all duration-300 ${
                  isFavorited ? "text-red-500 scale-110" : "text-gray-400"
                }`}
              >
                {isFavorited ? "❤️" : "🤍"}
              </span>
            </button>
            <button
              onClick={handleShare}
              title="Share this recipe"
              aria-label="Share"
            >
              <span className="text-2xl">↗️</span>
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full mb-6 overflow-hidden rounded-xl">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-[400px] object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="text-lg mb-2">
              <span className="font-semibold">Category:</span>{" "}
              {recipe.strCategory}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Cuisine:</span> {recipe.strArea}
            </p>
            <p className="text-lg mb-2">
              ⏱️ <span className="font-semibold">Cook Time:</span>{" "}
              {recipe.cookTime} mins
            </p>
            <p className="text-lg mb-2">
              🔥 <span className="font-semibold">Calories:</span>{" "}
              {recipe.nutrition?.calories || 0} kcal
            </p>
            <p className="text-lg mb-4">
              💪 <span className="font-semibold">Protein:</span>{" "}
              {recipe.nutrition?.protein || 0} g
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl shadow-inner">
            <h4 className="text-xl font-bold mb-3 text-orange-600">
              🧂 Ingredients
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-700 max-h-52 overflow-y-auto pr-2">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i}>
                  {ing} -{" "}
                  <span className="text-gray-500">
                    {recipe.measures?.[i] || ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <h4 className="text-2xl font-bold mb-3 text-gray-800">
            📖 Instructions
          </h4>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {recipe.strInstructions}
          </p>
        </div>

        {/* Video Section */}
        {recipe.strYoutube && (
          <div className="mt-8 flex justify-center">
            <Link
              to={`/video/${recipe.idMeal}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300"
            >
              📺 Watch Cooking Video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipe;
