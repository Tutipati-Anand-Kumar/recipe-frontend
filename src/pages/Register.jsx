import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { validatePassword } from "val-pass";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationMessages, setValidationMessages] = useState([]);
  const [passwordValid, setPasswordValid] = useState(false);
  const [matchMessage, setMatchMessage] = useState("");
  const [showMatchMessage, setShowMatchMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // ✅ Handle Password Validation (val-pass)
 // Replace your handler with this:
const handlePasswordChange = (e) => {
  const value = e.target.value;
  setFormData((prev) => ({ ...prev, password: value }));

  // Defensive call to validatePassword
  let result;
  try {
    result = validatePassword(value, 8); // many versions call like this
  } catch (err) {
    // if validatePassword throws, fallback to a simple check
    console.warn('val-pass threw:', err);
    const msgs = value.length >= 8 ? ['No Error Detected'] : ['Password must be at least 8 characters'];
    setValidationMessages(msgs);
    setPasswordValid(msgs.length === 1 && msgs[0] === 'No Error Detected');
    return;
  }

  // Normalize messages
  let messages = [];
  let isValid = false;

  // Case A: method getAllValidationErrorMessage()
  if (result && typeof result.getAllValidationErrorMessage === 'function') {
    const ms = result.getAllValidationErrorMessage();
    messages = Array.isArray(ms) ? ms : [ms].filter(Boolean);
    // try different flags
    isValid = typeof result.isValid === 'function' ? result.isValid()
             : result.isValid === true || result.valid === true
             || (messages.length === 1 && messages[0] === 'No Error Detected');
  }
  // Case B: result is an object with errors/messages
  else if (result && Array.isArray(result.errors)) {
    messages = result.errors;
    isValid = result.isValid === true || result.valid === true || messages.length === 0;
  } else if (result && Array.isArray(result.messages)) {
    messages = result.messages;
    isValid = result.isValid === true || messages.length === 0;
  }
  // Case C: result itself is an array of messages
  else if (Array.isArray(result)) {
    messages = result;
    isValid = messages.length === 0 || (messages.length === 1 && messages[0] === 'No Error Detected');
  }
  // Case D: result is a simple object with a boolean and maybe a message string
  else if (result && typeof result === 'object') {
    if (typeof result.isValid === 'boolean') isValid = result.isValid;
    if (result.message) messages = [result.message];
  }
  // Fallback: if no shape matched
  else {
    messages = value.length >= 8 ? ['No Error Detected'] : ['Password must be at least 8 characters'];
    isValid = messages[0] === 'No Error Detected';
  }

  // Normalize: remove falsy values
  messages = messages.filter(Boolean);

  setValidationMessages(messages);
  setPasswordValid(Boolean(isValid));

  // If valid, hide the success message after 1.5s
  if (isValid) {
    setTimeout(() => {
      // only clear success messages (don't erase real errors that might appear later)
      setValidationMessages((prev) => {
        // if prev still indicates success, clear it
        if (prev.length === 1 && prev[0] === 'No Error Detected') return [];
        // Some versions return that exact string; if you show "✅ Strong password" mapping, adjust accordingly
        return prev;
      });
    }, 1500);
  }
};

  // ✅ Handle Confirm Password Live Match
  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, confirmPassword: value });

    if (!formData.password) return;

    if (value === formData.password) {
      setMatchMessage("✅ Passwords match");
      setShowMatchMessage(true);
      const timer = setTimeout(() => {
        setShowMatchMessage(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setMatchMessage("❌ Passwords do not match");
      setShowMatchMessage(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!passwordValid) {
      toast.error("❌ Please fix password errors before continuing.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("⚠️ Passwords do not match!");
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      toast.success("✅ Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error(error || "Registration failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-4 sm:p-6">
        <div className="w-full max-w-md sm:max-w-lg bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-transparent hover:border-pink-300 p-6 sm:p-10 transition-all duration-300">
          <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent drop-shadow-md">
            ✨ Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-orange-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 outline-none transition-all duration-300 text-sm sm:text-base"
              />
              <FaUser className="absolute left-4 top-3.5 text-gray-500 text-lg" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-orange-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 outline-none transition-all duration-300 text-sm sm:text-base"
              />
              <FaEnvelope className="absolute left-4 top-3.5 text-gray-500 text-lg" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handlePasswordChange}
                required
                className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 text-sm sm:text-base ${
                  passwordValid
                    ? "border-green-400 focus:border-green-500 focus:ring-green-200"
                    : "border-orange-300 focus:border-pink-500 focus:ring-pink-200"
                }`}
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

            {/* Password Messages */}
            {formData.password && validationMessages.length > 0 && (
              <div className="mt-2 space-y-1 text-sm px-1">
                {validationMessages.map((msg, i) => (
                  <p
                    key={i}
                    className={`transition-all duration-300 ${
                      msg === "No Error Detected"
                        ? "text-green-600 font-medium"
                        : "text-red-500"
                    }`}
                  >
                    {msg === "No Error Detected"
                      ? "✅ Strong password"
                      : `❌ ${msg}`}
                  </p>
                ))}
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleConfirmChange}
                required
                className="w-full pl-12 pr-10 py-3 border-2 border-orange-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 outline-none transition-all duration-300 text-sm sm:text-base"
              />
              <FaLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-3.5 text-gray-600 hover:text-pink-500 transition-all"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Match Message */}
            {showMatchMessage && (
              <p
                className={`mt-1 text-sm font-medium transition-all duration-300 ${
                  matchMessage.includes("match")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {matchMessage}
              </p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 sm:py-3.5 mt-2 font-semibold text-white rounded-xl shadow-md transition-all duration-300 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-pink-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register 🚀"}
            </button>
          </form>

          {/* Already have account */}
          <div className="text-center mt-5">
            <Link
              to="/login"
              className="text-pink-600 hover:underline font-medium transition-all duration-300"
            >
              Already have an account? Login →
            </Link>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;
