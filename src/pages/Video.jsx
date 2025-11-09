import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getRecipe } from "../redux/slices/recipeSlice";

const Video = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRecipe, loading } = useSelector((state) => state.recipe);

  useEffect(() => {
    dispatch(getRecipe(id));
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <p className="text-xl font-semibold text-pink-600 animate-pulse">
          Loading video...
        </p>
      </div>
    );

  const videoId = currentRecipe?.strYoutube
    ? currentRecipe.strYoutube.split("v=")[1]
    : null;

  // Split recipe instructions into steps
  const steps = currentRecipe?.strInstructions
    ? currentRecipe.strInstructions.split(/(?<=\.)\s+/)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      <Navbar />

      <div className="container px-4 py-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-2xl max-[500px]:text-[16px] font-extrabold text-center bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4 drop-shadow-md">
          {currentRecipe?.strMeal || "Delicious Recipe"}
        </h1>

         {/* Category & Origin Info */}
        <div>
          {currentRecipe?.strCategory && (
          <div className="max-w-3xl mx-auto text-center mb-4">
            <div className="inline-flex justify-center gap-2">
              <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-2 py-2 rounded-full font-semibold shadow-md max-[500px]:text-[12px]">
                🍱 Category: {currentRecipe.strCategory}
              </span>
              {currentRecipe.strArea && (
                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-2 py-2 rounded-full font-semibold shadow-md max-[500px]:text-[12px]">
                  🌍 Origin: {currentRecipe.strArea}
                </span>
              )}
            </div>
          </div>
        )}
        </div>
        </div>

        {/* Two-column responsive layout */}
        <div className="flex flex-row items-start gap-8 justify-center max-[650px]:flex-col">
          {/* Video Section */}
          {videoId ? (
            <div className="flex-1 max-[650px]:w-full bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-transparent hover:border-pink-300 overflow-hidden transition-all duration-300">
              <div className="relative w-full pb-[56.25%] h-[62vh]">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title="Recipe Video"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-t-2xl transition-all duration-300 hover:scale-[1.01]"
                />
              </div>
              <div className="p-3">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2 max-[500px]:text-[18px]">
                  🎥 Cooking Tutorial
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-[500px]:text-[12px]">
                  Watch this step-by-step recipe preparation and follow along!
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 italic">
              No video available for this recipe.
            </p>
          )}

          {/* Steps Section */}
          <div
            className="flex-1 bg-white/80 backdrop-blur-md p-6 sm:p-5 max-[400px]:p-4 rounded-2xl shadow-lg border border-transparent hover:border-orange-300 transition-all duration-300
            max-h-[75vh] overflow-y-auto custom-scroll"
          >
            <h2 className="text-2xl font-bold mb-5 text-center bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent max-[500px]:text-[18px]">
              🥣 Step-by-Step Instructions
            </h2>

            {steps.length > 0 ? (
              <ol className="space-y-4">
                {steps.map((step, index) => {
                  const colors = [
                    "bg-pink-100 text-pink-700 border-pink-300",
                    "bg-orange-100 text-orange-700 border-orange-300",
                    "bg-yellow-100 text-yellow-700 border-yellow-300",
                    "bg-green-100 text-green-700 border-green-300",
                    "bg-blue-100 text-blue-700 border-blue-300",
                    "bg-purple-100 text-purple-700 border-purple-300",
                  ];
                  const colorClass = colors[index % colors.length];
                  return (
                    <li
                      key={index}
                      className={`flex items-start gap-3 p-4 border-l-4 ${colorClass} rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
                    >
                      <span className="font-semibold text-lg shrink-0 max-[500px]:text-[14px]">
                        Step {index + 1}.
                      </span>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {step.trim()}
                      </p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-center text-gray-500 italic">
                Instructions not available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style jsx="true">{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fb923c, #ec4899);
          border-radius: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f97316, #db2777);
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Video;
