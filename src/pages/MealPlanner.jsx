import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { createMealPlan, generateGroceryList, shareMealPlan } from '../redux/slices/mealPlanSlice';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';

const MealPlanner = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.mealPlan);
  const [week, setWeek] = useState(1);
  const [meals, setMeals] = useState([{ day: 'Mon', recipe: '', recipeName: '', type: 'dinner' }]);
  const [selectedPlanId, setSelectedPlanId] = useState('');

  useEffect(() => {
    console.log('🍽️ Meals after update:', meals);
  }, [meals]);

  const addMeal = () => {
    setMeals((prev) => [...prev, { day: 'Tue', recipe: '', recipeName: '', type: 'dinner' }]);
  };

  const updateMeal = (index, field, value) => {
    setMeals((prevMeals) => {
      const updated = [...prevMeals];
      updated[index] = { ...updated[index], [field]: value };
      console.log('✅ Meal updated:', updated);
      return updated;
    });
  };

  const handleRecipeSelect = (index, selectedRecipe) => {
    const recipeId = selectedRecipe.idMeal || selectedRecipe._id;
    console.log('Recipe ID:', recipeId);
    updateMeal(index, 'recipe', recipeId);
    updateMeal(index, 'recipeName', selectedRecipe.strMeal);
    toast.info(`Selected: ${selectedRecipe.strMeal}`);
  };

  const handleSearchResults = (data, index) => {
    if (data && data.length > 0) handleRecipeSelect(index, data[0]);
  };

  const handleCreate = async () => {
    if (meals.some((meal) => !meal.recipe)) {
      toast.warning('⚠️ Please select all recipes');
      return;
    }
    try {
      const plan = await dispatch(createMealPlan({ week, meals })).unwrap();
      setSelectedPlanId(plan._id);
      toast.success('✅ Plan created successfully!');
    } catch {
      toast.error('❌ Failed to create plan.');
    }
  };

  const handleGenerateGrocery = async () => {
    if (!selectedPlanId) return toast.warning('🛒 Create a plan first');
    try {
      await dispatch(generateGroceryList(selectedPlanId)).unwrap();
      toast.success('🛍️ Grocery list generated!');
    } catch {
      toast.error('❌ Error generating grocery list');
    }
  };

  const handleShare = async () => {
    if (!selectedPlanId) return toast.warning('🔗 Create a plan first');
    try {
      const data = await dispatch(shareMealPlan(selectedPlanId)).unwrap();
      toast.info(`📤 Share Link: ${data.shareUrl}`);
    } catch {
      toast.error('❌ Failed to share plan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 text-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent drop-shadow-md">
            🍽️ Meal Planner
          </h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm md:text-base">
            Plan your weekly meals with style and ease!
          </p>
        </div>

        {/* Meal Planner Card */}
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-transparent hover:border-pink-200 transition-all duration-500 hover:shadow-pink-200">
          <div className="space-y-5 sm:space-y-6 mb-8">
            <input
              type="number"
              placeholder="Week number"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full sm:w-2/3 md:w-1/2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-orange-300 focus:border-pink-500 outline-none transition-all duration-300 text-sm sm:text-base shadow-sm focus:shadow-md mx-auto block"
            />

            {/* Meals Section */}
            {meals.map((meal, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-orange-100 to-pink-100 p-4 sm:p-6 rounded-2xl border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start md:items-center">
                  <select
                    value={meal.day}
                    onChange={(e) => updateMeal(index, 'day', e.target.value)}
                    className="flex-1 min-w-[130px] sm:min-w-[150px] p-2 sm:p-3 text-sm sm:text-base border-2 border-orange-300 rounded-xl focus:border-pink-500 outline-none transition-all"
                  >
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>

                  <div className="flex-1 relative w-full">
                    <input
                      type="text"
                      placeholder="Selected recipe will appear here..."
                      value={meal.recipeName || ''}
                      readOnly
                      className="w-full p-2 sm:p-3 pr-10 text-sm sm:text-base border-2 border-orange-300 rounded-xl focus:border-pink-500 bg-gray-50 outline-none transition-all"
                    />
                    <SearchBar
                      onResults={(data) => handleSearchResults(data, index)}
                      onSelect={(recipe) => handleRecipeSelect(index, recipe)}
                      type="name"
                      noNavigate={true}
                      placeholder="Type to search recipes..."
                    />
                  </div>

                  <select
                    value={meal.type}
                    onChange={(e) => updateMeal(index, 'type', e.target.value)}
                    className="flex-1 min-w-[130px] sm:min-w-[150px] p-2 sm:p-3 text-sm sm:text-base border-2 border-orange-300 rounded-xl focus:border-pink-500 outline-none transition-all"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
              </div>
            ))}

            {/* Add / Create Buttons */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-6">
              <button
                onClick={addMeal}
                className="px-5 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:ring-4 focus:ring-blue-300"
              >
                ➕ Add Meal
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || meals.some((m) => !m.recipe)}
                className={`px-5 sm:px-8 py-2 sm:py-3 font-semibold text-sm sm:text-base rounded-full shadow-lg focus:ring-4 focus:ring-pink-300 transition-all ${
                  loading || meals.some((m) => !m.recipe)
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                📅 Create Plan
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          {selectedPlanId && (
            <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
              <button
                onClick={handleGenerateGrocery}
                disabled={loading}
                className={`px-5 sm:px-8 py-2 sm:py-3 font-semibold text-sm sm:text-base rounded-full shadow-lg focus:ring-4 focus:ring-green-300 transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                🛒 Generate Grocery
              </button>
              <button
                onClick={handleShare}
                disabled={loading}
                className={`px-5 sm:px-8 py-2 sm:py-3 font-semibold text-sm sm:text-base rounded-full shadow-lg focus:ring-4 focus:ring-purple-300 transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                🔗 Share Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
