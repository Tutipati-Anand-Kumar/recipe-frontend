import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SmartSuggestions from '../pages/SmartSuggestions';
import MealPlanner from '../pages/MealPlanner';
import Favorite from '../pages/Favorite';
import Profile from '../pages/Profile';
import Video from '../pages/Video';
import NotFound from '../pages/NotFound';
import Recipe from '../pages/Recipe'; // ✅ Import the Recipe page

export const RoutesComponent = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Protected Routes */}
    <Route
      path="/smart-suggestions"
      element={
        <PrivateRoute>
          <SmartSuggestions />
        </PrivateRoute>
      }
    />
    <Route
      path="/meal-planner"
      element={
        <PrivateRoute>
          <MealPlanner />
        </PrivateRoute>
      }
    />
    <Route
      path="/favorites"
      element={
        <PrivateRoute>
          <Favorite />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />
    <Route
      path="/video/:id"
      element={
        <PrivateRoute>
          <Video />
        </PrivateRoute>
      }
    />

    {/* ✅ New Protected Route for Recipe Details */}
    <Route
      path="/recipe/:idMeal"
      element={
        <PrivateRoute>
          <Recipe />
        </PrivateRoute>
      }
    />

    {/* 404 Page */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
