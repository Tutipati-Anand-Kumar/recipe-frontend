import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";

const ForgetPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForget = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forget-password", { email });
      setStep(2);
      toast.success("✅ Email verified! Proceed to reset your password.");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Verification failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, newPassword });
      toast.success("🎉 Password reset successful! You can now log in.");
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Reset failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-30 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-transparent hover:border-orange-300 w-full max-w-sm sm:max-w-md text-center transition-all duration-300"
        >
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
            🔒 Forget Password
          </h2>

          {step === 1 ? (
            <form onSubmit={handleForget} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-orange-300 focus:border-pink-500 outline-none transition-all duration-300 text-sm sm:text-base shadow-sm focus:shadow-md"
                required
                disabled={loading}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-pink-300 ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-gray-300 ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <input
                type="password"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-orange-300 focus:border-pink-500 outline-none transition-all duration-300 text-sm sm:text-base shadow-sm focus:shadow-md"
                required
                disabled={loading}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-pink-300 ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setNewPassword("");
                  }}
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-gray-300 ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ForgetPasswordModal;
