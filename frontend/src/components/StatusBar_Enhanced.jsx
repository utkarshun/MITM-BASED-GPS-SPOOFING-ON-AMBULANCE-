import React from "react";
import { motion } from "framer-motion";
function StatusBar({ isConnected, currentCommand, latency, connectionTime }) {
  const getConnectionDuration = () => {
    if (!connectionTime) return "0s";
    const diff = Math.floor((new Date() - connectionTime) / 1000);
    if (diff < 60) return `${diff}s`;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}m ${seconds}s`;
  };

  const commandLabels = {
    F: "🚀 FORWARD",
    B: "⏮️ BACKWARD",
    L: "⬅️ LEFT",
    R: "➡️ RIGHT",
    S: "🛑 STOPPED",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12 pt-8 border-t border-neon-blue border-opacity-30"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Connection Status */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-neon-blue border-opacity-30 backdrop-blur-xl p-4 rounded-xl">
          <div className="text-xs text-gray-400 font-orbitron mb-2">STATUS</div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-neon-green" : "bg-red-500"
                }`}
                animate={
                  isConnected
                    ? {
                        boxShadow: [
                          "0 0 0 0px rgba(47, 232, 160, 0.7)",
                          "0 0 0 10px rgba(47, 232, 160, 0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className={`font-bold ${
                  isConnected ? "text-neon-green" : "text-red-500"
                }`}
              >
                {isConnected ? "CONNECTED" : "DISCONNECTED"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Connection Time */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-neon-blue border-opacity-30 backdrop-blur-xl p-4 rounded-xl">
          <div className="text-xs text-gray-400 font-orbitron mb-2">UPTIME</div>
          <div className="text-lg font-orbitron font-bold text-neon-blue">
            {isConnected ? getConnectionDuration() : "—"}
          </div>
        </div>

        {/* Latency */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-neon-blue border-opacity-30 backdrop-blur-xl p-4 rounded-xl">
          <div className="text-xs text-gray-400 font-orbitron mb-2">
            LATENCY
          </div>
          <motion.div
            key={latency}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-lg font-orbitron font-bold text-neon-green"
          >
            {isConnected ? `${latency}ms` : "—"}
          </motion.div>
        </div>

        {/* Current Command */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-neon-blue border-opacity-30 backdrop-blur-xl p-4 rounded-xl">
          <div className="text-xs text-gray-400 font-orbitron mb-2">
            LAST CMD
          </div>
          <motion.div
            key={currentCommand}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-orbitron font-bold text-neon-blue"
          >
            {currentCommand ? commandLabels[currentCommand] || "—" : "—"}
          </motion.div>
        </div>
      </div>

      {/* Info bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-neon-blue from-opacity-10 to-neon-green to-opacity-10 border border-neon-blue border-opacity-20 rounded-lg text-center text-sm text-gray-300"
      >
        <span className="font-orbitron text-neon-blue">
          WiFi Robot Controller v1.0
        </span>{" "}
        •<span className="ml-2">ESP32-based autonomous vehicle system</span>
      </motion.div>
    </motion.div>
  );
}

export default StatusBar;
