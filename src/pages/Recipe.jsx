import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleFavorite } from "../redux/slices/recipeSlice";
import { getProfile } from "../redux/slices/userSlice";
import AOS from "aos";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { FaShareAlt } from "react-icons/fa";

const Recipe = () => {
  const { idMeal } = useParams();
  const navigate = useNavigate();
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
        AOS.refreshHard();
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
      .then(() => toast.success("Link copied!"))
      .catch(() => toast.error("Copy failed"));
  };

  if (!recipe) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading recipe details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <Navbar />

      {/* Main Container */}
      <div className="max-w-8xl mx-auto px-4 py-4 md:py-5">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg shadow-md transition-all"
        >
          ⬅️ Back
        </button>

        <div
          className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 gap-6 transition-all duration-500"
          data-aos="fade-up"
        >
          {/* Left Side - Image */}
          <div
            className="overflow-hidden rounded-xl flex justify-center items-center"
            data-aos="zoom-in"
          >
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-[260px] md:h-[380px] object-fill rounded-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Side - Info */}
          <div className="flex flex-col justify-between text-gray-700 space-y-3">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {recipe.strMeal}
                </h2>

                <div className="flex gap-3 items-center">
                  <button onClick={handleFavorite}>
                    <span
                      className={`text-xl transition-all duration-300 ${
                        isFavorited ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      {isFavorited ? "❤️" : "🤍"}
                    </span>
                  </button>
                  <button
                    onClick={handleShare}
                    title="Share"
                    className="text-2xl text-blue-500 hover:text-blue-600"
                  >
                     <span className="text-xl"><FaShareAlt /></span>
                  </button>
                </div>
              </div>

              <p className="text-sm md:text-base mb-1">
                <span className="font-semibold">Category:</span>{" "}
                {recipe.strCategory}
              </p>
              <p className="text-sm md:text-base mb-1">
                <span className="font-semibold">Cuisine:</span>{" "}
                {recipe.strArea}
              </p>
              <p className="text-sm md:text-base mb-1">
                ⏱️ <span className="font-semibold">Cook Time:</span>{" "}
                {recipe.cookTime} mins
              </p>
              <p className="text-sm md:text-base mb-1">
                🔥 <span className="font-semibold">Calories:</span>{" "}
                {recipe.nutrition?.calories || 0} kcal
              </p>
              <p className="text-sm md:text-base mb-4">
                💪 <span className="font-semibold">Protein:</span>{" "}
                {recipe.nutrition?.protein || 0} g
              </p>

              {/* Ingredients */}
              <div className="bg-orange-50 p-3 md:p-4 rounded-xl shadow-inner">
                <h4 className="text-lg md:text-xl font-bold mb-2 text-orange-600">
                  🧂 Ingredients
                </h4>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-700 max-h-48 overflow-y-auto pr-2">
                  {recipe.ingredients?.map((ing, i) => (
                    <li key={i}>
                      {ing}{" "}
                      <span className="text-gray-500">
                        {recipe.measures?.[i] || ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Watch Video */}
            {recipe.strYoutube && (
              <div className="mt-4 flex justify-center md:justify-start">
                <Link
                  to={`/video/${recipe.idMeal}`}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-md transition-all text-sm md:text-base"
                >
                  📺 Watch Cooking Video
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div
          className="bg-white mt-6 p-4 md:p-6 rounded-xl shadow-md"
          data-aos="fade-up"
        >
          <h4 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
            📖 Instructions
          </h4>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {recipe.strInstructions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
