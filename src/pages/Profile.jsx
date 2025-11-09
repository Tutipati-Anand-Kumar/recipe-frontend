import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile, updateIngredients } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) setIngredients(profile.ingredients || []);
  }, [profile]);

  const handleUpdate = async () => {
    try {
      await dispatch(updateIngredients(ingredients)).unwrap();
      toast.success('✅ Ingredients updated successfully!');
    } catch (err) {
      toast.error('❌ Failed to update ingredients.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-pink-100">
        <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 text-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent drop-shadow-md">
            👤 Your Profile
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Manage your account details and ingredients here 🍳
          </p>
        </div>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-transparent bg-clip-padding hover:shadow-pink-200 transition-all duration-500">
          <div className="mb-6">
            <p className="text-lg font-semibold mb-1">
              <span className="text-orange-600">Username:</span>{' '}
              <span className="text-gray-700">{profile?.username}</span>
            </p>
            <p className="text-lg font-semibold">
              <span className="text-pink-600">Email:</span>{' '}
              <span className="text-gray-700">{profile?.email}</span>
            </p>
          </div>

          {/* Ingredient Section */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              🥕 Available Ingredients
            </h3>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Add ingredients (comma separated) and press Enter..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const newIng = e.target.value
                      .split(',')
                      .map((i) => i.trim())
                      .filter((i) => i);
                    setIngredients([...ingredients, ...newIng]);
                    e.target.value = '';
                  }
                }}
                className="w-full px-4 py-2 rounded-lg border-2 border-orange-300 focus:border-pink-500 outline-none transition-all duration-300 text-sm sm:text-base shadow-sm focus:shadow-md"
              />
              <div className="absolute right-3 top-2.5 text-orange-400 text-xl">🍽️</div>
            </div>

            {/* Ingredient List */}
            <ul className="space-y-2">
              {ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg px-3 py-2 hover:from-orange-200 hover:to-pink-200 transition-all duration-300 border border-orange-200 shadow-sm"
                >
                  <span className="font-medium text-gray-700">{ing}</span>
                  <button
                    onClick={() =>
                      setIngredients(ingredients.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform duration-200"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>

            {/* Update Button */}
            <button
              onClick={handleUpdate}
              className="mt-6 w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-pink-300"
            >
              💾 Update Ingredients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
