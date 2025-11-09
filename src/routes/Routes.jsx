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

export const RoutesComponent = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/smart-suggestions" element={
      <PrivateRoute>
        <SmartSuggestions />
      </PrivateRoute>
    } />
    <Route path="/meal-planner" element={
      <PrivateRoute>
        <MealPlanner />
      </PrivateRoute>
    } />
    <Route path="/favorites" element={
      <PrivateRoute>
        <Favorite />
      </PrivateRoute>
    } />
    <Route path="/profile" element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    } />
    <Route path="/video/:id" element={
      <PrivateRoute>
        <Video />
      </PrivateRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);