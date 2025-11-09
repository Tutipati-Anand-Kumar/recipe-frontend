import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const LogoutModal = ({ onConfirm, onClose }) => (
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
        className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-transparent hover:border-pink-300 w-full max-w-sm sm:max-w-md text-center transition-all duration-300"
      >
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-3">
          Confirm Logout
        </h2>

        <p className="text-gray-700 text-sm sm:text-base mb-6">
          Are you sure you want to log out? You’ll need to sign in again to access your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onConfirm(); // ✅ call logout
              onClose();   // ✅ close modal
            }}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-pink-300"
          >
            🚪 Yes, Logout
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-gray-300"
          >
            ❌ Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export default LogoutModal;
