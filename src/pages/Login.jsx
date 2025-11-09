import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ForgetPasswordModal from "../components/ForgetPasswordModal";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgetModal, setShowForgetModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    dispatch(clearError());
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("🎉 Login successful!");
      navigate("/");
    } catch (err) {
      if (error?.toLowerCase().includes("password")) {
        toast.error("❌ Invalid password. Please try again.");
      } else if (error?.toLowerCase().includes("email")) {
        toast.error("⚠️ Invalid email address.");
      } else {
        toast.error("🚫 Invalid credentials. Please check your details.");
      }
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-4 sm:p-6">
        <div className="w-full max-w-md sm:max-w-lg bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-transparent hover:border-pink-300 p-6 sm:p-10 transition-all duration-300">
          <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent drop-shadow-md">
            🔐 Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 border-2 border-orange-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 outline-none transition-all duration-300 text-sm sm:text-base"
              />
              <FaEnvelope className="absolute left-4 top-3.5 text-gray-500 text-lg" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-12 pr-10 py-3 border-2 border-orange-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 outline-none transition-all duration-300 text-sm sm:text-base"
              />
              <FaLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-600 hover:text-pink-500 transition-all"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Forgot Password */}
            <button
              type="button"
              onClick={() => setShowForgetModal(true)}
              disabled={loading}
              className="text-left text-pink-600 hover:underline text-sm sm:text-base transition-all duration-300"
            >
              Forgot Password?
            </button>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 sm:py-3.5 mt-2 font-semibold text-white rounded-xl shadow-md transition-all duration-300 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-pink-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login 🚀"}
            </button>
          </form>

          {/* Create Account */}
          <div className="text-center mt-5">
            <Link
              to="/register"
              className="text-pink-600 hover:underline font-medium transition-all duration-300"
            >
              Don’t have an account? Register →
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mt-3 text-sm sm:text-base font-medium">
              {error}
            </p>
          )}
        </div>
      </div>

      {showForgetModal && (
        <ForgetPasswordModal onClose={() => setShowForgetModal(false)} />
      )}
    </div>
  );
};

export default Login;
